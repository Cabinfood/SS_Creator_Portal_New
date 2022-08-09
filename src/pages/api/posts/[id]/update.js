import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import contentsRepo from "../../../../api-server/notion/repos/contents.repo"
import postsRepo from "../../../../api-server/notion/repos/posts.repo"
import { JWT_SECURE_KEY } from "../../../../constant"

export default async function updatePost(req, res) {
    const {token, impression, reach, view, comment, share, reaction, adImpression, revenue, cpm} = req.body
    const {id} = req.query
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)

    if (payload) {
        console.log("update.js: ", impression, reach, view, comment, share, reaction, adImpression, revenue, cpm)
        const response = await postsRepo.updatePostStatistic(id, impression, reach, view, comment, share, reaction, adImpression, revenue, cpm)
        return res.send(response || null)
    } 
    res.send(null)
}
