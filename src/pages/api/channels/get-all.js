import { JWT_SECURE_KEY } from "../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import channelRepo from "../../../api-server/notion/repos/channel.repo";

export default async function getAll(req, res) {
    const {token, userFacebookToken, pageID} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        const channelsResponse = await channelRepo.getAllResources()
        console.log(channelsResponse)
                
        return res.send(channelsResponse?.results)
    } 
    res.send(null)
}