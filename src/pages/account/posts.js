import { useEffect, useState } from "react";
import Head from "next/head";
import {Box, Container,Grid,Typography} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../lib/gtm";
import { AuthProvider } from "../../contexts/auth-context";
import ContentsNotionApiClient from "../../api-clients/contents.api-client";
import cookieLib from "../../lib/cookie.lib";
import NotionResourcesListing from "../../components/resources-listing";
import { MAX_REQUEST_PAGE_SIZE } from "../../constant";

const MyPost = () => {
	const [resources, setResources] = useState()
	const [contents, setContents] = useState([])
    const [isMore, setIsMore] = useState(false)
    const [startCursor, setStartCursor]= useState()

	useEffect(() => {
		gtm.push({ event: "page_view" });
	}, []);

	

	return (
		<>
			<Head>
				<title>My Post | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth="xl">	
					<Grid container spacing={2} justifyContent="space-between">
						<Grid item>
							<Typography>aasfads</Typography>
						</Grid>
						
					</Grid>									
				</Container>
			</Box>
		</>
	);
};

MyPost.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default MyPost;
