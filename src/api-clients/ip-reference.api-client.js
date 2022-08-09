import baseApiClient from "./base.api-client";

export default class IPReferenceApiClient {	
	static async create(token, IPNotionID, title, url) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/ips/add-reference", {
				token,
				IPNotionID, title, url
			})
		);
	}		

	static async all(token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/ip-reference/all", {
				token
			})
		);
	}		
}
