import { JWT_SECURE_KEY } from "../../constant";
import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../api-server/notion/repos/contents.repo";
import postsRepo from "../../api-server/notion/repos/posts.repo"


export default async function search(req, res) {        
    const {token, keyword} = req.body
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {
        const postData = await postsRepo.getManyByCondition(
            {or: 
                [
                    {
                        property: 'object_id',
                        rich_text: {
                            contains: keyword
                        },
                    },
                    {
                        property: 'resources_title',
                        rollup: {
                            any: {
                                rich_text: {
                                    contains: keyword
                                }
                            }
                        },
                    },         
                    {
                        property: 'posted_by_name',
                        rollup: {
                            any: {
                                rich_text: {
                                    contains: keyword
                                }
                            }
                        },
                    },           
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],
            undefined,
            30
        )

        const contentData = await contentsRepo.getManyByCondition(
            {or: 
                [
                    {
                        property: 'title',
                        rich_text: {
                            contains: keyword
                        },
                    },                    
                    {
                        property: 'editor_name',
                        rollup: {
                            any: {
                                rich_text: {
                                    contains: keyword
                                }
                            }
                        },
                    },
                ]
            },
            [{property: "last_updated_at",direction: "descending"}],
            undefined,
            30
        )

        return res.send({
            posts: postData.results,
            contents: contentData.results
        })
    } 
    return res.send(null)
}