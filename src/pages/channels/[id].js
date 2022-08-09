import { useEffect, useState } from "react";
import { Container, Card,Divider, Typography, Link, CardContent, CardActions,Box, Grid, CardMedia, Avatar, CircularProgress} from '@mui/material';
import { AuthProvider } from "../../contexts/auth-context";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import Head from "next/head";
import { ExternalLink as ExternalLinkIcon } from "../../icons/external-link";
import cookieLib from "../../lib/cookie.lib";
import PageInsightCardComponent from "../../components/card/page.insight.card";
import ChannelApiClient from '../../api-clients/channel.api-client';
import { PostInsightComponent } from "../../components/analytics/posts-insight.component";
import CardPostList from "../../components/card/post-list.card";

const token = cookieLib.getCookie("token")

const ChannelInsight = (props) => {
    const {channelID: channelNotionID} = props
	
	const [isInReview, setIsInReview] = useState(true)
    const [insightData, setInsightData] = useState()

    const [isWorking, setIsWorking] = useState(false)
    const [pageEngageuser, setPageEngageUser] = useState()
    const [reach, setReach] = useState()
    const [view, setView] = useState()
    const [newFan, setNewFan] = useState()	
    const [pageID, setPageID] = useState()
    const [pageName, setPageName] = useState()
    const [userName, setUserName] = useState()
    const [avatarURL, setAvatarURL] = useState()
	const [coverURL, setCoverURL] = useState()

    useEffect(()=>{
		getInsightPage()
	},[])

	const getInsightPage = async() => {
        setIsWorking(true)
        const insightResponse = await ChannelApiClient.insightPage(token, channelNotionID)
        if (insightResponse?.success) {
            console.log("data: ", insightResponse)
            const {data} = insightResponse
            setInsightData(data)
            
            setPageName(data?.page_name)
            setUserName(data?.username)
            setAvatarURL(data?.avatar)
            setPageID(data?.page_id)
            setCoverURL(data?.cover)

            let engageUserData = data?.insight.find(o => o.name === "page_engaged_users")
            let reachData = data?.insight?.find(o => o.name === "page_impressions_unique")            
            let newFanData = data?.insight?.find(o => o.name === "page_fan_adds")

            let viewData = {
                totalVideoViews: data?.insight?.find(o => o.name === "page_video_views") || {},
                totalVideoViewsPaid: data?.insight?.find(o => o.name === "page_video_views_paid") || {},
                totalVideoViewsOrganic: data?.insight?.find(o => o.name === "page_video_views_organic") || {},
                uniqueView: data?.insight?.find(o => o.name === "page_video_views_unique") || {},
            }

            setPageEngageUser(engageUserData)
            setReach(reachData)
            setView(viewData)
            setNewFan(newFanData)

            console.log("view: ", viewData)
        }


        setIsWorking(false)        
    }
	

    return (
        <>
            <Head>
				<title>Channels Detail | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 2,
				}}
			>
				<Container maxWidth="md">						
					<Box mb={2}>						
						<CardMedia 
							component='img'
							image={coverURL}
							height="300px"
							sx={{
								borderRadius: 1
							}}
						/>

						<Box display="flex" alignItems="end" mx={3} mt="-28px">
							<Avatar src={avatarURL} sx={{ width: 80, height: 80 }}/>
							<Box ml={1}>                            
								<Typography variant='body' fontWeight='bold' component='p' lineHeight="14px" color="primary">
									{pageName}                            
									{isWorking && (
										<CircularProgress size={15} sx={{marginLeft: "2px"}}/>
									)}
									<Link href={`https://fb.com/${pageID}`} target="_blank">
										<ExternalLinkIcon sx={{
											marginLeft: "2px",
											fontSize: "15px"
										}}/>
									</Link>                            
								</Typography>
								
								<Typography variant='caption' mt={-1}>{pageID} | {userName}</Typography>
							</Box>
						</Box>     
					</Box>

					<Box>
						<StatictisSummary 
							followersCount = {insightData?.followers_count || 0}
							fansCount = {insightData?.fan_count || 0}
						/>
					</Box>

					<Grid container my={2}>
						<Grid item xs={12} md={8}>
							<CardPostList channelNotionID = {channelNotionID} />
						</Grid>

						<Grid item xs={12} md={4}>							
						</Grid>
					</Grid>
				</Container>
			</Box>
        </>
    )    
}

export async function getServerSideProps(context) {
	const channelID = context.params.id; 
	return {
		props: {
		  	channelID
		}, // will be passed to the page component as props
	}
}

ChannelInsight.getLayout = (page) => (    
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default ChannelInsight;


const StatictisSummary = (props) => {
    const {followersCount, fanCount} = props
    return (
		<Card>
			<Grid container>
				<Grid item
						xs={6}
						// xs={12}
						sx={{
							alignItems: 'center',
							borderRight: (theme) => ({
								xs: `1px solid ${theme.palette.divider}`
							}),
							borderBottom: (theme) => ({
								md: 'none',
								xs: `1px solid ${theme.palette.divider}`
							}),
							// display: 'flex',
							// justifyContent: 'space-between',
							p: 3
						}}
					>
						<div>
							<Typography
								color="textSecondary"
								variant="overline"
							>
								Followers
							</Typography>
							<Typography variant="h5">
								{followersCount?.toLocaleString("vi-VN") || 0}
							</Typography>                                        
						</div>
				</Grid>

				<Grid item
						xs={6}
						// xs={12}
						sx={{
							alignItems: 'center',
							borderRight: (theme) => ({
								md: `1px solid ${theme.palette.divider}`
							}),
							borderBottom: (theme) => ({
								md: 'none',
								xs: `1px solid ${theme.palette.divider}`
							}),
							// display: 'flex',
							// justifyContent: 'space-between',
							p: 3
						}}
					>
						<div>
							<Typography
								color="textSecondary"
								variant="overline"
							>
								Fans
							</Typography>
							<Typography variant="h5">
								{fanCount?.toLocaleString("vi-VN") || 0}
							</Typography>                                        
						</div>

				</Grid>
			</Grid>
		</Card>
    )
}