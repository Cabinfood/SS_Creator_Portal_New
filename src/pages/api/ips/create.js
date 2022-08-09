import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import ipsRepo from "../../../api-server/notion/repos/ips.repo"
import { JWT_SECURE_KEY } from "../../../constant"

export default async function create(req, res) {
    const {token, title, partnerNotionID, authorizedFrom, authorizedExpired} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        const response = await ipsRepo.create(title, partnerNotionID, authorizedFrom, authorizedExpired)
        console.log("create: ", response)
        if (response) {
            return res.send({
                error: false,
                data: response
            })
        }
        
        return res.send({
            error: true,
            data: null
        })
    } 
    
    return res.send({
        error: true,
        data: "wrong token"
    })
}