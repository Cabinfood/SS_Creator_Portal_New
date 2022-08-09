import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import {Box, Container, Grid, Link, Button} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../lib/gtm";
import { AuthProvider } from "../../contexts/auth-context";
import ContentsNotionApiClient from "../../api-clients/contents.api-client";
import cookieLib from "../../lib/cookie.lib";
import NotionContentReviewLayout from "../../components/content/content-review-layout";
import { MAX_REQUEST_PAGE_SIZE, MEMBER_TIER } from "../../constant";
import LoadMoreButton from "../../components/buttons/loadmore.button";
import CreateNewContentButton from "../../components/buttons/create-new-content.button";
import { useAuth } from "../../hooks/use-auth";
import ContentSkeleton from "../../components/skeleton/content.skeleton";

const Review = () => {
	const token = cookieLib.getCookie("token")				
	const router = useRouter()
	const {user} = useAuth()

	const [resources, setResources] = useState()
	const [listContent, setListContents] = useState()
	const [isWorking, setIsWorking] = useState(false)	
	const [startCursor, setStartCursor] = useState()
	const [hasMore, setHasMore] = useState(false)

	useEffect(() => {
		gtm.push({ event: "page_view" });
		if (user?.tier === MEMBER_TIER.MASTER_ADMIN || user.tier === MEMBER_TIER.GROWTH_LEADER) initialize()
	}, []);

	const initialize = async() => {
		const response = await ContentsNotionApiClient.getWaitForApproved(token, undefined, MAX_REQUEST_PAGE_SIZE.DEFAULT)
		const {data} = response || null
        console.log(data)
		
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
		
        const dataResponse = await ContentsNotionApiClient.getWaitForApproved(token, startCursor ? startCursor : undefined, MAX_REQUEST_PAGE_SIZE.LOAD_MORE)
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
				<title>Review | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				
				<Container maxWidth="xl">					
					<Box>
						{/* <Link href="/account/contents/new">
							<Button variant="contained">Thêm</Button>
						</Link> */}
						<CreateNewContentButton />
					</Box>
						

					<Grid container>
						<Grid item xs={12} md={8}>
							{listContent
							?
								<Box>
									<Box my={3}>
										<NotionContentReviewLayout 
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
							: 	<ContentSkeleton times={3}/>
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

Review.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default Review;
