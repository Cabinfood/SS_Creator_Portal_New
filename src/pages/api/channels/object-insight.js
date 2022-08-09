import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import { object } from "prop-types"
import FacebookApiClient from "../../../api-clients/fb.api-client"
import channelRepo from "../../../api-server/notion/repos/channel.repo"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import postsRepo from "../../../api-server/notion/repos/posts.repo"
import { JWT_SECURE_KEY, MAX_REQUEST_PAGE_SIZE, PERIOD, TYPE_OBJECT } from "../../../constant"

export default async function getObjectInsight(req, res) {
    const {token, typeObject, objectID, pageID, channelNotionID} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    
    if (payload) {       
        console.log(typeObject, objectID, pageID, channelNotionID)
        const getChannel = await channelRepo.retrive(channelNotionID)
        const pageAccessToken = getChannel?.properties?.accessToken?.rich_text?.[0]?.plain_text
        console.log(pageID, objectID, pageAccessToken)
        let data
        if (typeObject === TYPE_OBJECT.POST) {                        
            data = await FacebookApiClient.getPostInsightWithLifetimePeriod(pageID, objectID, pageAccessToken)            
        } else if (typeObject === TYPE_OBJECT.VIDEO) {
            data = await FacebookApiClient.getVideoInsightByLifetime(objectID, pageAccessToken)
        }
        return res.send(data || null)
        
        // return res.send(response || null)        
    } 
    res.send(null)
}