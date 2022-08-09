import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../../api-server/notion/repos/contents.repo"
import postsRepo from "../../../../api-server/notion/repos/posts.repo"
import { JWT_SECURE_KEY } from "../../../../constant"

export default async function getContentByID(req, res) {
    const {token} = req.body
    const {id} = req.query
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {
        let data = []
        let response = await contentsRepo.getContentByID(id)
        let postByContentNotionID = await postsRepo.getManyByCondition(
            {
                property: 'of_resource',
                relation: 
                {
                    contains: id,
                }
            }
        )
        
        if (response?.properties?.loved_by?.relation.some(e => e.id === payload?.notion_id)) {
            response.properties.is_loved = true
        } else {
            response.properties.is_loved = false
        }

        if (postByContentNotionID?.results?.length > 0) {
            response.properties.posts = postByContentNotionID?.results
        }
        if (response) return res.send(response)        
        return res.send(null)
    } 
    res.send(null)
}
