import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../../api-server/notion/repos/contents.repo"
import { JWT_SECURE_KEY } from "../../../../constant"

export default async function update(req, res) {
    const {token, referenceID} = req.body
    const {id} = req.query
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {        
        const response = await contentsRepo.updatePageByPropertise(id, {
            reference_ip: {
                relation: [
                    {id: referenceID}
                ]
            }
        })
        console.log("update content: ",response)
        if (response) return res.send(response)        
        return res.send(null)
    } 
    res.send(null)
}
