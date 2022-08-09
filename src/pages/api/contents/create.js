import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import { JWT_SECURE_KEY } from "../../../constant"

export default async function create(req, res) {
    const {token, title, fileName, urlMedia, collectionIDList, referenceIPSelected} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        console.log("refe ip: ", referenceIPSelected)
        console.log("collection : ", collectionIDList)
        const contentCreatedResponse = await contentsRepo.create(title, fileName, urlMedia, payload?.notion_id, collectionIDList, referenceIPSelected)
        console.log("create: ",contentCreatedResponse?.id)
        return res.send(contentCreatedResponse || null)        
    } 
    return res.send(null)
}