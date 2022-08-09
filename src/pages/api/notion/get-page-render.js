import { NotionAPI } from 'notion-client'

export default async function NotionGetPageRender(req, res) {
    const {page_id} = req.body
    if (page_id) {
        const response = await new NotionAPI().getPage(page_id)
        return res.send(response)
    }
    return res.send({})
}
