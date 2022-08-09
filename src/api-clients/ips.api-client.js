import baseApiClient from "./base.api-client";

export default class IPsApiClient {
	static async all(token, startCursor, pageSize) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/ips/all", {
				token,
				startCursor, 
				pageSize
			})
		);
	}		
	static async createIP(token, title, partnerNotionID, authorizedFrom, authorizedExpired) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/ips/create", {
				token,
				title,
				partnerNotionID,
				authorizedFrom,
				authorizedExpired				
			})
		);
	}		
}
