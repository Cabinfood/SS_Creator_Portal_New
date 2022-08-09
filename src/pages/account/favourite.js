import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import {Box, Container, Grid, Button} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../lib/gtm";
import { AuthProvider } from "../../contexts/auth-context";
import ContentsNotionApiClient from "../../api-clients/contents.api-client";
import cookieLib from "../../lib/cookie.lib";
import NotionResourcesListing from "../../components/resources-listing";
import { MAX_REQUEST_PAGE_SIZE } from "../../constant";
import LoadMoreButton from "../../components/buttons/loadmore.button";
import ContentSkeleton from "../../components/skeleton/content.skeleton";

const Favourite = () => {
	const token = cookieLib.getCookie("token")				
	const router = useRouter()

	const [listContent, setListContents] = useState()
	const [isWorking, setIsWorking] = useState(false)	
	const [startCursor, setStartCursor] = useState()
	const [hasMore, setHasMore] = useState(false)

	useEffect(() => {
		gtm.push({ event: "page_view" });
		initialize()
	}, []);

	const initialize = async() => {
		const response = await ContentsNotionApiClient.getMyFavourite(token, undefined, MAX_REQUEST_PAGE_SIZE.DEFAULT)
		const {data} = response || null
		
		if (data) {
			
			const {results, has_more, next_cursor} = data || null
			setListContents(results)
			setStartCursor(next_cursor)
			setHasMore(has_more)
		}		
	}

	const loadMoreAction = async() => {
		if (isWorking) return;
        setIsWorking(true)
		
        const dataResponse = await ContentsNotionApiClient.getMyFavourite(token, startCursor ? startCursor : undefined, MAX_REQUEST_PAGE_SIZE.LOAD_MORE)
        const {data} = dataResponse || {}
        const {results, has_more, next_cursor} = data || []
		setListContents([...listContent,...results])

        setStartCursor(next_cursor)
        setHasMore(has_more)
        setIsWorking(false)
	}

	return (
		<>
			<Head>
				<title>Favourite | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				
				<Container maxWidth="xl">	
					<Grid container>
						<Grid item xs={12} md={8}>
							{listContent
							?
							<Box>
								<Box my={3}>
									<NotionResourcesListing 
										listItem = {listContent || []} 							
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
							: <ContentSkeleton />

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

Favourite.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default Favourite;
