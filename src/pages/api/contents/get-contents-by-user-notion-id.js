import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import { JWT_SECURE_KEY, MAX_REQUEST_PAGE_SIZE } from "../../../constant"

export default async function getContentsByUserNotionID(req, res) {
    const {token, startCursor, pageSize} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    
    if (payload) {        
        // console.log(payload)
        const data = await contentsRepo.getContentsByUserNotionID(payload?.notion_id, startCursor, pageSize)
        const response = {
            has_more: data?.has_more,
            next_cursor: data?.next_cursor,
            results: []
        }

        data?.results.forEach((item, index) => {            
            if (item.properties?.attachments?.files.length > 0) {
                let isLove = false;     
                if (item?.properties?.loved_by && item?.properties?.loved_by?.relation.some(e => e.id === payload?.notion_id)) {
                    isLove = true
                } else {
                    isLove = false
                }
                
                response.results.push({
                    title: item.properties?.title?.title?.[0]?.plain_text,
                    attachments: item.properties?.attachments?.files,
                    tags: item.properties?.tags?.multi_select,
                    id: item?.id,
                    re_posts: item.properties?.re_posts || [],
                    re_posts_url: item.properties?.re_posts_url?.rollup?.array?.length > 0 ? item.properties?.re_posts_url?.rollup?.array : [],
                    re_poster: item.properties?.re_poster || [],
                    editor_notion_id: item.properties?.created_by?.relation?.[0]?.id,
                    editor_name: item?.properties?.editor_name?.rollup?.array?.[0]?.title?.[0]?.plain_text,
                    loved_by: item.properties?.loved_by?.relation,
                    collections: item?.properties?.collections?.relation || [],
                    collection_name: item?.properties?.collection_name?.rollup?.array || [],
                    review_code : item?.properties?.review_code?.number || 0,
                    is_loved: isLove,
                    created_at: item.properties?.created_at?.created_time,
                    view: item?.properties?.view?.rollup?.number,
                    earning: item?.properties?.earning?.rollup?.number,
                    impression : item?.properties?.impression?.rollup?.number,
                    is_expired: item?.properties?.is_expired?.checkbox,
                    reference_ip: {
                        id: item?.properties?.reference_ip?.relation?.[0]?.id, 
                        title: item?.properties?.reference_title?.rollup?.array?.[0]?.title?.[0]?.plain_text, 
                    }
                })
            }     
        });        
        
        return res.send(response || null)
        // console.log('response',response)
        // return res.json({response});
    } 
    res.send(null)
}