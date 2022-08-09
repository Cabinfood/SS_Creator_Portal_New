import { POST_NOTION_DATABASE_ID, NOTION_API_KEY, TIMEZONE_ZERO } from "../../../constant";
import { BaseNotionRepo } from "./base.repo";
import * as momentTz from 'moment-timezone'
import _ from "lodash";

class PostsNotionRepo extends BaseNotionRepo {
  constructor() {
      super(NOTION_API_KEY, POST_NOTION_DATABASE_ID)
  }

  async all(startCursor, pageSize) {        
      const response = await this.getManyByCondition(
        undefined,
        [{property: "last_updated_at",direction: "descending"}],
        startCursor, 
        pageSize
      )
      return response || null
  }    

  async create(urlPost, resourcesID, postedByID, objectID, typeObject, channelNotionID, objectTitle, isPublished, objectCreatedTime, objectScheduleTime, objectThumbnail) {    
    let response = null    
    if (!_.isNull(objectScheduleTime)) {
      response = await this.createPage({
        url: {
          rich_text: [
            {
              text: {
                content: urlPost ? urlPost : "",
              },
            },
          ],
        },
        of_resource: {
          relation:[
            {
              id: resourcesID
            }
          ]
        },
        posted_by: {
          relation:[
            {
              id: postedByID
            }
          ]
        },
        of_channel: {
          relation:[
            {
              id: channelNotionID
            }
          ]
        },
        object_id : {
          rich_text: [
            {
                text: {
                  content : objectID || ""
                }
            }
          ]
        },
        type_object : {
          select: {
            name: typeObject
          }
        },
        title: {
          title: [
            {
              text: {
                content: objectTitle || ""
              },
            },
          ]
        },
        is_published: {
            checkbox: isPublished || false
        },        
        object_thumbnail: {
          files: [
            {
              type: "external",
              name: "thumb",       
              external: {
                url: objectThumbnail || ""
              }                     
            }                    
          ]
        },    
        object_created_time: {
          date: {
            start: momentTz.tz(objectCreatedTime, TIMEZONE_ZERO).tz('Asia/Bangkok').toISOString(true)
          }
        },
        object_schedule_time: {
          date: {
            start: momentTz.tz(objectScheduleTime, TIMEZONE_ZERO).tz('Asia/Bangkok').toISOString(true)
          }
        }            
      }) 
    } else {
      response = await this.createPage({
        url: {
          rich_text: [
            {
              text: {
                content: urlPost ? urlPost : "",
              },
            },
          ],
        },
        of_resource: {
          relation:[
            {
              id: resourcesID
            }
          ]
        },
        posted_by: {
          relation:[
            {
              id: postedByID
            }
          ]
        },
        of_channel: {
          relation:[
            {
              id: channelNotionID
            }
          ]
        },
        object_id : {
          rich_text: [
            {
                text: {
                  content : objectID || ""
                }
            }
          ]
        },
        type_object : {
          select: {
            name: typeObject
          }
        },
        title: {
          title: [
            {
              text: {
                content: objectTitle || ""
              },
            },
          ]
        },
        is_published: {
          checkbox: isPublished
        },       
        object_thumbnail: {
          files: [
            {
              type: "external",
              name: "thumb",        
              external: {
                url: objectThumbnail || ""
              }                     
            }                    
          ]
        },         
        object_created_time: {
          date: {
            start: momentTz.tz(objectCreatedTime, TIMEZONE_ZERO).tz('Asia/Bangkok').toISOString(true)
          }
        },
      }) 
    }
    
    return response
  }  

  async updatePostResource(postID, resourcesID, postedByID, objectID, typeObject, channelNotionID) {
    const response = await this.updatePageByPropertise(postID, {
      of_resource: {
        relation:[
          {
            id: resourcesID
          }
        ]
      },
      posted_by: {
        relation:[
          {
            id: postedByID
          }
        ]
      },
      of_channel: {
        relation:[
          {
            id: channelNotionID
          }
        ]
      },
      object_id : {
        rich_text: [
          {
            text: {
              content : objectID || ""
            }
          }
        ]
      },
      type_object : {
        select: {
          name: typeObject
        }
      }
    })
    return response
  }

  async updatePostStatistic(postID, impression, reach, view, comment, share, reaction, adImpression, revenue, cpm) {
    
    const response = await this.updatePageByPropertise(postID, {
      impression: impression,
      reach: reach,
      view: view,
      comment: comment,
      share: share,
      reaction: reaction,
      ad_impression: adImpression,
      earning: revenue,
      cpm: cpm,				
    })    
    return response
    
  }

  async getPostByDate (date,timezone = 'Asia/Saigon') {
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

export default new PostsNotionRepo()


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