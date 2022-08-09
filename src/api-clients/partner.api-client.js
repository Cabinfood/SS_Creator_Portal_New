import baseApiClient from "./base.api-client";

export default class PartnerApiClient {
	static async all(token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/partner/all", {
				token,				
			})
		)
	}	
}