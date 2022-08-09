import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../../api-server/notion/repos/contents.repo"
import { JWT_SECURE_KEY } from "../../../../constant"

export default async function loved(req, res) {
    const {token} = req.body
    const {id} = req.query
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {
        const response = await contentsRepo.loved(payload?.notion_id, id)
        console.log("love content: ",response)
        if (response) return res.send(response)        
        return res.send(null)
    } 
    res.send(null)
}
