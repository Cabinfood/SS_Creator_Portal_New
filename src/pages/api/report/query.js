import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import _,{ delay, round } from "lodash"
import FacebookApiClient from "../../../api-clients/fb.api-client"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import postsRepo from "../../../api-server/notion/repos/posts.repo"
import { JWT_SECURE_KEY, MAX_REQUEST_PAGE_SIZE, PERIOD, TIME_INTERVAL, TYPE_OBJECT, TIMEZONE_ZERO } from "../../../constant"
import * as momentTz from 'moment-timezone'

export default async function query(req, res) {
    const {token, query, dateRange, partnerCreatorID} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    
    if (payload) {       
        console.log("filter: ", query, dateRange, partnerCreatorID)
        var timezone = 'Asia/Saigon'
        var startDate = momentTz.tz(dateRange[0], TIMEZONE_ZERO).tz(timezone)
        var endDate = momentTz.tz(dateRange[1], TIMEZONE_ZERO).tz(timezone)

        let results = []
        let data = await postsRepo.getManyByCondition(
            {
                and: [
                    {
                        property: "created_at",
                        created_time: {
                            on_or_after: startDate.set('hours',0).set('minutes',0).set('seconds',0).toISOString()
                        }
                    },
                    {
                        property: "created_at",
                        created_time: {
                          on_or_before: endDate.set('hours',23).set('minutes',59).set('seconds',59).toISOString()
                        }
                    }
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],
        )
        results = [...data?.results]

        while (data?.has_more) {
            data = await postsRepo.getManyByCondition(
              {
                and: [
                    {
                        property: "created_at",
                        created_time: {
                            on_or_after: startDate.set('hours',0).set('minutes',0).set('seconds',0).toISOString()
                        }
                    },
                    {
                        property: "created_at",
                        created_time: {
                          on_or_before: endDate.set('hours',23).set('minutes',59).set('seconds',59).toISOString()
                        }
                    }
                ]
              },
              [{property: "last_updated_at",direction: "descending"}],
              data.next_cursor
            )
            results = [...results, ...data?.results] 
        }

        let temp = []
        for(var i=0; i<results.length; i++) {
            temp.push({
                id: results[i]?.id,
                object_id: results[i]?.properties?.object_id?.rich_text?.[0]?.plain_text,
                title: results[i]?.properties?.title?.title?.[0]?.plain_text,
                channel_name: results[i]?.properties?.channel_name?.rollup?.array?.[0]?.title?.[0]?.plain_text,                
                publish_information: {
                    url: results[i]?.properties?.url?.rich_text?.[0]?.plain_text,
                    is_deleted: results[i]?.properties?.is_deleted?.checkbox,
                    is_published: results[i]?.properties?.is_published?.checkbox,
                    object_created_time: results[i]?.properties?.object_created_time?.date?.start,
                    object_schedule_time: results[i]?.properties?.object_schedule_time?.date?.start,
                },
                statictis_lifetime: {
                    impression: results[i]?.properties?.impression?.number,
                    reach: results[i]?.properties?.reach?.number,
                    comment: results[i]?.properties?.comment?.number,
                    share: results[i]?.properties?.share?.number,
                    view: results[i]?.properties?.view?.number,
                    reaction: results[i]?.properties?.reaction?.number,
                },
                moneitize_lifetime: {
                    earning: results[i]?.properties?.earning?.number || 0,
                    cpm: results[i]?.properties?.cpm?.number || 0,
                    ad_impression: results[i]?.properties?.ad_impression?.number || 0,
                },
                meta: {
                    resource: {
                        id: results[i]?.properties?.of_resource?.relation?.[0]?.id, 
                        title: results[i]?.properties?.resources_title?.rollup?.array?.[0]?.title?.[0]?.plain_text,
                    },
                    object_thumbnail: results[i]?.properties?.object_thumbnail?.files?.[0]?.external?.url,
                    created_at: results[i]?.created_time
                }
            })
        }
                  
        return res.send(temp)
    }
}