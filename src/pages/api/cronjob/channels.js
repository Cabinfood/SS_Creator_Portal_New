import _,{ delay, result, round } from "lodash"
import FacebookApiClient from "../../../api-clients/fb.api-client"
import { TIMEZONE_ZERO, TIME_INTERVAL, TYPE_OBJECT } from "../../../constant"
import { diff_days, diff_minutes } from "../../../utils/sand-utils"
import * as momentTz from 'moment-timezone'
import channelRepo from "../../../api-server/notion/repos/channel.repo"
import channelStatisticRepo from "../../../api-server/notion/repos/channel-statistic.repo"

export default async function cronjobChannelInsight(req, res) {    
    
    let response = await channelRepo.getAllResources()
    res.send(response)
    
    const {results} = response
    for (var i=0; i<results.length; i++) {
        delay(handleGetPage, 2000* i, results[i])
        /*
        const pageNotionID = results[i]?.id
        const pageAccessToken = results[i]?.properties?.accessToken?.rich_text?.[0]?.plain_text
        const pageID = results[i]?.properties?.channel_id?.rich_text?.[0]?.plain_text        
        
        const pageDetail = await FacebookApiClient.getPageDetail({pageId: pageID, accessToken: pageAccessToken})
        if (_.isNull(pageDetail) || pageDetail.error === true) continue;
        const {data: pageData} = pageDetail || null                    
        

        // non waiting       
        createStatisticRecord(pageNotionID, pageData) 

        */
        // const pageInsight = await getPageInsight(pageID, pageAccessToken)
        // const {time: time_stamp} = pageInsight

        // return res.json(momentTz.tz(time_stamp, TIMEZONE_ZERO).tz("Asia/Bangkok").toISOString(true))
    }   
    return;
}

const handleGetPage = async(page) => {
    const pageNotionID = page?.id
    const pageAccessToken = page?.properties?.accessToken?.rich_text?.[0]?.plain_text
    const pageID = page?.properties?.channel_id?.rich_text?.[0]?.plain_text        
    
    const pageDetail = await FacebookApiClient.getPageDetail({pageId: pageID, accessToken: pageAccessToken})
    if (_.isNull(pageDetail) || pageDetail.error === true) return;
    const {data: pageData} = pageDetail || null                    
    

    // non waiting       
    createStatisticRecord(pageNotionID, pageData) 
}

const createStatisticRecord = async(pageNotionID, pageData) => {
    const statisticRes = channelStatisticRepo.createPage({
        title: {
            title: [
                {
                    text: {
                        content: momentTz.tz(new Date(), TIMEZONE_ZERO).tz("Asia/Bangkok").toDate()
                    },
                },
            ]
        },  
        of_channel: {
            relation: [
                {id: pageNotionID}
            ]
            
        },
        date: {
            date: {
                start: momentTz.tz(new Date(), TIMEZONE_ZERO).tz("Asia/Bangkok").toISOString(true)
            }                        
        },
        followers: {
            number: pageData?.followers_count
        }
    })    
    return statisticRes
}

const getPageInsight = async(pageID, pageAccessToken) => {
    const ret = {
        page_follows: null,
        page_fans: null,
        page_impressions_unique: null,
        page_impressions: null,
        page_fan_adds: null,
        page_daily_follows_unique: null,
        page_daily_follows: null,
        page_posts_impressions: null,
        page_video_views: null,
        page_fans_gender_age: null,
        info: null
    };

    const metrics = [
        "page_follows",
        "page_fans",
        "page_impressions_unique",
        "page_impressions",
        "page_fan_adds",
        "page_daily_follows_unique",
        "page_daily_follows",
        "page_posts_impressions",
        "page_video_views",
        "page_fans_city",
        "page_fans_gender_age",
    ].join(",");
    // "page_follows, page_video_views, page_video_views_paid, page_video_views_organic, page_video_views_unique, page_video_complete_views_30s, post_video_complete_views_30s_paid, page_engaged_users,page_post_engagements,page_impressions,page_impressions_unique,page_posts_impressions,page_posts_impressions_unique,page_actions_post_reactions_total,page_fans,page_fan_adds,page_fan_adds_unique, page_fans_city, page_fans_gender_age"

    const metricToFieldMapping = {
        page_follows: "page_follows",
        page_fans: "page_fans",
        page_impressions_unique: "page_impressions_unique",
        page_impressions: "page_impressions",
        page_fan_adds: "page_fan_adds",
        page_daily_follows_unique: "page_daily_follows_unique",
        page_daily_follows: "page_daily_follows",
        page_posts_impressions: "page_posts_impressions",
        page_video_views: "page_video_views",
        page_fans_city: "page_fans_city",
        page_fans_gender_age: "page_fans_gender_age",
    };

    const data = await FacebookApiClient.getInsights(pageID, pageAccessToken, {
        metric:  metrics,
        period: 'day'
    })        

    if (!data) {
        return {
          error: true,
          data: null,
        };
    }
    for (const item of data || []) {
        switch (item?.name) {
            case "page_follows":
            case "page_fans":
            case "page_impressions_unique":
            case "page_impressions":
            case "page_fan_adds":
            case "page_daily_follows_unique":
            case "page_daily_follows":
            case "page_posts_impressions":
            case "page_video_views":
            case "page_fans_city" :
            case "page_fans_gender_age":
                ret[metricToFieldMapping[item?.name]] = item?.values?.[1]?.value || null
                break;              
        }
    }
    
    
    return {
        time: data[0]?.values?.[1]?.end_time,
        value: ret
    }
}