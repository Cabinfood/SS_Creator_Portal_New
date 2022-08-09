import { vertifyJwtToken } from "@cabineat/utilities/jwt"
import { VNG, JWT_SECURE_KEY} from "../../../constant"

export default async function uploadVNG(req, res) {
    const {token} = req.body    
    const payload = vertifyJwtToken(token, JWT_SECURE_KEY)
    console.log(token)
    if (payload) {        

        const requestURL = VNG.AUTH_API + "/auth/tokens"
        try {
            const response = await fetch(requestURL, {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    auth: {
                        identity: {
                            methods: ["password"],
                            password: {
                            user: {
                                domain: {
                                name: "default",
                                },
                                name: VNG.USER_NAME,
                                password: VNG.PASSWORD,
                            },
                            },
                        },
                        scope: {
                            project: {
                            domain: {
                                name: "default",
                            },
                            id: VNG.ID,
                            },
                        },
                    },
                })
            });
            const dataResponse = await response.json()
            const urlUpload = (dataResponse.token.catalog.find(catg => catg?.type === "object-store")?.endpoints||[]).find(endpoint => endpoint?.interface === "public")?.url
            const tokenUpload = response.headers.get("x-subject-token")
            
            return res.json({
                urlUpload,
                tokenUpload
            })
        } catch (error) {
            console.log(error)
            return res.send(error)
        }
    }
}