import { NOTION_API_KEY,TIMEZONE_ZERO } from "../../../constant";
import {NOTION_DATABASE} from "../../../config"
import { BaseNotionRepo } from "./base.repo";

class IPReferenceNotionRepo extends BaseNotionRepo {
    constructor() {
        super(NOTION_API_KEY, NOTION_DATABASE.IP_REFERENCE)
    }    

    async addReference(ipNotionID, title, url) {
		try {
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
				of_ip_authorize: {
					relation:[
						{
							id: ipNotionID
						}
					]
				},			
				url : {
					rich_text: [
						{
							text: {
								content: url
							}
						}
					]
				}
			}) 
			return response
		} catch (error) {
			console.log(error)
			return null	
		}      
    }  
}

export default new IPReferenceNotionRepo()