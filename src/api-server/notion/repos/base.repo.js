import { Client } from "@notionhq/client";
import _ from "lodash";

export class BaseNotionRepo {
    constructor(accessKey,databaseId) {
        this.notion= new Client({auth: accessKey}),
        this.databaseId=databaseId;
    }

    async getOneByCondition(conditionFormular) {
        const response = await this.notion.databases.query({
            database_id: this.databaseId,
            filter: conditionFormular,
        })
        return response?.results?.[0] || null;
    }

    async getManyByCondition(conditionFormular, sortFormular, startCursor, pageSize) {
        const response = await this.notion.databases.query({
            database_id: this.databaseId,
            filter: conditionFormular,
            sorts: sortFormular,
            start_cursor: startCursor,
            page_size: pageSize ? pageSize : 100
        })
        return response || null;
    }

    async retrive(pageID) {
        const response = await this.notion.pages.retrieve({ page_id: pageID })
        return response
    }
    
    async updatePageByPropertise(pageId, propertiesFormular, iconURL, coverURL) {
        let response
        
        if (_.isNull(iconURL) || _.isNull(coverURL) || _.isUndefined(iconURL) || _.isUndefined(iconURL)) {
            response = await this.notion.pages.update({
                page_id: pageId,
                properties: propertiesFormular
            })
        } else {
            response = await this.notion.pages.update({
                page_id: pageId,
                properties: propertiesFormular,
                icon: {
                    type: "external",
                    external: {
                        url: iconURL
                    }
                },
                cover: {
                    type: "external",
                    external: {
                        url: coverURL
                    }
                }
            })
        }
        return response
    }

    async createPage(propertiesFormular, iconURL, coverURL) {     
        let response
        if (iconURL && coverURL) {
            response = await this.notion.pages.create({
                parent: {
                    database_id: this.databaseId,
                },
                properties: propertiesFormular,
                icon: {
                    type: "external",
                    external: {
                        url: iconURL ? iconURL : ""
                    }
                },
                cover: {
                    type: "external",
                    external: {
                        url: coverURL ? coverURL : ""
                    }
                }
            });
        } else {
            response = await this.notion.pages.create({
                parent: {
                    database_id: this.databaseId,
                },
                properties: propertiesFormular                
            });
        }
        
        return response
    }

    async getBlocks(blockId) {
        const blocks = [];
        let cursor;
        while (true) {
            const { results, next_cursor } = await this.notion.blocks.children.list({
                start_cursor: cursor,
                block_id: blockId,
            });
            blocks.push(...results);
            if (!next_cursor) {
                break;
            }
            cursor = next_cursor;
        }
        return blocks;
    };
}
