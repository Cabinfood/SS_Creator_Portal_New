import baseApiClient from "./base.api-client";

export default class ContentsNotionApiClient {
	static async getAllResources(token, startCursor, pageSize) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/contents/get-all", {token, startCursor, pageSize})
		);
	}

	static async getResourcesByUserNotionID(token, startCursor, pageSize) {		
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/contents/get-contents-by-user-notion-id", {token, startCursor, pageSize})
		);
	}	

	static async getWaitForApproved(token, startCursor, pageSize) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/contents/get-wait-for-approve", {token, startCursor, pageSize})
		);
	}	

	static async repost(token, contentNotionID, urlPost, objectID, typeObject, pageUserName, pageID) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/contents/re-post", {token, contentNotionID, urlPost, objectID, typeObject, pageUserName, pageID})
		);
	}

	static async update(token, contentID, referenceID) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/contents/${contentID}/update`, {token, referenceID})
		);
	}

	static async loved(token, contentID) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/contents/${contentID}/loved`, {token})
		);
	}
	static async expired(token, contentID) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/contents/${contentID}/expired`, {token})
		);
	}

	static async review(token, contentNotionID, reviewCode) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/contents/review", {token, contentNotionID, reviewCode})
		);
	}

	static async getMemberByEmail(token, resourceData, reviewCode) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/contents/review", {token, resourceData, reviewCode})
		);
	}

	static async create(token, title, fileName, urlMedia, collectionIDList, referenceIPSelected) {
		console.log("ref IP Seleted: ", referenceIPSelected)
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/contents/create", {token, title, fileName, urlMedia, collectionIDList, referenceIPSelected})
		);
	}

	static async search(keywords, token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/contents/search", {keywords, token})
		);
	}

	static async getContentByID(contentID, token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/contents/${contentID}`, {token})
		);
	}	

	static async getContentByCollectionID(collectionID, startCursor, pageSize, token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/collection/${collectionID}`, {startCursor, pageSize,token})
		);
	}

	static async getContentByAccountID(accountNotionID, startCursor, pageSize, token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/account/${accountNotionID}`, {startCursor, pageSize,token})
		);
	}

	static async getMyFavourite(token, startCursor, pageSize) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost(`/api/contents/favourite`, {token, startCursor, pageSize})
		);
	}
}
