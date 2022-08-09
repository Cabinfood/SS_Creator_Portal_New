export const amplifyConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id:
    process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
};

export const auth0Config = {
  client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
};

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const gtmConfig = {
  containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
};

export const apiHost = process.env.NEXT_PUBLIC_API_HOST;

export const FB_APP = {
  ID: process.env.NEXT_PUBLIC_FB_APP_ID,
  SECRET: process.env.NEXT_PUBLIC_FB_APP_SECRET,
  SDK_VERSION: process.env.NEXT_PUBLIC_FB_SDK_VERSION,
  GRAPH_API_HOST: process.env.NEXT_PUBLIC_FB_APP_GRAPH_API_HOST,
  GRAPH_API_VERSION: process.env.NEXT_PUBLIC_FB_GRAPH_API_VERSION,
  FANPAGE_CONN_SCOPE: process.env.NEXT_PUBLIC_FB_APP_FANPAGE_CONN_SCOPE,
};


export const NOTION_DATABASE = {
  API_KEY: process.env.NOTION_API_KEY,
  CHANNEL: process.env.NEXT_PUBLIC_CHANNEL_NOTION_DATABASE_ID,
  IP: process.env.NEXT_PUBLIC_IP_AUTHORIZE_NOTION_DATABASE_ID,  
  IP_REFERENCE: process.env.NEXT_PUBLIC_IP_REFERENCE_NOTION_DATABASE_ID,
  PARTNER: process.env.NEXT_PUBLIC_PARTNER_NOTION_DATABASE_ID,
  DOCUMENT_NOTION_ID: process.env.NEXT_PUBLIC_DOCUMENT_NOTION_ID,
  CHANNEL_STATISTIC_NOTION_ID: process.env.NEXT_PUBLIC_CHANNEL_STATISTIC_NOTION_ID
}