import { getPage } from "../../../utils/notion.util"

export default async function NotionGetPage(req, res) {
    const {page_id} = req.body
    if (page_id) {
        const response = await getPage(page_id)
        return res.send(response)
    }
    res.send([])
}
