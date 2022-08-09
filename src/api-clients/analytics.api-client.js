import baseApiClient from "./base.api-client";

export default class AnatlyticsApiClient {
	static async getSummary(token, period) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/analytics/summary", {token, period})
		);
	}	
}
