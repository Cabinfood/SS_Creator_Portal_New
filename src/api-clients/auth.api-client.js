import baseApiClient from "./base.api-client";

export default class AuthApiClient {
	static async getProfileFromToken(token) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/auth/get-profile-via-token", {
				token,
			})
		);
	}	

	static async accessViaCabinID(atk, profile) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/auth/access-via-cabin-id", {
				atk,
				profile
			})
		)
	}

	static async getProfileByEmail(token, email) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/auth/get-profile-via-email", {
				token,
				email
			})
		)
	}

	static async updateAvatar(token, avatarURL) {
		return baseApiClient.wrapResponse(
			baseApiClient.asyncPost("/api/auth/update-avatar", {
				token,
				avatarURL
			})
		)
	}
}
