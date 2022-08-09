import { NOTION_API_KEY,TIMEZONE_ZERO } from "../../../constant";
import {NOTION_DATABASE} from "../../../config"
import { BaseNotionRepo } from "./base.repo";
import * as momentTz from 'moment-timezone'

class IPsNotionRepo extends BaseNotionRepo {
    constructor() {
        super(NOTION_API_KEY, NOTION_DATABASE.IP)
    }

    async all (startCursor, pageSize) {
		console.log("IPsNotionRepo get all: ", startCursor, pageSize)
        const response = await this.getManyByCondition(
			undefined,
			[{property: "last_updated_at",direction: "descending"}],
			startCursor, 
            pageSize
		)
		console.log("IPsNotionRepo get all: ", response)
        return response || null
    }    

    async create(title, partnerNotionID, authorizedFrom, authorizedExpired) {
		const timezone = "Asia/Saigon"
      	const response = await this.createPage({
			title: {
				title: [
					{
						text: {
							content: title ? title : "",
						},
					},
				]
			},
			owner: {
				relation:[
					{
						id: partnerNotionID
					}
				]
			},			
			authorize_from : {
				date: 
					{
						start: momentTz.tz(authorizedFrom, TIMEZONE_ZERO).tz(timezone)
						// start: new Date(authorizedFrom).toISOString()
					}				
			},
			authorize_expired : {
				date: 
					{
						start: momentTz.tz(authorizedExpired, TIMEZONE_ZERO).tz(timezone)
					}
			},
		}) 
		return response
    }  
}

export default new IPsNotionRepo()