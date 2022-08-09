import { RESOURCES_NOTION_DATABASE_ID, NOTION_API_KEY, TIMEZONE_ZERO, TYPE_OBJECT } from "../../../constant";
import { BaseNotionRepo } from "./base.repo";
import postsRepo from "./posts.repo";
import * as momentTz from 'moment-timezone'
import FacebookApiClient from "../../../api-clients/fb.api-client";

class ContentsNotionRepo extends BaseNotionRepo {
    constructor() {
        super(NOTION_API_KEY, RESOURCES_NOTION_DATABASE_ID)
    }

    async getAllResources (startCursor, pageSize) {        
        const response = await this.getManyByCondition(
            {and:
                [
                    {
                        property: 'review_code',
                        number: {
                            equals: 1
                        },
                    },
                    {
                        property: 'is_expired',
                        checkbox: {
                            equals: false
                        }
                    },
                ]                
            },
            [{property: "last_updated_at",direction: "descending"}],
            startCursor, 
            pageSize
        )
        return response || null
    }

    async getContentsByUserNotionID (userNotionID, startCursor, pageSize) {      
        const response = await this.getManyByCondition(
            {and: 
                [
                    // {
                    //     property: 'review_code',
                    //     number: {
                    //         equals: 1
                    //     },
                    // },
                    {
                        property: 'created_by',
                        relation: {
                            contains: userNotionID
                        }
                    }                    
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],
            startCursor, 
            pageSize
        )
        return response || null
    }

    async getContentByID (contentID) {      
        const response = await this.retrive(contentID)
        return response || null
    }

    async loved (memberNotionID, contentID) {      
        const contentRes = await this.retrive(contentID)
        console.log("=====================")        
        let lovedList = contentRes?.properties?.loved_by?.relation
        console.log("love list: ", lovedList)
        
        if (lovedList.every(e => e.id !== memberNotionID)) {
            lovedList.push({id: memberNotionID})
        } else {
            lovedList = lovedList.filter( el => el.id !== memberNotionID )
        }

        const response = await this.updatePageByPropertise(contentID, {
            loved_by: {
				relation:lovedList
			}
        })
        return response || null
    }

    async getContentsByUserCabinID (userCabinID, startCursor, pageSize) {      
        console.log(userCabinID, startCursor, pageSize)  
        const response = await this.getManyByCondition(
            {and: 
                [
                    {
                        property: 'review_code',
                        number: {
                            equals: 1
                        },
                    },
                    {
                        property: 'editor_cabin_id',
                        rollup: { 
                            any: { 
                                rich_text: { 
                                    contains: userCabinID
                                } 
                            }
                        }
                    },
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],
            startCursor, 
            pageSize
        )
        return response || null
    }    

    async getMyFavourite (userNotionID, startCursor, pageSize) {      
        console.log(userNotionID, startCursor, pageSize)  
        const response = await this.getManyByCondition(
            {and: 
                [
                    // {
                    //     property: 'review_code',
                    //     number: {
                    //         equals: 1
                    //     },
                    // },
                    {
                        property: 'loved_by',
                        relation: { 
                            contains: userNotionID
                        }
                    },
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],
            startCursor, 
            pageSize
        )
        console.log(response)  
        return response || null
    }    


    async getContentsByCollectionID (collectionID, startCursor, pageSize) {      
        console.log(collectionID, startCursor, pageSize)  
        const response = await this.getManyByCondition(
            {and: 
                [
                    {
                        property: 'review_code',
                        number: {
                            equals: 1
                        },
                    },
                    {
                        property: 'collections',
                        relation: { 
                            contains: collectionID
                        }
                    },
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],
            startCursor, 
            pageSize
        )
        return response || null
    }    

    async getContentsByAccountNotionID (accountNotionID, startCursor, pageSize) {      
        console.log(accountNotionID, startCursor, pageSize)  
        const response = await this.getManyByCondition(
            {and: 
                [
                    {
                        property: 'review_code',
                        number: {
                            equals: 1
                        },
                    },
                    {
                        property: 'created_by',
                        relation: { 
                            contains: accountNotionID
                        }
                    },
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],
            startCursor, 
            pageSize
        )
        return response || null
    }    


    async search (keywords) {      
        const response = await this.getManyByCondition(
            {and: 
                [
                    {
                        property: 'review_code',
                        number: {
                            equals: 1
                        },
                    },
                    {
                        or: [
                            {
                                property: 'title',
                                rollup: { 
                                    any: { 
                                        title: { 
                                            contains: keywords
                                        } 
                                    }
                                }
                            },
                            {
                                property: 'collection_name',
                                rollup: { 
                                    any: { 
                                        title: { 
                                            contains: keywords
                                        } 
                                    }
                                }
                            },
                        ]    
                    }                                    
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],            
        )
        return response || null
    }    

    async getWaitForApproved (startCursor, pageSize) {        
        const response = await this.getManyByCondition(            
            {
                property: 'review_code',
                number: {
                    is_empty: true
                },
            },            
            [{property: "last_updated_at",direction: "descending"}],
            startCursor, 
            pageSize
        )
        return response || []
    }

    async review (contentNotionID, reviewCode, reviewerID) {
        if (!contentNotionID || !reviewerID) return null;

        const response = await this.updatePageByPropertise(contentNotionID, {
			review_code: {
                number: reviewCode
			},
			reviewed_by: {
				relation:[
					{
						id: reviewerID
					}
				]
			}
		})
		return response || null
    }

    async expired (reviewerID, contentNotionID) {
        if (!contentNotionID || !reviewerID) return null;

        const response = await this.updatePageByPropertise(contentNotionID, {
			is_expired: {
                checkbox: true
			},
            review_code: {
                number: -1
			},
			expired_by: {
				relation:[
					{
						id: reviewerID
					}
				]
			}
		})
		return response || null
    }
    
    async repost(contentNotionID, urlPost, postedByID, objectID, typeObject, channel) {
        // const createPost = await postsRepo.create(resourceData?.title, urlPost)    
        const channelNotionID = channel.id
        const channelID = channel?.properties?.channel_id?.rich_text?.[0]?.text?.content
        const channelAccessToken = channel?.properties?.accessToken?.rich_text?.[0]?.text?.content

        let objectInformationResponse = null        
        if (typeObject === TYPE_OBJECT.VIDEO) {
            objectInformationResponse = await FacebookApiClient.getVideoDetail(objectID, channelAccessToken)
        } else {
            objectInformationResponse = await FacebookApiClient.getPostDetail(channelID, objectID, channelAccessToken)
        }
        
        // RETURN NULL WHEN CAN NOT GET INFORMATION OF OBJECT
        if (!objectInformationResponse) return {
            error: true,
            msg: "Có lỗi xảy ra, không lấy được dữ liệu"
        }

        // UPDATE POST INFORMATION ON BASIC
        if (objectInformationResponse?.error === true)  {  
            console.log("objectInformationResponse?.data: ", objectInformationResponse?.data)
            const {code, error_subcode} = objectInformationResponse?.data?.data?.error || null
            if (code === 10 || (code === 100 && error_subcode === 33)) {
                return {
                    error: true,
                    msg: "Bài đăng đã bị xóa",
                    data: objectInformationResponse?.data?.data?.error?.message
                }
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> STOP.
            }                 
        }
        

        const {data: objectInformation} = objectInformationResponse
        const createPost = await postsRepo.create(urlPost, contentNotionID, postedByID, objectID, typeObject, channelNotionID, objectInformation?.title, objectInformation?.published, objectInformation.created_time, objectInformation.scheduled_publish_time, objectInformation.thumbnails)
        return {
            error: false,
            data: createPost,
            msg: "Thêm post thành công"
        }
    }

    async create(title, fileName, urlMedia, createdByID, collectionIDList, referenceID) {
        console.log("reference ID: ", referenceID)

        const collectionObject = []
        collectionIDList.forEach(item => {
            collectionObject.push({id: item})
        });
        
        let response
        if (referenceID && referenceID?.length > 0) {
            response = await this.createPage({
                title: {
                    title: [
                        {
                            text: {
                                content: title ? title : "",
                            },
                        },
                    ]
                },
                url: {
                    rich_text: [
                        {
                            text: {
                                content: urlMedia ? urlMedia : "",
                            },
                        },
                    ]
                },
                file_name: {
                    rich_text: [
                        {
                            text: {
                                content: fileName ? fileName : "",
                            },
                        },
                    ],
                },    
                created_by: {
                    relation:[
                        {
                            id: createdByID
                        }
                    ]
                },
                attachments: {
                    files: [
                        {
                            type: "external",
                            name: fileName,       
                            external: {
                                url: urlMedia
                            }                     
                        }
                    ]                
                },
                collections: {
                    relation: collectionObject
                },
                reference_ip: {
                    relation: [
                        {id: referenceID}
                    ]
                }
                
            }) 
        } else {
            response = await this.createPage({
                title: {
                    title: [
                        {
                            text: {
                                content: title ? title : "",
                            },
                        },
                    ]
                },
                url: {
                    rich_text: [
                        {
                            text: {
                                content: urlMedia ? urlMedia : "",
                            },
                        },
                    ]
                },
                file_name: {
                    rich_text: [
                        {
                            text: {
                                content: fileName ? fileName : "",
                            },
                        },
                    ],
                },    
                created_by: {
                    relation:[
                        {
                            id: createdByID
                        }
                    ]
                },
                attachments: {
                    files: [
                        {
                            type: "external",
                            name: fileName,       
                            external: {
                                url: urlMedia
                            }                     
                        }
                    ]                
                },
                collections: {
                    relation: collectionObject
                }                
            }) 
        }
        
		return response
    }

    async getContentByDate (date, timezone = 'Asia/Saigon') {       
        let results = []
        let dateQuery = new Date(date)

        let mNow = momentTz.tz(date, TIMEZONE_ZERO).tz(timezone);

        let data = await this.getManyByCondition(
          {
            and: [
                {
                  property: "created_at",
                  created_time: {
                    on_or_after: mNow.set('hours',0).set('minutes',0).set('seconds',0).toISOString()
                  }
                },
                {
                  property: "created_at",
                  created_time: {
                    on_or_before: mNow.set('hours',23).set('minutes',59).set('seconds',59).toISOString()
                  }
                }
            ]  
          },
          [{property: "last_updated_at",direction: "descending"}],
        )
        results = [...data?.results]
        
        while (data?.has_more) {
          data = await this.getManyByCondition(
            {
                and: [
                    {
                      property: "created_at",
                      created_time: {
                        on_or_after: mNow.set('hours',0).set('minutes',0).set('seconds',0).toISOString()
                      }
                    },
                    {
                      property: "created_at",
                      created_time: {
                        on_or_before: mNow.set('hours',23).set('minutes',59).set('seconds',59).toISOString()
                      }
                    }
                ]  
            },
            [{property: "last_updated_at",direction: "descending"}],
            data.next_cursor
          )
          results = [...results, ...data?.results] 
        }
        return results
    }
    
}

export default new ContentsNotionRepo()