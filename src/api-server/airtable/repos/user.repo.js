import { CEBaseRepo } from "@cabineat/utilities/airtable-connection";

class UserRepo extends CEBaseRepo {
	constructor() {
		super({
			connectionInfo: {
				apiKey: "keyHAwBS13CrEf8ls",
				baseID: "appF6zO1wO4EKacCL",
				tableName: "account",
			},
			standardEntityForGetting: null,
			standardEntityForSaving: null,
			singleRelationColumns: [],
		});
	}
}

export default new UserRepo()