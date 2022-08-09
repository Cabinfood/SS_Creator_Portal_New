import baseApiClient from "./base.api-client";

export default class NotionApiClient {
	static async search(searchKey) {		
		return baseApiClient.wrapResponse(			
			baseApiClient.asyncPost("/api/notion/search",{keyword: searchKey})
		);
	}

	static async getPageRender(pageID) {		
		return baseApiClient.wrapResponse(			
			baseApiClient.asyncPost("/api/notion/get-page-render",{page_id: pageID})
		);
	}

	static async getDatabase(databaseID) {		
		return baseApiClient.wrapResponse(			
			baseApiClient.asyncPost("/api/notion/get-database",{database_id: databaseID})
		);
	}

	static async getPage(pageID) {		
		return baseApiClient.wrapResponse(			
			baseApiClient.asyncPost("/api/notion/get-page",{page_id: pageID})
		);
	}

}
