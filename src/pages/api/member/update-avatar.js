import memberRepo from "../../../api-server/notion/repos/member.repo";
import { JWT_SECURE_KEY } from "../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"

export default async function updateAvatar(req, res) {
    const {token, avatarURL} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        console.log("payload: ", payload)
        const response = await memberRepo.updateAvatar(payload?.notion_id, avatarURL)
        console.log("update avatar: ",response)
        return res.send(response || null)
    } 
    res.send(null)
}