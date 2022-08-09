import { NOTION_API_KEY } from "../../../constant";
import {NOTION_DATABASE} from "../../../config"
import { BaseNotionRepo } from "./base.repo";

class DocumentsNotionRepo extends BaseNotionRepo {
    constructor() {
        super(NOTION_API_KEY, NOTION_DATABASE.DOCUMENT_NOTION_ID)
    }    
}

export default new DocumentsNotionRepo()