import { CEApiClient } from "@cabineat/utilities/api-client";
import { apiHost } from "../config";

export default new CEApiClient({
    host: apiHost,
    log: true,
});
