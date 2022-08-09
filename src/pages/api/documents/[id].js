import memberRepo from "../../../api-server/notion/repos/member.repo";
import { JWT_SECURE_KEY } from "../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import documentsRepo from "../../../api-server/notion/repos/documents.repo";
import { NotionAPI } from 'notion-client'

export default async function getAll(req, res) {
    const {token} = req.body
    const {id: pageNotionID} = req.query

    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)    
    if (payload) {                                
        const api = new NotionAPI()
        const page = await api.getPage(pageNotionID)

        return res.send(page || null)
    } 
    res.send(null)
}