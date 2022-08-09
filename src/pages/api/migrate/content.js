import partnerRepo from "../../../api-server/notion/repos/partner.repo"
import contentRepo from "../../../api-server/notion/repos/contents.repo"
import memberRepo from "../../../api-server/notion/repos/member.repo"
import baseApiClient from "../../../api-clients/base.api-client"
import axios from "axios"
import collectionRepo from "../../../api-server/notion/repos/collection.repo"

export default async function ContentMigrateTask(req, res) {    
    const {tel} = req.query
    console.log("tel: ", '+'+tel)
    // const curMemberPhone = "+84355430138"
    const curMemberPhone = '+'+tel
    res.send("SYNC CONTENTS OF: ", curMemberPhone)
    // 01. FIND MEMBER SQL ID
    const memberResponse = await memberRepo.getOneByCondition({
        property: 'phone',
        rich_text: 
        {
            equals: curMemberPhone,
        }

    })

    // 02. FIND CONTENT WAS NOT_REVIEW OR APPROVED ON NOTION DATABASE
    const contentList = await getContentsNotMigratedByEditorPhone(curMemberPhone)    
    console.log("=== TOTAL CONTENTS - ", contentList?.length)
    let count = 0
    for await(const contentItem of contentList) {
        try {
            // const contentItem = contentList[i]
            console.log("=== 2.1 UPDATING - ", contentItem?.properties?.title?.title?.[0]?.plain_text)
            const collectionSelectID = contentItem?.properties?.collection_id?.rollup?.array
            const collectionMigratedID = await getCollectionMigrateID(collectionSelectID)                

            const migrateObject = {
                title: contentItem?.properties?.title?.title?.[0]?.plain_text || null,
                caption: contentItem?.properties?.title?.title?.[0]?.plain_text || null,
                content: contentItem?.properties?.title?.title?.[0]?.plain_text || null,
                status: contentItem?.properties?.review_code?.number === 1 ? 2 : 1,
                accountId: memberResponse?.properties?.account_id_migration?.rich_text?.[0]?.plain_text,
                // "reviewedById": "string",
                // "contractId": "string",
                collectionIds: collectionMigratedID, // when api update need to remove [0] -> to convert string of list collection_id with split ","
                videoLink: contentItem?.properties?.attachments?.files?.[0]?.external?.url || null,
                // "imageLink": "string"
            }

            const migrateResponse = await migrateAction(migrateObject)            
            if (migrateResponse?.success) {           
                console.log("=== 2.2 UPDATING NOTION RECORD - ") 
                const updateNotionCotentResponse = await contentRepo.updatePageByPropertise(contentItem?.id,{
                    content_id_migration: {
                        rich_text: [{
                            text: {
                                content: migrateResponse?.data?.id
                            }
                        }]
                    },
                    migrate_status:{
                        checkbox: true
                    }
                })
                count++
                console.log("=== 2.3 UPDATE SUCCESS - ")
            } else {
                console.log("=== ERROR: CHECK ACCOUNT ON SQL DATABASE MAYBE NOT EXIST")
            }    
        } catch (error) {
            // console.log("=== ERROR....: ", error)
        }        
    };    
    // return res.send("Success Updated: ", count)
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

const getContentsNotMigratedByEditorPhone = async(phone) => {
    const contentReponse = await contentRepo.getManyByCondition(
        {and: [
            {
                or: [
                    {
                        property: 'review_code',
                        number: {
                            equals: 1
                        },
                    },
                    {
                        property: 'review_code',
                        number: {
                            equals: 0
                        },
                    },
                ]
            },
            {
                property: 'created_by_by_phone_number',
                rollup: {
                    any: {
                        rich_text: {
                            contains: phone
                        }
                    }
                }
            },
            {
                property: 'migrate_status',
                checkbox: {
                    equals: false
                }
            }            
        ]},
        [{property: "created_at",direction: "descending"}],
    )    
    console.log("=== 1.COMPLETE GET LIST CONTENT NON_MIGRATION")
    return contentReponse?.results || []
}