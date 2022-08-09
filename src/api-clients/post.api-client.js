import baseApiClient from "./base.api-client";

export default class PostApiClient {
	static async createPost(token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/auth/get-profile-via-token", {
				token,
			})
		);
	}	
	static async getPostInsight(token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/posts/insight", {
				token,
				typeObject,
				objectID
			})
		);
	}	
	static async updatePostStatistic(token, postNotionID, impression, reach, view, comment, share, reaction, adImpression, revenue, cpm) {		
		console.log("post.api.client: ", impression, reach, view, comment, share, reaction, adImpression, revenue, cpm)
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/posts/${postNotionID}/update`, {
				token,
				impression, reach, view, comment, share, reaction, adImpression, revenue, cpm
			})
		);
	}	
	static async getObjectInsight(token,objectNotionID) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/objects/${objectNotionID}/insight`, {token})
		);
	}		
}
