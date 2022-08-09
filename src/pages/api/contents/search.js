import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import { JWT_SECURE_KEY } from "../../../constant"

export default async function search(req, res) {
    const {keywords, token} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        const response = await contentsRepo.search(keywords)
        console.log("search: ",response)
        return res.send(response || null)
    } 
    res.send(null)
}
