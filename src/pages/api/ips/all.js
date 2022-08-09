import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import ipsRepo from "../../../api-server/notion/repos/ips.repo"
import { JWT_SECURE_KEY } from "../../../constant"
import { subDays, subHours } from 'date-fns';
import _ from "lodash";

export default async function all(req, res) {
    const {token, startCursor, pageSize} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {                
        const data = await ipsRepo.all(startCursor, pageSize)
        const response = {
            has_more: data?.has_more,
            next_cursor: data?.next_cursor,
            results: []
        }

        

        data?.results.forEach((item, index) => {                              
            let referenceData = []
            for (var i=0; i< item.properties?.ip_references?.relation?.length; i++) {
                referenceData.push({
                    id: item.properties?.ip_references?.relation?.[i]?.id,
                    title: item.properties?.ip_reference_title?.rollup?.array?.[i]?.title?.[0]?.plain_text,
                    url: item.properties?.ip_reference_url?.rollup?.array?.[i]?.rich_text?.[0]?.plain_text,
                })
            }

            response.results.push({
                id: item?.id,
                title: item.properties?.title?.title?.[0]?.plain_text,
                status: "AUTHORIZED",
                // ipReference: item.properties?.ip_references?.relation,
                tags: item.properties?.tags?.multi_select,
                typeOfFile: item.properties?.tags?.select,                
                owner: item.properties?.owner || [],
                ownerName: item?.properties?.owner_name?.rollup?.array?.[0]?.title?.[0]?.plain_text,
                authorizeFrom: item?.properties?.authorize_from?.date?.start,
                authorizeExpired: item?.properties?.authorize_expired?.date?.start,
                earning: 0,
                // ipReferenceURL: item.properties?.ip_reference_url?.rollup?.array,
                // ipReferenceTitle: item.properties?.ip_reference_title?.rollup?.array,
                reference: referenceData
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