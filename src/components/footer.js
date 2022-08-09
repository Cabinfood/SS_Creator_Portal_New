import {Box} from '@mui/material';
import { useEffect, useState } from 'react';
import NotionApiClient from '../api-clients/notion.api-client';
import { FOOTER_NOTION_PAGE_ID } from '../constant';
import NotionPage from './notion/notion-page';

export const Footer = (props) => {
	const {pageID:footerPageID} = props || {}
	const [footerPageData, setFooterPageData] = useState()
	useEffect(()=>{
		fetchFooterData()
	},[])
	
	const fetchFooterData = async() => {
		const response = await NotionApiClient.getPageRender(footerPageID)
		const {data} = response || null
		if (!data) setFooterPageData(response?.data)
	}

	return(
		<div className='footer-wrapper'>
			<Box
				sx={{
					backgroundColor: 'background.default',
					borderTopColor: 'divider',
					borderTopStyle: 'solid',
					borderTopWidth: 1,
					pb: 6,
					pt: {
						md: 15,
						xs: 6
					}
				}}
				{...props}>
				<Box>
					<NotionPage pageData={footerPageData} fullPage={false}/>
				</Box>			
			</Box>
		</div>
	)
}