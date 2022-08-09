import {generateJwtToken} from "@cabineat/utilities/jwt"
import axios from "axios";
import memberRepo from "../../../api-server/notion/repos/member.repo";
import { JWT_SECURE_KEY } from "../../../constant";


export default async function accessViaCabinID(req, res) {
    const {atk, profile} = req.body

    const accessResponse = await accessSandsoViaAtk(atk, profile)
    if (accessResponse === null || accessResponse?.activated === false || accessResponse?.locked === true) return null
    return res.send({
        token: generateJwtToken(
            accessResponse,
            JWT_SECURE_KEY, 
            {expiresIn: "7d"}
        ),
        user: accessResponse || null,
    })
    
    /*
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
    */
}


const accessSandsoViaAtk = async(atk, profile) => {
    const baseURL = "https://api.sand.so/v1"

    // STEP1. CHECK IS_ACCESS SANDSO
    const accessCabinIDURL = baseURL + '/auth/access/cabin-id'
    const accessCabinIDResponse = await axios.post(accessCabinIDURL,{
        cbidUserId: profile?.id,
        cbidAtk: atk
    })
    

    if (!accessCabinIDResponse?.data?.success) return null
    
    // STEP2. GET MEMBER INFO
    const getMemberProfileURL = baseURL + "/auth/profile"
    const memberResponse = await axios.get(getMemberProfileURL,{
        headers: {
            atk: accessCabinIDResponse?.data?.data?.atk
        }
    })
    console.log("member info: ", memberResponse?.data?.data?.profile)
    return memberResponse?.data?.data?.profile
}


// {
//     id: 'dcfd038c-0fd8-11ed-8d74-e28be6d7b0c8',
//     phone: '+84941926368',
//     email: 'inbox.huytran@gmail.com',
//     fullname: 'TRAN HOANG HUY',
//     avatar: null,
//     activated: true,
//     locked: false,
//     kycInfo: { cardID: {} },
//     validKyc: false,
//     isAdmin: false
// }
  