import baseApiClient from "./base.api-client";

export default class ReportApiClient {
	static async getSummary(token, period) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/report/summary", {token, period})
		);
	}	

	static async query(token, query, dateRange, partnerCreatorID) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/report/query", {token, query, dateRange, partnerCreatorID})
		);
	}	

}
