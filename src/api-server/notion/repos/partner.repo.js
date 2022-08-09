import { NOTION_API_KEY } from "../../../constant";
import {NOTION_DATABASE} from "../../../config"
import { BaseNotionRepo } from "./base.repo";

class IPsNotionRepo extends BaseNotionRepo {
    constructor() {
        super(NOTION_API_KEY, NOTION_DATABASE.PARTNER)
    }

    async all (startCursor, pageSize) {		
        const response = await this.getManyByCondition(
			undefined,
			[{property: "last_updated_at",direction: "descending"}],
			startCursor, 
            pageSize
		)
		console.log("partner get all: ", response)
        return response || null
    }    

	async getPartnerByNotionUserID (notionUserID) {		
		const response = await this.getManyByCondition(
			{and: [
				{
					property: "access_authorized",
					relation: {
						contains: notionUserID
					}
				}
			]}
		)
		return response || null
	}


}

export default new IPsNotionRepo()