import _ from "lodash";
import { NOTION_DATABASE } from "../../../config";
import { PLATFORM } from "../../../constant";
import { BaseNotionRepo } from "./base.repo";

class ChannelNotionRepo extends BaseNotionRepo {
	constructor() {
		super(NOTION_DATABASE.API_KEY, NOTION_DATABASE.CHANNEL)
	}

	async getAllResources () {        
		const response = await this.getManyByCondition(undefined,[{property: "followers_count",direction: "descending"}])
		return response || null
	}    

	async createFacebookChannel(grantedByID, accessToken, pageName, username, channelID, url, followersCount, fansCount, avatarURL, coverURL) {
		try {
			if (_.isNull(accessToken) || _.isNull(pageName) || _.isNull(channelID) || _.isNull(url)  || _.isNull(followersCount) || _.isNull(fansCount)) {
				console.log("thiesu du lieu")
				return null;
			}
			
			const response = await this.createPage(
				{
					title: {
						title: [
							{
								text: {
									content: pageName ? pageName : "",
								},
							},
						]
					},
					accessToken: {
						rich_text: [
							{
								text: {
									content: accessToken ? accessToken : "",
								},
							},
						],
					},
					url: {
						rich_text: [
							{
								text: {
									content: url ? url : "",
								},
							},
						],
					},
					username: {
						rich_text: [
							{
								text: {
									content: username ? username : "",
								},
							},
						],
					},
					channel_id: {
						rich_text: [
							{
								text: {
									content: channelID ? channelID : "",
								},
							},
						],
					},
					platform: {
						rich_text: [
							{
								text: {
									content: PLATFORM.FACEBOOK,
								},
							},
						],
					},
					fans_count: {
						number: fansCount
					},
					followers_count: {
						number: followersCount
					},
					avatar: {
						files: [
							{
								type: "external",
								name: "avatar",
								external: {
									url: avatarURL ? avatarURL : null
								}
							}
						]
					},
					cover: {
						files: [
							{
								type: "external",
								name: "avatar",
								external: {
									url: coverURL ? coverURL : null
								}
							}
						]
					},
					grant_access_by: {
						relation:[
							{
								id: grantedByID ? grantedByID : null
							}
						]
					}
				},
				avatarURL ? avatarURL : null,
				coverURL ? coverURL : null
			) 
			return response
		} catch (error) {
			console.log(error)
			return null
		}
		
	}  

	async updateChannelData(channelNotionID, propertiesUpdate, iconURL, coverURL) {		
		const response = await this.updatePageByPropertise(channelNotionID, propertiesUpdate, iconURL, coverURL)
		return response
	}
}

export default new ChannelNotionRepo()


/*
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

(async () => {
const response = await notion.pages.create({
	parent: {
	database_id: '48f8fee9cd794180bc2fec0398253067',
	},
	icon: {
		type: "emoji",
			emoji: "🎉"
	},
	cover: {
		type: "external",
		external: {
			url: "https://website.domain/images/image.png"
		}
	},
	properties: {
	Name: {
		title: [
		{
			text: {
			content: 'Tuscan Kale',
			},
		},
		],
	},
	Description: {
		rich_text: [
		{
			text: {
			content: 'A dark green leafy vegetable',
			},
		},
		],
	},
	'Food group': {
		select: {
		name: '🥦 Vegetable',
		},
	},
	Price: {
		number: 2.5,
	},
	},
	children: [
	{
		object: 'block',
		type: 'heading_2',
		heading_2: {
		text: [
			{
			type: 'text',
			text: {
				content: 'Lacinato kale',
			},
			},
		],
		},
	},
	{
		object: 'block',
		type: 'paragraph',
		paragraph: {
		text: [
			{
			type: 'text',
			text: {
				content: 'Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.',
				link: {
				url: 'https://en.wikipedia.org/wiki/Lacinato_kale',
				},
			},
			},
		],
		},
	},
	],
});
console.log(response);
})();
*/