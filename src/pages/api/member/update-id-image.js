import memberRepo from "../../../api-server/notion/repos/member.repo";
import { JWT_SECURE_KEY } from "../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"

export default async function updateIDImage(req, res) {
    const {token, frontURL, backURL} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        console.log("payload: ", payload)
        const response = await memberRepo.updateIDImage(payload?.notion_id, frontURL, backURL)
        console.log("update KYC: ",response)
        return res.send(response || null)
    } 
    res.send(null)
}