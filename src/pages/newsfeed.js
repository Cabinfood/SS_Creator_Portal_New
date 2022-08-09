import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import {Box,Container,Grid,Typography} from "@mui/material";
import { AuthGuard } from "../components/authentication/auth-guard";
import { DashboardLayout } from "../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../lib/gtm";
import { AuthProvider } from "../contexts/auth-context";
import ContentsNotionApiClient from "../api-clients/contents.api-client";
import cookieLib from "../lib/cookie.lib";
import NotionResourcesListing from "../components/resources-listing";
import { MAX_REQUEST_PAGE_SIZE } from "../constant";
import LoadMoreButton from "../components/buttons/loadmore.button";
import { SuggestBarFragment } from "../components/fragment/objects/suggest-bar.fragment";
import ContentSkeleton from "../components/skeleton/content.skeleton";

const NewsFeed = () => {
	const token = cookieLib.getCookie("token")
	const router = useRouter()

	const [resources, setResources] = useState()
	const [listContent, setListContents] = useState()
	const [isWorking, setIsWorking] = useState(false)	
	const [startCursor, setStartCursor] = useState()
	const [hasMore, setHasMore] = useState(false)
	const [collectionSelected, setCollectionSelected] = useState(null)

	useEffect(() => {
		gtm.push({ event: "page_view" });
		
	}, []);

	useEffect(()=>{
		initialize()
	},[collectionSelected])

	const initialize = async() => {				
		if (isWorking) return;
        setIsWorking(true)

		let response 		
		if (_.isNull(collectionSelected)) {
			response = await ContentsNotionApiClient.getAllResources(token, undefined, MAX_REQUEST_PAGE_SIZE.MAX)		
		} else {
			response = await ContentsNotionApiClient.getContentByCollectionID(collectionSelected,undefined, MAX_REQUEST_PAGE_SIZE.MAX, token)
		}
		
		
		const {data} = response || []		
		if (data) {
			console.log(data)
			setResources(data)
			
			const {results, has_more, next_cursor} = data || null
			setListContents(results)
			setStartCursor(next_cursor)
			setHasMore(has_more)
			setIsWorking(false)
		}		
		else alert("Có lỗi xảy ra, vui lòng thử lại")
	}

	const loadMoreAction = async() => {
		if (isWorking) return;
        setIsWorking(true)
		let dataResponse
		if (_.isNull(collectionSelected)) {
        	dataResponse = await ContentsNotionApiClient.getAllResources(token, startCursor ? startCursor : undefined, MAX_REQUEST_PAGE_SIZE.MAX)
		} else {
			dataResponse = await ContentsNotionApiClient.getContentByCollectionID(collectionSelected, startCursor ? startCursor : undefined, MAX_REQUEST_PAGE_SIZE.MAX, token)
		}

        const {data} = dataResponse || {}
		
        const {results, has_more, next_cursor} = data || []
		console.log("loadmore: ", results)
		setListContents([...listContent,...results])

        setStartCursor(next_cursor)
        setHasMore(has_more)
        setIsWorking(false)
	}

	const reset = () => {
		setListContents(null)
	}

	return (
		<>
			<Head>
				<title>Dashboard: Growth | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1
				}}
			>
				<SuggestBarFragment 
					isBusy = {isWorking}
					handleSelected = {(value)=>{
						console.log(value)
						reset()
						if (value === "all") setCollectionSelected(null)
						else setCollectionSelected(value)
					}}					
				/>
				<Container maxWidth="xl" sx={{paddingTop: 2}}>
					{/* <Box marginBottom={2}>
						<Typography variant="h5">Hôm nay có gì hay,</Typography>
						<Typography variant="h4">cùng khám phá ngay.</Typography>							
					</Box> */}
					<Grid container>
						<Grid item xs={12} md={8}>						
							{ listContent
								? listContent?.length > 0
									?
									<Box>
										<Box my={3}>
											<NotionResourcesListing 
												listItem={listContent || []} 								
											/>																
										</Box>					
										<Box>
											{hasMore && (
												<LoadMoreButton 
													handleLoadMore = {loadMoreAction}
													isWorking = {isWorking}
												/>
											)}							
										</Box>
									</Box>
									: 
									<Typography variant="h3" textAlign="left" paddingY={3}>Không có dữ liệu</Typography>
								:
								<ContentSkeleton times={3}/>
							}							
							
						</Grid>										

						<Grid item xs={12} md={4}>							
							
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	);
};

NewsFeed.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default NewsFeed;
