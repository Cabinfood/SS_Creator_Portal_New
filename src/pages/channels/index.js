import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import {Box,Card,CardContent,Container,Grid,Typography} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../lib/gtm";
import { AuthProvider } from "../../contexts/auth-context";
import cookieLib from "../../lib/cookie.lib";
import { ChannelsTable } from "../../components/dashboard/channels/channels.table";
import ChannelApiClient from "../../api-clients/channel.api-client";

const Channels = () => {
	const token = cookieLib.getCookie("token")
    const [pages, setPages] = useState([])
    const [listPagesIDConnected, setListPageIDConnected] = useState()
	const [totalFollowers, setTotalFollowers] = useState(0)

	useEffect(() => {
		gtm.push({ event: "page_view" });
		initialize()
	}, []);

	const handleConnectSuccess = (pageData) => {
        setPages([...pages, pageData])
		setTotalFollowers(totalFollowers + pageData?.followersCount)
    }

	const initialize = async() => {
        const getChannels = await ChannelApiClient.getAll(token)
		
        const temp = []
        const tempID = []
        const {data : listChannels} = getChannels
		var tempFollowers = 0
        for(var i=0; i<listChannels?.length; i++) {
            temp.push({
                notionID: listChannels[i]?.id,
                name: listChannels[i]?.properties?.name?.title?.[0]?.plain_text,
                avatarURL: listChannels[i]?.properties?.avatar?.files?.[0]?.external?.url,
				coverURL: listChannels[i]?.properties?.cover?.files?.[0]?.external?.url,
                id: listChannels[i]?.properties?.channel_id?.rich_text?.[0]?.plain_text,
                fansCount: listChannels[i]?.properties?.fans_count?.number,
                followersCount: listChannels[i]?.properties?.followers_count?.number,
                url: listChannels[i]?.properties?.url?.rich_text?.[0]?.plain_text,
                username: listChannels[i]?.properties?.username?.rich_text?.[0]?.plain_text,                        
                updatedAt: listChannels[i]?.properties?.last_updated_at?.last_edited_time,
            })
            tempID.push(listChannels[i]?.properties?.channel_id?.rich_text?.[0]?.plain_text)
			tempFollowers += listChannels[i]?.properties?.followers_count?.number
        }

        setPages(temp)
		// setPages(listChannels)
		
        setListPageIDConnected(tempID)
		setTotalFollowers(tempFollowers)
    }

	return (
		<>
			<Head>
				<title>Channels | sand.so</title>
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
						<Typography variant="h5">Channel,</Typography>
					</Box>		
					
					<Box mt={4}>
						<Grid container spacing={2}>
							<Grid item sm={4} xs={12}>
								<SummaryWidget value = {pages?.length} title="channels"/>								
							</Grid>
							<Grid item sm={4} xs={12}>
								<SummaryWidget value = {totalFollowers.toLocaleString("vi-VN")} title="followers"/>
							</Grid>
							

						</Grid>
					</Box>			

					<Box my={4}>
						<ChannelsTable 
							pages = {pages}
							listPagesIDConnected = {listPagesIDConnected}	
							handleConnectSuccess = {(data)=>{handleConnectSuccess(data)}}
						/>
					</Box>
				</Container>
			</Box>
		</>
	);
};

Channels.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default Channels;

const SummaryWidget = (props) => {
	const {title, value} = props
	return (
		<Card
			elevation={0}
			variant="outlined"
			sx={{
				cursor: 'pointer',										
				borderColor: 'primary.main',
				borderWidth: 2,
				m: '-1px'
			}}
		>
			<CardContent>
				<Box
					sx={{
						display: 'flex',
						mb: 1,
						mt: 1
					}}
				>
					<Typography variant="h5">
						{value}
					</Typography>
				</Box>
				<Box
					sx={{
						alignItems: 'center',
						display: 'flex',
						justifyContent: 'space-between'
					}}
				>
					<Typography variant="overline">{title}</Typography>											
				</Box>
			</CardContent>
		</Card>
	)	
}