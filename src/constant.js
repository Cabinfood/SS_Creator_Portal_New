export const NOTION_API_KEY = process.env.NOTION_API_KEY
export const NOTION_PAGE_DATABASE = process.env.NEXT_PUBLIC_PAGE_DATABASE_NOTION
export const NOTION_MENU_DATABASE = process.env.NEXT_PUBLIC_MENU_DATABASE_NOTION
export const HOME_NOTION_PAGE_ID = process.env.NEXT_PUBLIC_HOME_NOTION_PAGE_ID
export const FOOTER_NOTION_PAGE_ID = process.env.NEXT_PUBLIC_FOOTER_NOTION_PAGE_ID
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME
export const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL
export const FAV_URL = process.env.NEXT_PUBLIC_FAV_URL
export const SETTING_NOTION_PAGE_ID = process.env.NEXT_SETTING_NOTION_PAGE_ID
export const MEMBER_NOTION_DATABASE_ID = process.env.NEXT_PUBLIC_MEMBER_NOTION_DATABASE_ID
export const RESOURCES_NOTION_DATABASE_ID = process.env.NEXT_PUBLIC_RESOURCES_NOTION_DATABASE_ID
export const POST_NOTION_DATABASE_ID = process.env.NEXT_PUBLIC_POST_NOTION_DATABASE_ID
export const COLLECTION_NOTION_DATABASE_ID = process.env.NEXT_PUBLIC_COLLECTION_NOTION_DATABASE_ID

export const JWT_SECURE_KEY = "sandbox"
export const CONTENT_REVIEW_CODE = {
    APPROVED: 1,
    REJECTED: -1,
    NOT_REVIEW: 0
}

export const CONTENT_REVIEW_STATUS = {
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    NOT_REVIEW: "NOT_REVIEW"
}

export const ERR_MSG = {
    NORMAL: "Có lỗi xảy ra, vui lòng thử lại !!!"
}

export const MEMBER_TIER = {
    MASTER_ADMIN: "Master Admin",
    GROWTH_LEADER: "Growth Leader",
    EDITOR_SPECIALIST: "Editor Specialist",
    SOCIAL_PERFORMANCE_SPECIALIST: "Performance Specialist"
}

export const MAX_REQUEST_PAGE_SIZE = {
    DEFAULT: 10,
    MAX: 100,
    LOAD_MORE: 10,
}

export const VNG_AUTH_API = "https://hcm.auth.vstorage.vngcloud.vn/v3"
export const VNG = {
    AUTH_API : "https://hcm.auth.vstorage.vngcloud.vn/v3",
    CDN_URL: "https://j3n99icvviobj.vcdn.cloud",
    USER_NAME: "admin@cabineat.vn",
    PASSWORD: "K4i?Sest",
    ID: "9c052c5882b44ace94dda4772593a005",
    FOLDER: process.env.NEXT_PUBLIC_VNG_FOLDER
}

export const FB_APP_ID = "4493655740697620"
export const PERIOD = {
    TODAY: "today",
    YESTERDAY: "yesterday",
    LAST_7_DAYS: "last7days",
    LAST_MONTH: "lastmonth"
}

export const PLATFORM = {
    FACEBOOK: "facebook",
    TIKTOK: "tiktok",
    YOUTUBE: "youtube"
}

export const TYPE_OBJECT = {
    POST: "posts",
    VIDEO: "videos"
}

export const TYPE_OF_FILE = {
    UPLOAD: "FILE UPLOAD",
    YOUTUBE: "YOUTUBE",
    DRIVE: "GOOGLE DRIVE / ONE DRIVE",
    OTHERS: "OTHERS"
}

export const TIME_INTERVAL = {
    OBJECT_INSIGHT: 45, /* 45mins */
    PAGE_INSIGHT: 120, /* 120mins */
    OLD_OBJECT_DATE_FRESH_DAILY: 7
}

export const TIMEZONE_ZERO = "Etc/UTC"