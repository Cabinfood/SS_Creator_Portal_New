import baseApiClient from "./base.api-client";

export default class CollectionApiClient {
	static async getAll(token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/collection/get-all", {
				token,
			})
		);
	}	
}
