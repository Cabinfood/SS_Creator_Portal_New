import { MEMBER_NOTION_DATABASE_ID, NOTION_API_KEY } from "../../../constant";
import { BaseNotionRepo } from "./base.repo";

class MemberNotionRepo extends BaseNotionRepo {
    constructor() {
        super(NOTION_API_KEY, MEMBER_NOTION_DATABASE_ID)
    }

    async getOneMemberByConditionByCabinID (cabinID, phone) {
        const member = await this.getOneByCondition({
            and: [
                {
                    or: [
                        {
                            property: 'cabin_id',
                            rich_text: 
                            {
                                equals: cabinID,
                            }
                        },
                        {
                            property: 'phone',
                            rich_text: 
                            {
                                equals: phone,
                            }

                        }                    
                    ]
                }   ,
                {
                    property: 'is_actived',
                    checkbox: 
                    {
                        equals: true,
                    }
                },
            ]            
            }            
        )
        return member || null
    }
    
    async updateMemberInformation (memberPageID, fullName, phone, email, cabinId) {
        const member = await this.updatePageByPropertise(memberPageID, {
            "fullname": {
                title: [
                    {
                        text: {
                            content: fullName ? fullName : null
                        }
                    }                    
                ]
            },
            "phone": {
                rich_text: [
                    {
                        text: {
                            content: phone ? phone : null
                        }
                    }
                    
                ]
            },
            "email": {
                rich_text: [
                    {
                        text: {
                            content: email ? email : null
                        }
                    }
                ]
            },
            "cabin_id": {
                rich_text: [{
                    text: {
                        content: cabinId ? cabinId: ""
                    }
                }]
            }            
        })
        return member
    }

    async getOneMemberByConditionByEmail (email) {
        const member = await this.getOneByCondition({
            or: [
                    {
                        property: 'email',
                        rich_text: 
                        {
                            equals: email,
                        }
                    }        
                ]
            }            
        )
        return member || null
    }

    async updateAvatar (userNotionID, avatarURL) {
        console.log(userNotionID, avatarURL)
        const updateRes = await this.updatePageByPropertise(userNotionID, {
            avatar: {
                files: [
                    {
                        type: "external",
                        name: "avatar",
                        external: {
                            url: avatarURL
                        }                     
                    }
                ]
            }
        })
        return updateRes
    }

    async updateIDImage (userNotionID, frontURL, backURL) {
        console.log(userNotionID, frontURL, backURL)
        const updateRes = await this.updatePageByPropertise(userNotionID, {
            kyc_id_image_front: {
                files: [
                    {
                        type: "external",
                        name: "front",
                        external: {
                            url: frontURL
                        }                     
                    }
                ]
            },
            kyc_id_image_back: {
                files: [
                    {
                        type: "external",
                        name: "front",
                        external: {
                            url: backURL
                        }                     
                    }
                ]
            }
        })
        return updateRes
    }
}

export default new MemberNotionRepo()