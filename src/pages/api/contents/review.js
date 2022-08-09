import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../api-server/notion/repos/contents.repo"
import { CONTENT_REVIEW_CODE, JWT_SECURE_KEY } from "../../../constant"
import collectionRepo from "../../../api-server/notion/repos/collection.repo"
import memberRepo from "../../../api-server/notion/repos/member.repo"
import axios from "axios"

export default async function ReviewAction(req, res) {
    const {token, contentNotionID, reviewCode} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {        
        const contentUpdateResponse = await contentsRepo.review(contentNotionID, reviewCode, payload?.notion_id)
        res.send(contentUpdateResponse || null)

        if(reviewCode !== CONTENT_REVIEW_CODE.APPROVED) return;

        // SYNC VIRAL CONTENT IF CONTENT WAS APPROVED
        // ======================================================================
        const memberResponse = await memberRepo.retrive(payload?.notion_id)
        console.log("member id migrated: ", memberResponse?.properties?.account_id_migration?.rich_text?.[0]?.plain_text)
        const collectionSelectID = contentUpdateResponse?.properties?.collection_id?.rollup?.array
        const collectionMigratedID = await getCollectionMigrateID(collectionSelectID)          

        const migrateObject = {
            title: contentUpdateResponse?.properties?.title?.title?.[0]?.plain_text || null,
            caption: contentUpdateResponse?.properties?.title?.title?.[0]?.plain_text || null,
            content: contentUpdateResponse?.properties?.title?.title?.[0]?.plain_text || null,
            status: 1,
            accountId: memberResponse?.properties?.account_id_migration?.rich_text?.[0]?.plain_text,
            // "reviewedById": "string",
            // "contractId": "string",
            collectionIds: collectionMigratedID, // when api update need to remove [0] -> to convert string of list collection_id with split ","
            videoLink: contentUpdateResponse?.properties?.attachments?.files?.[0]?.external?.url || null,
            // "imageLink": "string"
        }

        const migrateResponse = await migrateAction(migrateObject)      
        if (migrateResponse?.success) {           
            console.log("=== 2.2 UPDATING NOTION RECORD - ") 
            const updateNotionCotentResponse = await contentsRepo.updatePageByPropertise(contentNotionID,{
                content_id_migration: {
                    rich_text: [{
                        text: {
                            content: migrateResponse?.data?.id || ""
                        }
                    }]
                },
                migrate_status:{
                    checkbox: true
                }
            })
            console.log("=== 2.3 UPDATE SUCCESS - ")
        } else {
            console.log("=== ERROR: CHECK ACCOUNT ON SQL DATABASE MAYBE NOT EXIST")
        }    
        return ;

    } 
    return res.send(null)
}


async function migrateAction(data) {
    try {
        console.log("===== MIGRATING...")
        const atk = "anhVinhdeptraiSandsoMigration"
        const serverURL = 'https://api.sand.so'
        const baseURL = serverURL + '/v1/notion-migration/create-viral-content'
        
        const response = await axios.post(baseURL, data, {
            headers: {
                'atk': atk
            },
        })        
        console.log("===== MIGRATION COMPLETE: ", response?.data)
        return response?.data    
    } catch (error) {
        console.log("==== ERROR: ", error)
    }
    
}

const getCollectionMigrateID = async(collectionID) => {
    console.log("===== GET COLLECTION")
    var colListMigrateID = []
    for (var i=0; i<collectionID?.length; i++) {
        const temp = collectionID[i]?.formula?.string
        const colResponse = await collectionRepo.retrive(temp)    
        colListMigrateID.push(colResponse?.properties?.collection_id_migration?.rich_text[0]?.plain_text)
    }
    
    return colListMigrateID   
}