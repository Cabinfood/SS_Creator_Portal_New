// Remove this if you're not using Fullcalendar features
const withTM = require("next-transpile-modules")(["@fullcalendar/common", "@fullcalendar/react", "@fullcalendar/daygrid", "@fullcalendar/list", "@fullcalendar/timegrid", "@fullcalendar/timeline"]);

module.exports = withTM({
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: { plugins: [{ removeViewBox: false }] },
          },
        },
      ],
    });
    return config;
  },

  async redirects() {
    return [
      // {
      //   source: "/",
      //   destination: "/newsfeed",
      //   permanent: true,
      // },
    ];
  },

  env: {
    NEXT_PUBLIC_FOOTER_NOTION_PAGE_ID: process.env.FOOTER_NOTION_PAGE_ID,
    NEXT_PUBLIC_HOME_NOTION_PAGE_ID: process.env.HOME_NOTION_PAGE_ID,
    NEXT_PUBLIC_PAGE_DATABASE_NOTION: process.env.PAGE_DATABASE_NOTION,
    NEXT_PUBLIC_MENU_DATABASE_NOTION: process.env.MENU_DATABASE_NOTION,
    NEXT_PUBLIC_SITE_NAME: process.env.SITE_NAME,
    NEXT_PUBLIC_LOGO_URL: process.env.LOGO_URL,
    NEXT_PUBLIC_FAV_URL: process.env.FAV_URL,
    NEXT_SETTING_NOTION_PAGE_ID: process.env.SETTING_NOTION_PAGE_ID,
    NEXT_PUBLIC_MEMBER_NOTION_DATABASE_ID: process.env.MEMBER_NOTION_DATABASE_ID,
    NEXT_PUBLIC_RESOURCES_NOTION_DATABASE_ID: process.env.RESOURCES_NOTION_DATABASE_ID,
    NEXT_PUBLIC_POST_NOTION_DATABASE_ID: process.env.POST_NOTION_DATABASE_ID,
    NEXT_PUBLIC_COLLECTION_NOTION_DATABASE_ID: process.env.COLLECTION_NOTION_DATABASE_ID,
    NEXT_PUBLIC_IP_AUTHORIZE_NOTION_DATABASE_ID: process.env.IP_AUTHORIZE_NOTION_DATABASE_ID,
    NEXT_PUBLIC_PARTNER_NOTION_DATABASE_ID: process.env.PARTNER_NOTION_DATABASE_ID,
    NEXT_PUBLIC_IP_REFERENCE_NOTION_DATABASE_ID: process.env.IP_REFERENCE_NOTION_DATABASE_ID,
    NEXT_PUBLIC_VNG_FOLDER: process.env.VNG_FOLDER,
    NEXT_PUBLIC_GTM_CONTAINER_ID: process.env.GTM_CONTAINER_ID,
    NEXT_PUBLIC_CHANNEL_NOTION_DATABASE_ID: process.env.CHANNEL_NOTION_DATABSE_ID,
    NEXT_PUBLIC_FB_APP_FANPAGE_CONN_SCOPE: process.env.FB_APP_FANPAGE_CONN_SCOPE,
    NEXT_PUBLIC_FB_GRAPH_API_VERSION: process.env.FB_GRAPH_API_VERSION,
    NEXT_PUBLIC_FB_APP_GRAPH_API_HOST: process.env.FB_APP_GRAPH_API_HOST,
    NEXT_PUBLIC_FB_SDK_VERSION: process.env.FB_SDK_VERSION,
    NEXT_PUBLIC_FB_APP_SECRET: process.env.FB_APP_SECRET,
    NEXT_PUBLIC_FB_APP_ID: process.env.FB_APP_ID,
    NEXT_PUBLIC_DOCUMENT_NOTION_ID: process.env.DOCUMENT_NOTION_ID,
    NEXT_PUBLIC_CHANNEL_STATISTIC_NOTION_ID: process.env.CHANNEL_STATISTIC_NOTION_ID,
  },
});
