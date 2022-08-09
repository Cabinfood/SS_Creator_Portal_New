import baseApiClient from "./base.api-client";

export default class MemberApiClient {
	static async updateAvatar(token, avatarURL) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/member/update-avatar", {
				token,
				avatarURL
			})
		)
	}
	static async updateIDImage(token, frontURL, backURL) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/member/update-id-image", {
				token,
				frontURL,
				backURL
			})
		)
	}
	
	static async getPartner(token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/partner/all", {
				token,				
			})
		)
	}	
}