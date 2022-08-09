import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import postsRepo from "../../../../api-server/notion/repos/posts.repo"
import FacebookApiClient from "../../../../api-clients/fb.api-client"
import {diff_minutes} from "../../../../utils/sand-utils"
import { JWT_SECURE_KEY, TIMEZONE_ZERO, TIME_INTERVAL, TYPE_OBJECT } from "../../../../constant"
import _, { round } from "lodash"
import * as momentTz from 'moment-timezone'

export default async function getObjectInsight(req, res) {
    const {token} = req.body
    const {id : objectNotionID} = req.query
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    
    if (payload) {            
        try {
            const getPost = await postsRepo.retrive(objectNotionID)
            if (!getPost) return res.send(null)        
            
            const channelAccessToken = getPost?.properties?.channel_access_token?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text
            const channelID = getPost?.properties?.channel_id?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text
            const objectID = getPost?.properties?.object_id?.rich_text?.[0]?.plain_text        
            const typeObject = getPost?.properties?.type_object?.select?.name
            
            
            // CHECK OBJECT STATUS
            // ONLY UPDATE STATUS AND POST INFORMATION TO DATABASE
            
            let objectInformationResponse = null
            if (typeObject === TYPE_OBJECT.VIDEO) {
                objectInformationResponse = await FacebookApiClient.getVideoDetail(objectID, channelAccessToken)
                console.log("object detail: ", objectInformationResponse)
            } else {
                objectInformationResponse = await FacebookApiClient.getPostDetail(channelID, objectID, channelAccessToken)
                console.log("post detail: ", objectInformationResponse)
            }
                        
            // START ==========================================================================
            // HANDLE RESPONSE BASIC DATA OF OBJECT DETAIL
            // ================================================================================            
            if (!objectInformationResponse)
                return res.send({
                    error: true,
                    msg: "Có lỗi xảy ra"
                })            

            // #OPTION_1
            // IN CASE FETCH GRAPH API ON OBJECT DETAIL WAS ERROR
            // OBJECT WAS BE DELETED & UPDATE STATUS TO DATABASE
            
            if (objectInformationResponse?.error === true)  {                
                const {code, error_subcode} = objectInformationResponse?.data?.data?.error
                console.log("error code: ", code, error_subcode)
                if (code === 10 || (code === 100 && error_subcode === 33)) {
                    const updateRes = await postsRepo.updatePageByPropertise(objectNotionID, {
                        is_deleted : {
                            checkbox: true
                        },
                    })

                    return res.send({
                        error: true,
                        msg: "Bài đăng đã bị xóa",
                        data: objectInformationResponse?.data?.data?.error?.message
                    })
                    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STOP.
                }                 
            }

            // #OPTION_2 
            // IN CASE FETCH GRAPH API ON OBJECT DETAIL WAS SUCCESSFUL
            // PROCESSING TO UPDATE DATABASE
            
            const objectInformation = objectInformationResponse?.data
            if (_.isNull(objectInformation?.title)) {
                return res.send({
                    error: true,                    
                    msg: `Video chưa đặt tiêu đề, vui lòng cập nhật tiêu đề ở Creator Studio và thực hiện lại !`
                })
            }
            console.log("objectInformation: ", objectInformation)
            const updateObjectResponse = updateObject(objectNotionID, objectInformation?.title, objectInformation?.created_time, objectInformation?.published, objectInformation?.scheduled_publish_time, objectInformation.thumbnails)
            
            // IN CASE POST NOT PUBLISHDED, DON'T NEED TO CHECK STATISTIC            
            if (objectInformation?.published === false || _.isNull(objectInformation?.published)) 
                return res.send({
                    error: true,                    
                    msg: `Post đang lên lịch, ${momentTz.tz(objectInformation.scheduled_publish_time, TIMEZONE_ZERO).tz("Asia/Bangkok").toLocaleString("vi-VN")}`
                });        
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STOP.
            // ================================================================================
            // HANDLE RESPONSE BASIC DATA OF OBJECT DETAIL
            // ============================================================================ END


            // START ==========================================================================
            // UPDATE INSIGHT STATISTIC ON POST PUSHLISHED ALREADY
            // ================================================================================
            let data
            if (typeObject === TYPE_OBJECT.POST) {                        
                data = await FacebookApiClient.getPostInsightWithLifetimePeriod(channelID, objectID, channelAccessToken)            
            } else if (typeObject === TYPE_OBJECT.VIDEO) {
                data = await FacebookApiClient.getVideoInsightByLifetime(objectID, channelAccessToken)
            }
            console.log(data)
            if (data?.error === false) {
                let impression = typeObject === TYPE_OBJECT.POST ? data?.data?.impression_quantity : data?.data?.total_video_impressions
                let reach = typeObject === TYPE_OBJECT.POST ? data?.data?.unique_impression_quantity : data?.data?.total_video_impressions_unique
                let view = typeObject === TYPE_OBJECT.POST ? data?.data?.post_video_views : data?.data?.total_video_views
                let comment = typeObject === TYPE_OBJECT.POST ? data?.data?.comment_quantity : data?.data?.comment_quantity
                let share = typeObject === TYPE_OBJECT.POST ? data?.data?.share_quantity : data?.data?.share_quantity
                let reaction = typeObject === TYPE_OBJECT.POST ? data?.data?.reaction_quantity : data?.data?.reaction_quantity
                let earning = typeObject === TYPE_OBJECT.POST ? data?.data?.post_video_ad_break_earnings : data?.data?.total_video_ad_break_earnings
                let cpm = typeObject === TYPE_OBJECT.POST ? data?.data?.post_video_ad_break_ad_cpm : data?.data?.total_video_ad_break_ad_cpm
                let adImpression = typeObject === TYPE_OBJECT.POST ? data?.data?.post_video_ad_break_ad_impressions : data?.data?.total_video_ad_break_ad_impressions
                // IF DATA IS NULL OF IMPRESSION OR REACH, THIS POST WILL BE NOT PUBLISHED OR NOT EXISTED
                if (_.isNull(impression) || _.isNull(reach)) 
                    return res.send({
                        error: true,
                        msg: "Bài viết có thể đã bị xóa, vui lòng kiểm tra lại",
                        data: data
                    })

                // IF POST STATISTIC DATA EXISTED, WILL BE LIVED ALREADY
                let statistic = {
                    impression: impression,
                    reach: reach,
                    view: view || 0,
                    comment: comment || 0,
                    share: share || 0,
                    reaction: reaction || 0,
                    ad_impression: adImpression || 0,
                    earning: round((earning)/100,2) || 0,
                    cpm: round((cpm)/100,2) || 0,
                    isPublished: objectInformation?.published
                }
                const udpateObject = postsRepo.updatePostStatistic(objectNotionID, statistic.impression, statistic.reach, statistic.view, statistic.comment, statistic.share, statistic.reaction, statistic.ad_impression, statistic.earning, statistic.cpm)
                return res.send({
                    error: false,
                    data: {
                        ...statistic,
                        createdTime: momentTz.tz(objectInformation.created_time, TIMEZONE_ZERO).tz("Asia/Bangkok"),
                        scheduleTime: momentTz.tz(objectInformation.scheduled_publish_time, TIMEZONE_ZERO).tz("Asia/Bangkok")
                    }
                })
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STOP.
            }

            
            // ERROR: DATA WILL BE UNDEFINED OR GOT ERROR / ERROR = TRUE
            console.log("data: ", data?.data?.error?.code)
            return res.send({
                error: true,
                msg: "Bài viết có thể đã bị xóa, vui lòng kiểm tra lại",
                data: data
            })        
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STOP.
            // ================================================================================
            // UPDATE INSIGHT STATISTIC ON POST PUSHLISHED ALREADY
            // =========================================================================== END.

        } catch (error) {
            console.log("error occured: ", error)
        }                   
    } 
    res.send(null)
}

const updateObject = (objectNotionID, objectTitle, objectCreatedTime, isPublished, objectScheduleTime, objectThumbnail ) => {
    let response = null
    if (!_.isNull(objectScheduleTime)) {
        response = postsRepo.updatePageByPropertise(objectNotionID, {
            title: {
                title: [
                    {
                        text: {
                            content: objectTitle || ""
                        },
                    },
                ]
            },
            is_published: {
                checkbox: isPublished || false
            },
            object_thumbnail: {
                files: [
                    {
                        type: "external",
                        name: "thumb",       
                        external: {
                            url: objectThumbnail || ""
                        }                     
                    }                    
                ]
            },            
            object_created_time: {
                date: {
                    start: momentTz.tz(objectCreatedTime, TIMEZONE_ZERO).tz('Asia/Bangkok').toISOString(true)
                }
            },
            object_schedule_time: {
                date: {
                    start: momentTz.tz(objectScheduleTime, TIMEZONE_ZERO).tz('Asia/Bangkok').toISOString(true)
                }
            },            
        })
    } else {
        response = postsRepo.updatePageByPropertise(objectNotionID, {
            title: {
                title: [
                    {
                        text: {
                            content: objectTitle
                        },
                    },
                ]                    
            },
            object_thumbnail: {
                files: [
                    {
                        type: "external",
                        name: "thumb",       
                        external: {
                            url: objectThumbnail || ""
                        }                     
                    }                    
                ]
            },   
            is_published: {
                checkbox: isPublished || false
            },            
            object_created_time: {
                date: {
                    start: momentTz.tz(objectCreatedTime, TIMEZONE_ZERO).tz('Asia/Bangkok').toISOString(true)
                }
            }            
        })
    }

    return response

}