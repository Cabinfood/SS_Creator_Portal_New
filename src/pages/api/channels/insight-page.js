import { JWT_SECURE_KEY } from "../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import FacebookApiClient from "../../../api-clients/fb.api-client";
import channelRepo from "../../../api-server/notion/repos/channel.repo";
import { diff_minutes } from "../../../utils/sand-utils";

export default async function insightPage(req, res) {
    const {token, pageNotionID} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        console.log(pageNotionID)
        const getChannel = await channelRepo.retrive(pageNotionID)

        const pageAccessToken = getChannel?.properties?.accessToken?.rich_text?.[0]?.plain_text
        const pageID = getChannel?.properties?.channel_id?.rich_text?.[0]?.plain_text
        const lastEditedTime = getChannel?.last_edited_time
        const diff = diff_minutes(new Date(), new Date(lastEditedTime))
        console.log("get diff: ", diff)
        
        // **********************************
        // ONLY UPDATE FOR RECORD OVER 60 MINS
        // RECORD UNDER 60 MINS WILL BE USE DATABASE FROM LASTED UPDATE
        // **********************************
        if (diff < 60) {
            const insightByDate = await FacebookApiClient.getInsights(pageID, pageAccessToken, {
                metric:  "page_follows, page_video_views, page_video_views_paid, page_video_views_organic, page_video_views_unique, page_video_complete_views_30s, post_video_complete_views_30s_paid, page_engaged_users,page_post_engagements,page_impressions,page_impressions_unique,page_posts_impressions,page_posts_impressions_unique,page_actions_post_reactions_total,page_fans,page_fan_adds,page_fan_adds_unique, page_fans_city, page_fans_gender_age",
                periods: 'lifetime'
            })
            return res.send({
                page_name: getChannel?.properties?.name?.title?.[0]?.plain_text,
                page_id: getChannel?.properties?.channel_id?.rich_text?.[0]?.plain_text,
                username: getChannel?.properties?.username?.rich_text?.[0]?.plain_text,
                avatar: getChannel?.properties?.avatar?.files?.[0]?.external?.url,
                cover: getChannel?.properties?.cover?.files?.[0]?.external?.url,
                followers_count: getChannel?.properties?.followers_count?.number,
                fan_count: getChannel?.properties?.fans_count?.number,
                insight: insightByDate,            
                notion_id: getChannel?.id,
                updated_at: getChannel?.last_edited_time,
            })
        }

        // IF RECORD WAS UPDATED OVER 60 MINS
        // WILL BE GET DATA TO FRESH

        const pageDetail = await FacebookApiClient.getPageDetail({accessToken: pageAccessToken, pageId: pageID})
        if (pageDetail) {
            const {data} = pageDetail
            // console.log("data: ", data?.picture?.data?.url, data?.cover?.source)
            
            const updateResponse = await channelRepo.updateChannelData(
                pageNotionID, 
                {
                    name: {
                        title: [
                            {
                                text: {
                                    content: data?.name,
                                },
                            },
                        ]
                            
                    },
                    username: {
                        rich_text: [
                            {
                                text: {
                                    content: data?.username || "",
                                },
                            },
                        ],
                    },
                    followers_count: {
                        number: data?.followers_count
                    },
                    fans_count: {
                        number: data?.fan_count
                    },
                    avatar: {
                        files: [
                            {
                                type: "external",
                                name: "avatar",
                                external: {
                                    url: data?.picture?.data?.url
                                }
                            }
                        ]
                    },
                    cover: {
                        files: [
                            {
                                type: "external",
                                name: "cover",
                                external: {
                                    url: data?.cover?.source
                                }
                            }
                        ]
                    },
                },
                data?.picture?.data?.url,
                data?.cover?.source
            )
        }        

        const insightByDate = await FacebookApiClient.getInsights(pageID, pageAccessToken, {
            metric:  "page_follows, page_video_views, page_video_views_paid, page_video_views_organic, page_video_views_unique, page_video_complete_views_30s, post_video_complete_views_30s_paid, page_engaged_users,page_post_engagements,page_impressions,page_impressions_unique,page_posts_impressions,page_posts_impressions_unique,page_actions_post_reactions_total,page_fans,page_fan_adds,page_fan_adds_unique, page_fans_city, page_fans_gender_age",
            periods: 'lifetime'
        })
        
        if (insightByDate) {
            return res.send({
                page_name: pageDetail?.data?.name,
                page_id: pageDetail?.data?.id,
                username: pageDetail?.data?.username,
                avatar: pageDetail?.data?.picture?.data?.url,
                cover: pageDetail?.data?.cover?.source,
                followers_count: pageDetail?.data?.followers_count,
                fan_count: pageDetail?.data?.fan_count,
                insight: insightByDate,            
                notion_id: getChannel?.id,
                updated_at: new Date(),
            })
        } 

        return res.send({
            error: true,
            msg: "Không lấy được insight"
        })           
    } 
    return res.send(null)
}