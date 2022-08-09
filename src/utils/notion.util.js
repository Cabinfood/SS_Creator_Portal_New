// import { NotionAPI } from "notion-client";
// const api = new NotionAPI();

import { NOTION_API_KEY } from "../constant";
import { Client } from "@notionhq/client";

const notion = new Client({
	auth: NOTION_API_KEY,
});

export const getDatabase = async (databaseId, filterFormular, sortFormular) => {	
	const response = await notion.databases.query({
		database_id: databaseId,
		filter: filterFormular,
		sorts: sortFormular
	});
	return response?.results;
	
};

export const searchPage = async (databaseId, keyword) => {	
	if (!keyword || keyword?.length == 0) return;	
	try {
		const response = await notion.databases.query({
			database_id: databaseId,
			filter: {
				and: [
					{
						property: 'published',
						checkbox: {
						  equals: true,
						},
					},
					{
						or:[
							// {
							// 	property: 'title',
							// 	text: {
							// 		contains: keyword
							// 	}
							// },
							// {
							// 	property: 'description',
							// 	text: {
							// 		contains: keyword
							// 	}
							// },
							// {
							// 	property: 'title_lowercase',
							// 	text: {
							// 		contains: keyword
							// 	}
							// },
							// {
							// 	property: 'description_lowercase',
							// 	text: {
							// 		contains: keyword
							// 	}
							// },
							{
								property: 'title_remove_tones',
								text: {
									contains: keyword
								}
							},
							{
								property: 'description_remove_tones',
								text: {
									contains: keyword
								}
							},
						]
					}
					
				]
			},
			sorts: [
				{
				  property: 'created_at',
				  direction: 'descending',
				},
			],
		});
		return response.results;		
	} catch (error) {
		return error.message
	}
	
};

export const getPage = async (pageId) => {
	if (!pageId) return;
	const response = await notion.pages.retrieve({ page_id: pageId });
	return response;
};

export const getBlocks = async (blockId) => {
	const response = await notion.blocks.children.list({
		block_id: blockId,
		// page_size: 50,
	});
	return response.results;
};

// export const getNotionPageData = async (pageId) => {
// 	return api.getPage(pageId).catch((err) => {
// 		console.error(err);
// 		return { block: {} };
// 	});
// };


