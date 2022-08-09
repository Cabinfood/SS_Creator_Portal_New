import baseApiClient from "./base.api-client";

export default class ChannelApiClient {	
	static async getAll(token) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/channels/get-all", {token})
		);
	}	
	static async connectPage(token, userFacebookToken, pageID) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/channels/connect-page", {token, userFacebookToken, pageID})
		);
	}	
	static async insightPage(token, pageNotionID) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/channels/insight-page", {token, pageNotionID})
		);
	}	
	// static async getObjectInsight(token, typeObject, objectID, pageID,channelNotionID) {
	// 	return baseApiClient.wrapResponse(
	// 		baseApiClient.asyncPost("/api/channels/object-insight", {token,typeObject,objectID, pageID,channelNotionID})
	// 	);
	// }		
	static async getPosts(token, channelNotionID, startCursor, pageSize) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/channels/${channelNotionID}/get-all-posts`, {token, startCursor, pageSize})
		);
	}		
}
