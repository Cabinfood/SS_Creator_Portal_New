import { useEffect, useState } from 'react';

import Head from 'next/head';
import { MainLayout } from '../components/main-layout';
import { gtm } from '../lib/gtm';
import { Box } from '@mui/system';
import NotionPage from '../components/notion/notion-page';
import {getPage} from "../utils/notion.util"
import {SETTING_NOTION_PAGE_ID} from "../constant"
import NotionApiClient from "../api-clients/notion.api-client"

const Home = (props) => {
	const {data} = props
	const [notionPageData, setNotionPageData] = useState(null)

	useEffect(() => {
		gtm.push({ event: 'page_view' });
		getPageContent(data?.page_id)
	}, [data?.page_id]);	

	const getPageContent = async(pageID) => {  
		const pageData = await NotionApiClient.getPageRender(pageID)
        const {data} = pageData || {}
        setNotionPageData(data)
    }

	return (
		<>
			<Head>
				<title> {data?.title} | {data?.setting?.site_name}</title>
				<link rel="icon" href={data?.setting?.fav ? data?.setting?.fav : "/favicon.ico"}></link>
                <meta property="og:type" content="article" />
                <meta property="og:title" content={data?.title} />
                <meta property="og:description" content={data?.description} />
                <meta property="og:image" content={data?.cover} />
				
			</Head>
			<main>
				<Box sx={{p:2}}>
					{notionPageData
                    ? <NotionPage pageData={notionPageData} fullPage={false} />
                    : null                    
                    }
				</Box>
			</main>
		</>
	);
};

Home.getLayout = (page,pageProps) => (
	<MainLayout pageProps={pageProps}>
		{page}
	</MainLayout>
);

export const getServerSideProps = async() =>{
	const settingData = await getPage(SETTING_NOTION_PAGE_ID)
    const response = {}	 
	
	if (settingData) {
		response.setting = {
			site_name: settingData?.properties?.site_name?.rich_text?.[0]?.plain_text,
			fav: settingData?.properties?.fav?.files?.[0]?.file?.url,
			logo: settingData?.properties?.logo_full?.files?.[0]?.file?.url,
			menu_icon: settingData?.properties?.menu_icon?.files?.[0]?.file?.url,
			home_page_id: settingData?.properties?.home_page_id?.rich_text?.[0].plain_text,
			footer_page_id: settingData?.properties?.footer_page_id?.rich_text?.[0].plain_text,
			pages_database: settingData?.properties?.pages_database?.rich_text?.[0].plain_text,
			menu_database: settingData?.properties?.menu_database?.rich_text?.[0].plain_text,
		}
		
		if (settingData?.properties?.home_page_id?.rich_text?.[0].plain_text) {
			const page = await getPage(settingData?.properties?.home_page_id?.rich_text?.[0].plain_text)
			response.title = page?.properties?.title?.title[0]?.plain_text
			response.cover =  page?.cover?.type === "file" 
								? page?.cover?.file?.url  
								: page?.cover?.type === "external" 
									? page?.cover?.external?.url
									: null
			response.icon = page?.icon?.type === 'file' ? page?.icon?.file?.url : null
			response.description = page?.properties?.description?.rich_text[0]?.plain_text || ""
			response.page_id = page?.id || null
		}
	}

    return {
        props: {
            data: response,
        },
		// revalidate: 60
    }
}


export default Home;
