import { NOTION_PAGE_DATABASE } from "../../../constant"
import { getDatabase } from "../../../utils/notion.util"


export default async function NotionGetDatabase(req, res) {
    const {database_id} = req.body
    if (database_id) {
        const response = await getDatabase(database_id)
        return res.send(response)
    }
    res.send([])
}
