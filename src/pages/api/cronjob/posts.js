import _,{ delay, round } from "lodash"
import FacebookApiClient from "../../../api-clients/fb.api-client"
import postsRepo from "../../../api-server/notion/repos/posts.repo"
import { TIMEZONE_ZERO, TIME_INTERVAL, TYPE_OBJECT } from "../../../constant"
import { diff_days, diff_minutes } from "../../../utils/sand-utils"
import * as momentTz from 'moment-timezone'

export default async function cronjobPostInsight(req, res) {    

    res.send("success")
    
    let response = await postsRepo.getManyByCondition(
        {
            and: [
                {
                    property: "object_id",
                    rich_text: {
                        is_not_empty: true
                    }
                },                
                {
                    property: "diff",
                    number: {
                        greater_than: TIME_INTERVAL.OBJECT_INSIGHT
                        // only update post was update greater than 45mins
                    }
                },                
                {
                    property: "is_deleted",
                    checkbox: {
                        equals: false
                    }
                },                
                {
                    property: "old_days",
                    number: {
                        less_than: TIME_INTERVAL.OLD_OBJECT_DATE_FRESH_DAILY
                        // only update post was created is less than 7 days
                    }
                },                
                // {
                //     property: "channel_id",
                //     rollup: {
                //         any: {
                //             rich_text: {
                //                 contains: "103800054844993"
                //             }
                //         }
                //     }
                // },                
            ]            
        },     
        [
            {property: "diff",direction: "descending"},
            {property: "old_days",direction: "ascending"},
            {property: "last_updated_at",direction: "descending"},
            
            
        ],
        undefined,
        100
    )
    
    const postList = [...response?.results]
    for (var i=0; i < postList?.length; i++ ) {
        console.log("=== ", i, ":")
        delay(handleGetPostInsight, 2000 * i, postList[i])        
    }    
    
}

let handleGetPostInsight = async(post) => {
    try {
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
            console.log("update data ....")
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
    } catch (error) {
        console.log("hanlde get insight got error: ", error)
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
            }                
        })
    }
    return response
}