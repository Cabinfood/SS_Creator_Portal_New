import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import memberRepo from "../../../api-server/notion/repos/member.repo"
import { JWT_SECURE_KEY } from "../../../constant"

export default async function getProfileViaEmail(req, res) {
    const {token, email} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    
    if (payload) {                
        const userRes = await memberRepo.getOneMemberByConditionByEmail(email)
        return res.send(userRes?.properties || null)
    } 
    res.send(null)
}
