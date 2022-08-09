import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import channelRepo from "../../../api-server/notion/repos/channel.repo"
import { JWT_SECURE_KEY } from "../../../constant"
import postsRepo from "../../../api-server/notion/repos/posts.repo"

export default async function repost(req, res) {
    const {token, contentNotionID, urlPost, objectID, typeObject, pageUserName, pageID} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {        
        console.log(pageUserName, pageID)
        
        let findChannel
        if (pageUserName) {
            findChannel = await channelRepo.getOneByCondition(
                {
                    property: 'username',
                    rich_text: 
                    {
                        equals: pageUserName,
                    }
                }
            )
        } else {
            findChannel = await channelRepo.getOneByCondition(
                {
                    property: 'channel_id',
                    rich_text: 
                    {
                        equals: pageID,
                    }
                }
            )
        }
        console.log("findChannel: ", findChannel)
        
        const findPost = await postsRepo.getOneByCondition(
            {
                property: 'object_id',
                rich_text: 
                {
                    equals: objectID,
                }
            }
        )

        if (findPost) return res.send({
            error: true,
            msg: "Đã tồn tại"
        })
        
        const response = await contentsRepo.repost(contentNotionID, urlPost, payload?.notion_id, objectID, typeObject, findChannel)
        return res.send(response)        
    } 
    res.send(null)
}
