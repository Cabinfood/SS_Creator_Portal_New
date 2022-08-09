import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import {Box,Container, Grid} from "@mui/material";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../../lib/gtm";
import { AuthProvider } from "../../../contexts/auth-context";
import ContentsNotionApiClient from "../../../api-clients/contents.api-client";
import cookieLib from "../../../lib/cookie.lib";
import NotionResourcesListing from "../../../components/resources-listing";
import { MAX_REQUEST_PAGE_SIZE } from "../../../constant";
import LoadMoreButton from "../../../components/buttons/loadmore.button";

const AccountDetail = ({accountNotionID}) => {
	const token = cookieLib.getCookie("token")				
	const router = useRouter()

	const [resources, setResources] = useState()
	const [listContent, setListContents] = useState()
	const [isWorking, setIsWorking] = useState(false)	
	const [startCursor, setStartCursor] = useState()
	const [hasMore, setHasMore] = useState(false)

	useEffect(() => {
		gtm.push({ event: "page_view" });
		initialize()
	}, []);

	const initialize = async() => {		
        const response = await ContentsNotionApiClient.getContentByAccountID(accountNotionID, undefined, MAX_REQUEST_PAGE_SIZE.DEFAULT, token)
		const {data} = response || []		
        console.log("initialize: ", data)	
		
		if (data) {
			setResources(data)
			
			const {results, has_more, next_cursor} = data || null
			setListContents(results)
			setStartCursor(next_cursor)
			setHasMore(has_more)
		}		
		else router.push("/404")		
	}	

	const loadMoreAction = async() => {
		if (isWorking) return;
        setIsWorking(true)
		
        const dataResponse = await ContentsNotionApiClient.getContentByAccountID(accountNotionID, startCursor ? startCursor : undefined, MAX_REQUEST_PAGE_SIZE.LOAD_MORE, token)
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
				<title>Dashboard: Collections | sand.so</title>
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
	const accountNotionID = context.params.id; 
	return {
		props: {
            accountNotionID
		}, // will be passed to the page component as props
	}
}


AccountDetail.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default AccountDetail;
