import { JWT_SECURE_KEY } from "../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import FacebookApiClient from "../../../api-clients/fb.api-client";
import channelRepo from "../../../api-server/notion/repos/channel.repo";
import axios from "axios";

export default async function connectPage(req, res) {
    const {token, userFacebookToken, pageID} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        const userLongLiveToken = await FacebookApiClient.getLongLiveUserAccessToken({accessToken: userFacebookToken})
        const getPageToken = await FacebookApiClient.getLongLivePageAccessToken({
            accessToken: userLongLiveToken?.data?.longLiveAccessToken,
            pageId: pageID
        })
        const {longLiveAccessToken : longLivePageAccessToken} = getPageToken.data

        const getPageDetail = await FacebookApiClient.getPageDetail({
            accessToken: longLivePageAccessToken,
            pageId: pageID
        })       

        if (!getPageDetail?.error) {
            const {data : pageDetail} = getPageDetail
            console.log(pageDetail)    
            const {
                access_token : accessToken, 
                about,
                category_list : categoryList,
                fan_count : fanCount,
                followers_count : followersCount,
                id,
                link,
                name,
                username,
                verification_status : verificationStatus
            } = pageDetail
            const coverURL = pageDetail?.cover?.source
            const avatarURL = pageDetail?.picture?.data?.url

            const syncData = await syncChannelToSql(
                accessToken, 
                id, 
                link,
                pageDetail?.picture?.data?.url,
                pageDetail?.cover?.source,
                false,
                name,
                username
            )            

            const findChannel = await channelRepo.getOneByCondition({
                property: "channel_id",
                rich_text: {
                    contains: id
                }
            })
            console.log("find: ", findChannel)

            if (!findChannel) {
                console.log("data: ",payload?.notion_id, accessToken, about, categoryList, fanCount, followersCount, id, link, name, verificationStatus, coverURL, avatarURL)
                const createChannel = await channelRepo.createFacebookChannel(payload?.notion_id, accessToken, name, username, id, link, followersCount, fanCount, avatarURL, coverURL)
                if (createChannel) {
                    console.log("created: ", createChannel?.properties)
                    const pageDataCreated = {
                        notionID: createChannel?.id,
                        name: createChannel?.properties?.name?.title?.[0]?.plain_text,
                        avatarURL: createChannel?.properties?.avatar?.files?.[0]?.external?.url,
                        id: createChannel?.properties?.channel_id?.rich_text?.[0]?.plain_text,
                        fansCount: createChannel?.properties?.fans_count?.number,
                        followersCount: createChannel?.properties?.followers_count?.number,
                        url: createChannel?.properties?.url?.rich_text?.[0]?.plain_text,
                        username: createChannel?.properties?.username?.rich_text?.[0]?.plain_text,                        
                        updatedAt: createChannel?.properties?.last_updated_at?.last_edited_time,
                    }
                    
                    const updateChannel = await channelRepo.updatePageByPropertise(createChannel?.id, {
                        sdso_ref_id: {
                            rich_text: [
                                {
                                    text: {
                                        content: syncData?.id || "",
                                    },
                                },
                            ],
                        },
                        checked_migrate: {
                            checkbox: true
                        }
                    })

                    return res.send({
                        status: true,
                        data: pageDataCreated
                    })
                } else {
                    return res.send({
                        status: false,
                        msg: "Thiếu dữ liệu",
                        data: {
                            accessToken, about, categoryList, fanCount, followersCount, id, link, name, verificationStatus, coverURL, avatarURL
                        }
                    })    
                }   
            } else {
                const updateChannel = await channelRepo.updatePageByPropertise(findChannel?.id, {                   
					accessToken: {
						rich_text: [
							{
								text: {
									content: accessToken ? accessToken : "",
								},
							},
						],
					},
                    sdso_ref_id: {
                        rich_text: [
                            {
                                text: {
                                    content: syncData?.id || "",
                                },
                            },
                        ],
                    },
                    checked_migrate: {
                        checkbox: true
                    }              
                })

                const pageDataCreated = {
                    notionID: updateChannel?.id,
                    name: updateChannel?.properties?.name?.title?.[0]?.plain_text,
                    avatarURL: updateChannel?.properties?.avatar?.files?.[0]?.external?.url,
                    id: updateChannel?.properties?.channel_id?.rich_text?.[0]?.plain_text,
                    fansCount: updateChannel?.properties?.fans_count?.number,
                    followersCount: updateChannel?.properties?.followers_count?.number,
                    url: updateChannel?.properties?.url?.rich_text?.[0]?.plain_text,
                    username: updateChannel?.properties?.username?.rich_text?.[0]?.plain_text,                        
                    updatedAt: updateChannel?.properties?.last_updated_at?.last_edited_time,
                }
                return res.send({
                    status: true,
                    data: pageDataCreated
                })
                
                // return res.send({
                //     status: false,
                //     msg: "Da Ton Tai"
                // })        
            }            

        }

        
        return res.send(null)
    } 
    res.send(null)
}


const syncChannelToSql = async(accessToken, channel_id, url, avatar, cover, is_adbreak, name, username) => {        
    try {
        console.log("SYNCING CHANNEL....: ", accessToken, channel_id, url, avatar, cover, is_adbreak, name, username)    
        const baseURL = "https://api.sand.so/v1/notion-migration/sync-channel"
        const atk = "anhVinhdeptraiSandsoMigration"
        const syncData = {
            accessToken: accessToken ? accessToken : undefined, 
            channel_id: channel_id, 
            url: url, 
            avatar: avatar, 
            cover: cover, 
            is_adbreak: false, 
            name: name, 
            username: username
        }
        const syncResponse = await axios.post(baseURL, syncData, {
            headers: {
                'atk': atk
            },
        })    
        console.log("sync success: ", syncResponse)    
        console.log("SYNC CHANNEL SUCCESS ")    
        return syncResponse?.data
    } catch (error) {
        console.log("sync error: ", error)    
    }
    
    
}