import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import memberRepo from "../../../api-server/notion/repos/member.repo"
import { JWT_SECURE_KEY } from "../../../constant"

export default async function getProfileViaToken(req, res) {
    const {token} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    
    if (payload) {        
        console.log("payload: ", payload)
        const userData = {
            id: payload?.id, 
            phone: payload?.phone,
            email: payload?.email,
            fullname: payload?.fullname,                        
            avatar: payload?.avatar,
            isKYC: payload?.validKyc,
            isAdmin: payload?.isAdmin
        }
        return res.send({...userData} || null)        
    } 
    res.send(null)
}
