import baseApiClient from "./base.api-client";

export default class DocumentsApiClient {
	static async all(token) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/documents/get-all", {token})
		);
	}	
	static async home(token) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/documents/get-home", {token})
		);
	}	
	static async getPage(token, notionPageID) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/documents/${notionPageID}`, {token})
		);
	}	
}
