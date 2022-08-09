import baseApiClient from "./base.api-client";

export default class GeneralApiClient {
	static async search(token, keyword) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/search", {token, keyword})
		);
	}	
}
