import memberRepo from "../../../api-server/notion/repos/member.repo";
import { JWT_SECURE_KEY } from "../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import documentsRepo from "../../../api-server/notion/repos/documents.repo";

export default async function getAll(req, res) {
    const {token} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)    
    if (payload) {
        const database = await documentsRepo.getManyByCondition()        
        return res.send(database || null)
    } 
    res.send(null)
}