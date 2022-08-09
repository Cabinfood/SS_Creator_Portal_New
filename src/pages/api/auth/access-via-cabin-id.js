import {generateJwtToken} from "@cabineat/utilities/jwt"
import memberRepo from "../../../api-server/notion/repos/member.repo";
import { JWT_SECURE_KEY } from "../../../constant";


export default async function accessViaCabinID(req, res) {
    const {atk, profile} = req.body

    let memberRes = await memberRepo.getOneMemberByConditionByCabinID(profile?.id, profile?.phone)
    console.log(memberRes)
    if (memberRes) {
        let updateRes = await memberRepo.updateMemberInformation(memberRes?.id, profile?.fullname, profile?.phone, profile?.email , profile?.id)
        
        if (updateRes) {
            return res.send({
                token: generateJwtToken(
                    {
                        id: updateRes?.properties?.cabin_id.rich_text[0]?.plain_text, 
                        phone: updateRes?.properties?.phone?.rich_text[0]?.plain_text,
                        email: updateRes?.properties?.email?.rich_text[0]?.plain_text,
                        notion_id: updateRes?.id,
                        fullname: updateRes?.properties?.fullname?.title?.[0]?.plain_text,                        
                        tier: updateRes?.properties?.tier?.select?.name,
                        avatar: updateRes?.properties?.avatar?.files?.[0]?.external?.url || null,
                        id_front_image: updateRes?.properties?.kyc_id_image_back?.files?.[0]?.external?.url || null,
                        id_back_image: updateRes?.properties?.kyc_id_image_front?.files?.[0]?.external?.url || null,
                        isKYC: (updateRes?.properties?.kyc_id_image_back?.files?.length > 0 && updateRes?.kyc_id_image_front?.files?.length > 0) ? true : false,
                    }, 
                    JWT_SECURE_KEY, 
                    {expiresIn: "7d"}
                ),
                user: updateRes?.properties || null,
                notion_id: updateRes?.id
            })
        }        
    } 
    return null
}