import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import _,{ delay, round } from "lodash"
import FacebookApiClient from "../../../api-clients/fb.api-client"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import postsRepo from "../../../api-server/notion/repos/posts.repo"
import { JWT_SECURE_KEY, MAX_REQUEST_PAGE_SIZE, PERIOD, TIME_INTERVAL, TYPE_OBJECT, TIMEZONE_ZERO } from "../../../constant"
import * as momentTz from 'moment-timezone'

export default async function getSummary(req, res) {
    const {token, period} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    
    if (payload) {       
        let response, resContent, resPost
        console.log("query", period)
        
        // resContent = await contentsRepo.getContentByDate(period)
        resPost = await postsRepo.getPostByDate(period)         
        let temp = []
        for(var i=0; i<resPost.length; i++) {
            temp.push({
                id: resPost[i]?.id,
                object_id: resPost[i]?.properties?.object_id?.rich_text?.[0]?.plain_text,
                title: resPost[i]?.properties?.title?.title?.[0]?.plain_text,
                channel_name: resPost[i]?.properties?.channel_name?.rollup?.array?.[0]?.title?.[0]?.plain_text,                
                publish_information: {
                    url: resPost[i]?.properties?.url?.rich_text?.[0]?.plain_text,
                    is_deleted: resPost[i]?.properties?.is_deleted?.checkbox,
                    is_published: resPost[i]?.properties?.is_published?.checkbox,
                    object_created_time: resPost[i]?.properties?.object_created_time?.date?.start,
                    object_schedule_time: resPost[i]?.properties?.object_schedule_time?.date?.start,
                },
                statictis_lifetime: {
                    impression: resPost[i]?.properties?.impression?.number,
                    reach: resPost[i]?.properties?.reach?.number,
                    comment: resPost[i]?.properties?.comment?.number,
                    share: resPost[i]?.properties?.share?.number,
                    view: resPost[i]?.properties?.view?.number,
                    reaction: resPost[i]?.properties?.reaction?.number,
                },
                moneitize_lifetime: {
                    earning: resPost[i]?.properties?.earning?.number || 0,
                    cpm: resPost[i]?.properties?.cpm?.number || 0,
                    ad_impression: resPost[i]?.properties?.ad_impression?.number || 0,
                },
                meta: {
                    resource: {
                        id: resPost[i]?.properties?.of_resource?.relation?.[0]?.id, 
                        title: resPost[i]?.properties?.resources_title?.rollup?.array?.[0]?.title?.[0]?.plain_text,
                    },
                    object_thumbnail: resPost[i]?.properties?.object_thumbnail?.files?.[0]?.external?.url,
                    created_at: resPost[i]?.created_time
                }
            })
        }

        response = {
            // contents: resContent || [],
            // posts: resPost || [],
            posts: temp
        }

        return res.send(response || null)        

        // for (var i=0; i<resPost?.length; i++) {            
        //     if (resPost[i]?.properties?.diff?.formula?.number < TIME_INTERVAL.OBJECT_INSIGHT) continue;
        //     if (resPost[i]?.properties?.is_deleted?.checkbox === true) continue;
        //     delay(handleGetPostInsight, 2000*i, resPost[i])
        // }

        // return true
    } 
    res.send(null)
}

let handleGetPostInsight = async(post) => {
    console.log(">>>> postid:", post?.id)
    const objectNotionID = post?.id
    const channelAccessToken = post?.properties?.channel_access_token?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text
    const channelID = post?.properties?.channel_id?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text
    const objectID = post?.properties?.object_id?.rich_text?.[0]?.plain_text        
    const typeObject = post?.properties?.type_object?.select?.name

    // CHECK OBJECT STATUS
    // ONLY UPDATE STATUS AND POST INFORMATION TO DATABASE
        
    let objectInformationResponse = null
    if (typeObject === TYPE_OBJECT.VIDEO) {
        objectInformationResponse = await FacebookApiClient.getVideoDetail(objectID, channelAccessToken)
    } else {
        objectInformationResponse = await FacebookApiClient.getPostDetail(channelID, objectID, channelAccessToken)
    }
    
    // START ==========================================================================
    // HANDLE RESPONSE BASIC DATA OF OBJECT DETAIL
    // ================================================================================            
    if (!objectInformationResponse)
        return {
            error: true,
            msg: "Có lỗi xảy ra"
        }       

    // #OPTION_1
    // IN CASE FETCH GRAPH API ON OBJECT DETAIL WAS ERROR
    // OBJECT WAS BE DELETED & UPDATE STATUS TO DATABASE
    if (objectInformationResponse?.error === true)  {
        const {code, error_subcode} = objectInformationResponse?.data?.data?.error ||{}
        
        if (code === 10 || (code === 100 && error_subcode === 33)) {
            const updateRes = await postsRepo.updatePageByPropertise(objectNotionID, {
                is_deleted : {
                    checkbox: true
                },
            })

            return {
                error: true,
                msg: "Bài đăng đã bị xóa",
                data: objectInformationResponse?.data?.data?.error?.message
            }
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STOP.
        }                 
    }

    // #OPTION_2 
    // IN CASE FETCH GRAPH API ON OBJECT DETAIL WAS SUCCESSFUL
    // PROCESSING TO UPDATE DATABASE
    
    const objectInformation = objectInformationResponse?.data
    const updateObjectResponse = updateObject(objectNotionID, objectInformation?.title, objectInformation?.created_time, objectInformation?.published, objectInformation?.scheduled_publish_time)
    
    // IN CASE POST NOT PUBLISHDED, DON'T NEED TO CHECK STATISTIC            
    if (objectInformation?.published === false || _.isNull(objectInformation?.published)) return;
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STOP.
    // ================================================================================
    // HANDLE RESPONSE BASIC DATA OF OBJECT DETAIL
    // ============================================================================ END
    
    
    // START ==========================================================================
    // UPDATE INSIGHT STATISTIC ON POST PUSHLISHED ALREADY
    // ================================================================================
    let data = null
    
    if (typeObject === TYPE_OBJECT.POST) {                        
        data = await FacebookApiClient.getPostInsightWithLifetimePeriod(channelID, objectID, channelAccessToken)            
    } else if (typeObject === TYPE_OBJECT.VIDEO) {
        data = await FacebookApiClient.getVideoInsightByLifetime(objectID, channelAccessToken)
    }

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
        if (_.isNull(impression) || _.isNull(reach)) return;                

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
        }
        const udpateObject = postsRepo.updatePostStatistic(objectNotionID, statistic.impression, statistic.reach, statistic.view, statistic.comment, statistic.share, statistic.reaction, statistic.ad_impression, statistic.earning, statistic.cpm)
        
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STOP.
    } 
}

const updateObject = (objectNotionID, objectTitle, objectCreatedTime, isPublished, objectScheduleTime ) => {
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
            object_created_time: {
                date: {
                    start: momentTz.tz(objectCreatedTime, TIMEZONE_ZERO).tz('Asia/Bangkok').toISOString(true)
                }
            },
            object_schedule_time: {
                date: {
                    start: momentTz.tz(objectScheduleTime, TIMEZONE_ZERO).tz('Asia/Bangkok').toISOString(true)
                }
            }            
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