import { COLLECTION_NOTION_DATABASE_ID, NOTION_API_KEY } from "../../../constant";
import { BaseNotionRepo } from "./base.repo";
import postsRepo from "./posts.repo";

class CollectionNotionRepo extends BaseNotionRepo {
    constructor() {
        super(NOTION_API_KEY, COLLECTION_NOTION_DATABASE_ID)
        console.log(COLLECTION_NOTION_DATABASE_ID)
    }    

    async getAll (startCursor, pageSize) {        
        const response = await this.getManyByCondition(
            {
                and: [
                    {
                        property: 'is_actived',
                        checkbox: {
                            equals: true
                        },
                    },
                    {
                        property: 'no_of_contents',
                        rollup: {
                            number: {
                                greater_than: 0    
                            }                            
                        },
                    },
                ]
            },
            [
                {
                    property: "last_updated_at",
                    direction: "descending"
                }
            ],
            startCursor, 
            pageSize
        )
        return response || null
    }

    async getCollectionByID (collectionID) {
        const response = await this.retrive(collectionID)
        return response || null
    }
}

export default new CollectionNotionRepo()