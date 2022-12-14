import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import {Box,Container, Grid, Typography} from "@mui/material";
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

const CollectionDetail = ({collectionID}) => {
	const token = cookieLib.getCookie("token")				
	const router = useRouter()

	const [resources, setResources] = useState()
	const [listContent, setListContents] = useState()
	const [isWorking, setIsWorking] = useState(false)	
	const [startCursor, setStartCursor] = useState()
	const [hasMore, setHasMore] = useState(false)
	const [collectionName, setCollectionName] = useState()

	useEffect(() => {
		gtm.push({ event: "page_view" });
		initialize()
	}, []);

	const initialize = async() => {		
        const response = await ContentsNotionApiClient.getContentByCollectionID(collectionID, undefined, 100, token)
		
		const {data} = response || []		
		
		if (data) {
			setResources(data)
			
			const {results, has_more, next_cursor} = data || null
			setListContents(results)
			setStartCursor(next_cursor)
			setHasMore(has_more)
			setCollectionName(data?.collectionName)

		}		
		else router.push("/404")		
	}	

	const loadMoreAction = async() => {
		if (isWorking) return;
        setIsWorking(true)
		
        const dataResponse = await ContentsNotionApiClient.getContentByCollectionID(collectionID, startCursor ? startCursor : undefined, MAX_REQUEST_PAGE_SIZE.LOAD_MORE, token)
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
				<title>Dashboard: Collections {collectionName}| sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth="xl">
					
					<Grid container my={2}>
						<Grid item xs={12} md={8}>
							<Typography variant="h3"> {collectionName}</Typography>
							<Typography variant="body2" color="textSecondary">Danh s??ch c??c n???i dung thu???c danh m???c s??? ???????c s???p x???p theo n???i dung c?? l???n c???p nh???t g???n nh???t, d???a v??o b??? ch??? s??? t????ng t??c tr??n m???i n???i dung b???n s??? d??? d??ng ch???n ra ???????c n???i dung ti???m n??ng</Typography>
						</Grid>
					</Grid>
					
					<Grid container my={2}>
						<Grid item xs={12} md={8}>
							{listContent
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

export async function getServerSideProps(context) {
	const collectionID = context.params.id; 
	return {
		props: {
            collectionID
		}, // will be passed to the page component as props
	}
}


CollectionDetail.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default CollectionDetail;
