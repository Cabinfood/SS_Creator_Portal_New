import { NOTION_PAGE_DATABASE } from "../../../constant"
import { searchPage } from "../../../utils/notion.util"


export default async function NotionSearchPage(req, res) {
    const {keyword} = req.body
    if (keyword && keyword?.length > 0) {
        const response = await searchPage(NOTION_PAGE_DATABASE, keyword)
        return res.send(response)
    }
    res.send([])
}
