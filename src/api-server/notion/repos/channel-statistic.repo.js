import { TIMEZONE_ZERO } from "../../../constant";
import {NOTION_DATABASE} from "../../../config"
import { BaseNotionRepo } from "./base.repo";
import _ from "lodash";

class ChannelStatisticsNotionRepo extends BaseNotionRepo {
  	constructor() {
		console.log(NOTION_DATABASE.CHANNEL_STATISTIC_NOTION_ID)
		super(NOTION_DATABASE.API_KEY, NOTION_DATABASE.CHANNEL_STATISTIC_NOTION_ID)
	}  
}

export default new ChannelStatisticsNotionRepo()