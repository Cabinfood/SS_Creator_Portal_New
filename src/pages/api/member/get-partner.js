import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import partnerRepo from "../../../api-server/notion/repos/partner.repo"
import { JWT_SECURE_KEY, MEMBER_TIER } from "../../../constant"

export default async function getPartners(req, res) {
    const {token} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {
        console.log("partner:", payload)
        const data = []
        if (payload?.tier === MEMBER_TIER.MASTER_ADMIN || payload.tier === MEMBER_TIER.GROWTH_LEADER) {
            const partnerData = await partnerRepo.all()

            for (var i=0; i<partnerData?.results?.length; i++) {
                data.push({
                    name: partnerData?.results?.[i]?.properties?.name?.title?.[0]?.plain_text,
                    id: partnerData?.results?.[i]?.id
                })
            }


            return res.send(data)
        }
        
    } 

    return res.send(null)
}
