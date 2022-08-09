import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import ipReferenceRepo from "../../../api-server/notion/repos/ip-reference.repo"
import { JWT_SECURE_KEY } from "../../../constant"
import _ from "lodash";

export default async function all(req, res) {
    const {token} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        const data = await ipReferenceRepo.getManyByCondition()
        const response = {
            has_more: data?.has_more,
            next_cursor: data?.next_cursor,
            results: []
        }        

        data?.results.forEach((item, index) => {                              
            response.results.push({
                id: item?.id,
                title: item.properties?.title?.title?.[0]?.plain_text,                
            })
        });        

        return res.send({
            error: false,
            data: response
        })        
    } 
    
    return res.send({
        error: true,
        data: "wrong token"
    })
}