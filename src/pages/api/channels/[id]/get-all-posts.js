import { JWT_SECURE_KEY } from "../../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import postsRepo from "../../../../api-server/notion/repos/posts.repo";



export default async function getAllPostOfChannel(req, res) {
    const {token, startCursor, pageSize} = req.body
    const {id : channelNotionID} = req.query
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    console.log(payload)
    if (payload) {                
        const postsResponse = await postsRepo.getManyByCondition(
            {and: 
                [                    
                    {
                        property: 'of_channel',
                        relation: {
                            contains: channelNotionID
                        }
                    },
                ]
            },
            [{property: "created_at",direction: "descending"}],
            startCursor, 
            pageSize || 10
        )
        console.log("postsResponse: ", postsResponse)
                
        return res.send(postsResponse)
    } 
    res.send(null)
}