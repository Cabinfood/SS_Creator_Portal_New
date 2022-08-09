import memberRepo from "../../../api-server/notion/repos/member.repo";
import { JWT_SECURE_KEY } from "../../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import documentsRepo from "../../../api-server/notion/repos/documents.repo";
import { NotionAPI } from 'notion-client'

export default async function getHome(req, res) {
    const {token} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)    
    if (payload) {
        const database = await documentsRepo.getManyByCondition({
            and: 
            [
                {
                    property: 'tags',
                    select: {
                        equals: "home"
                    },
                },                    
            ]
        })        
        // const blocks = await documentsRepo.getBlocks(database?.results?.[0]?.id)
        // return res.send(blocks || null)

        const api = new NotionAPI()
        // const page = await api.getPage('067dd719-a912-471e-a9a3-ac10710e7fdf')
        const page = await api.getPage(database?.results?.[0]?.id)
        return res.send(page)
        
    } 
    res.send(null)
}