import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import collectionRepo from "../../../api-server/notion/repos/collection.repo"
import { JWT_SECURE_KEY, MAX_REQUEST_PAGE_SIZE } from "../../../constant"
import _ from "lodash"

export default async function getAllCollection(req, res) {
    const {token, startCursor, pageSize} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    
    if (payload) {       
        console.log("GET ALL COLLECTION ------------------------") 
        let data = await collectionRepo.getAll()        
        
        

        const response = {
            has_more: data?.has_more,
            next_cursor: data?.next_cursor,
            results: []
        }
        
        // ORDER BY NUMBER OF CONTENTS
        const {results: listCollection} = data
        console.log("number of collection: ", listCollection.length)

        let temp = _.orderBy(listCollection, (o) => o.properties.no_of_contents.rollup.number, ['desc'])
        temp.forEach((item, index) => {            
            response.results.push({
                label: item.properties?.name?.title?.[0]?.plain_text,                    
                value: item?.id                    
            })
        });        

        // BY SORT DEFAULT FROM API
        // data?.results?.forEach((item, index) => {            
        //     response.results.push({
        //         label: item.properties?.name?.title?.[0]?.plain_text,                    
        //         value: item?.id                    
        //     })
        // });        
        
        return res.send(response || null)        
    } 
    res.send(null)
}