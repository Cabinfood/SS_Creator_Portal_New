import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import IPReferenceRepo from "../../../api-server/notion/repos/ip-reference.repo"
import { JWT_SECURE_KEY } from "../../../constant"

export default async function AddReference(req, res) {
    const {token, IPNotionID, title, url} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        const response = await IPReferenceRepo.addReference(IPNotionID, title, url)
        console.log("add reference: ", response)
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