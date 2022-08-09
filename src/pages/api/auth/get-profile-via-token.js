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
            notion_id: payload?.notion_id,
            fullname: payload?.fullname,                        
            tier: payload?.tier,
            avatar: payload?.avatar,
            id_front_image: payload?.id_front_image,
            id_back_image: payload?.id_back_image,
            isKYC: payload?.isKYC,
        }
        return res.send({...userData} || null)

        // const userRes = await memberRepo.getOneMemberByConditionByCabinID(payload?.id, payload?.phone)        
        // const userData = {
        //     id: userRes?.properties?.cabin_id.rich_text[0]?.plain_text, 
        //     phone: userRes?.properties?.phone?.rich_text[0]?.plain_text,
        //     email: userRes?.properties?.email?.rich_text[0]?.plain_text,
        //     notion_id: userRes?.id,
        //     fullname: userRes?.properties?.fullname?.title?.[0]?.plain_text,                        
        //     tier: userRes?.properties?.tier?.select?.name,
        //     avatar: userRes?.properties?.avatar?.files?.[0]?.external?.url || null,
        //     id_front_image: userRes?.properties?.kyc_id_image_back?.files?.[0]?.external?.url || null,
        //     id_back_image: userRes?.properties?.kyc_id_image_front?.files?.[0]?.external?.url || null,
        //     isKYC: (userRes?.properties?.kyc_id_image_back?.files?.length > 0 && updateRes?.kyc_id_image_front?.files?.length > 0) ? true : false,
        // }
        // return res.send({...userData} || null)
        // return res.send(userRes || null)
    } 
    res.send(null)
}
