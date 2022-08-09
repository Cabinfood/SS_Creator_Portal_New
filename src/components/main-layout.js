import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Footer } from './footer';
import { MainNavbar } from './main-navbar';
import { MainSidebar } from './main-sidebar';
import NotionApiClient from '../api-clients/notion.api-client';

const MainLayoutRoot = styled('div')(({ theme }) => ({
	// backgroundColor: theme.palette.background.default,
	backgroundColor: 'white',
	height: '100%',
	paddingTop: 64
}));

export const MainLayout = ({ children, pageProps }) => {
	const {data:pageData} = pageProps || {}

  	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [mainMenu, setMainMenu] = useState()
	
	useEffect(()=> {
		fetchMainMenu()
	},[])
	
	const fetchMainMenu = async() => {		
		const response = await NotionApiClient.getDatabase(pageData?.setting?.menu_database)
		const {data} = response || []

		const result = data.reduce(function (r, a) {
			r[a?.properties?.group?.select?.name] = r[a?.properties?.group?.select?.name] || [];
			r[a?.properties?.group?.select?.name].push(a);
			return r;
		}, Object.create(null));		
		setMainMenu(result)
	}

	return (
		<MainLayoutRoot>
			<MainNavbar 
				onOpenSidebar={() => setIsSidebarOpen(true)} 
				menuData={mainMenu}
				logoUrl = {pageData?.setting?.logo}
				menuIconUrl = {pageData?.setting?.menu_icon}
			/>
			{/* <MainSidebar
				onClose={() => setIsSidebarOpen(false)}
				open={isSidebarOpen}
				data={mainMenu}
			/> */}
			{children}
			<Footer pageID = {pageData?.setting?.footer_page_id}/>
		</MainLayoutRoot>
	);
};

MainLayout.propTypes = {
  children: PropTypes.node
};
