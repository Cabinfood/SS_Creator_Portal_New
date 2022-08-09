import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import {Box,CardContent,CardHeader,Container,Divider,Grid,MenuItem,TextField,Typography, Card, Avatar, IconButton,MoreVertIcon, Link, Button, CircularProgress, CardActions, List, ListItem} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../lib/gtm";
import { AuthProvider } from "../../contexts/auth-context";
import ContentsNotionApiClient from "../../api-clients/contents.api-client";
import cookieLib from "../../lib/cookie.lib";
import CardMediaLazy from "../../components/card-media-lazy";
import { FacebookProvider, Comments } from 'react-facebook';
import { Users as UsersIcon } from '../../icons/users';
import { Clock as ClockIcon } from '../../icons/clock';

import RepostButton from "../../components/buttons/repost.button";
import LoveButton from "../../components/buttons/love.button";
import DownloadButton from "../../components/buttons/download.button";
import ReviewButton from "../../components/buttons/review.button";
import { FB_APP_ID } from "../../constant";
import { getInitials } from "../../utils/get-initials";
import { PostInsightComponent } from "../../components/analytics/posts-insight.component";
import { SummaryWidget } from "../../components/widgets/card/summary.widget";
import { round } from "lodash";
import { ChannelSummary } from "../../components/analytics/channel-summary";
import { keys } from "lodash";
import { Trash as TrashIcon } from '../../icons/trash';
import ClaimButton from "../../components/buttons/claim.button";
import PlayerContainer from "../../components/jwplayer-custom";
import EditContentButton from "../../components/buttons/edit-content.button";

const ContentDetail = ({contentID}) => {
	const token = cookieLib.getCookie("token")				
	const router = useRouter()

	const [data, setData] = useState()
	const [isWorking, setIsWorking] = useState(false)	
	const [currentURL, setCurrentURL] = useState()
	const [revenue, setRevenue] = useState(0)
	const [adImpression, setAdImpression] = useState(0)
	const [impression, setImpression] = useState(0)
	const [view, setView] = useState(0)
	const [posts, setPosts] = useState()
	const [objectGroupByChannel, setObjectGroupByChannel] = useState()
	const [isExpired, setIsExpired] = useState(false)

	useEffect(() => {
		gtm.push({ event: "page_view" });
		initialize()
		setCurrentURL(window.location.href)
		
	}, []);
	

	const initialize = async() => {		
		const response  = await ContentsNotionApiClient.getContentByID(contentID, token)
		const {data} = response || []
        console.log("content detail: ", data)

		if (data) {
			setData(data)	
			setIsExpired(data?.properties?.is_expired?.checkbox)
		}
		else router.push("/404")

		setPosts(data?.properties?.posts)		
		groupObjectByChannel(data?.properties?.posts)
	}

	const groupObjectByChannel = (data) => {
		let results = {}
		data && data.forEach(post => {
			const channelName = post?.properties?.channel_name?.rollup?.array?.[0]?.title?.[0]?.plain_text
			if (!results[channelName]) {
				results[channelName] = [];
			}
			results[channelName].push(post)
		});
		console.log("group object by channel: ", results)

		setObjectGroupByChannel(keys(results).map(name => ({
			name,
			objects: results[name]
		})))		
	}


	return (
		<>
			<Head>
				<title>Content Insight | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth="xl">	
					<Box my={2}>
						<Typography variant="h6">{data?.properties?.title?.title?.[0]?.plain_text}</Typography>
						<Box display='flex' alignItems='center'>
							<Box display='flex' alignItems='center'>
								<UsersIcon sx={{fontSize: "13px", mr: 0.5}}/>
								<Typography variant="caption">{data?.properties?.editor_name?.rollup?.array?.[0]?.title?.[0]?.plain_text}</Typography>
							</Box>
							<Box display='flex' alignItems='center' ml={2}>
								<ClockIcon sx={{fontSize: "13px", mr: 0.5}}/>
								<Typography variant="caption">{data ? new Date(data?.properties?.created_at?.created_time).toLocaleString('vi-VN') : null}</Typography>
							</Box>
						</Box>
						
					</Box>
					<Grid container spacing={2} mb={3}>
						<Grid item xs={12} md={4} sm={6}>
							<SummaryWidget
								title = "Posts"
								value = {posts?.length.toLocaleString("vi-Vn") || 0}
								description = "total posts using this contents"								
								chartType = "line-chart"
								isWorking = {isWorking}
							/>
						</Grid>
						<Grid item xs={12} md={4} sm={6}>
							<SummaryWidget
								title = "Impression"
								value = {impression.toLocaleString("vi-Vn")}
								description = "total impression of posts"
								chartType = "line-chart"
								isWorking = {isWorking}
							/>
						</Grid>
						<Grid item xs={12} md={4} sm={6}>
							<SummaryWidget
								title = "View"
								value = {view.toLocaleString("vi-VN") || 0}
								description = "total views of posts"								
								chartType = "line-chart"
								isWorking = {isWorking}
							/>
						</Grid>						
						<Grid item xs={12} md={6} sm={6}>
							<SummaryWidget
								title = "Ad Imression"
								value = {`${adImpression.toLocaleString("vi-VN")}`}
								description = "total ad impression of posts"								
								chartType = "line-chart"
								isWorking = {isWorking}
							/>
						</Grid>												
						<Grid item xs={12} md={6} sm={6}>
							<SummaryWidget
								title = "Revenue"
								value = {`${revenue.toLocaleString("vi-VN")} $`}
								description = "total revenue of posts"								
								chartType = "line-chart"
								isWorking = {isWorking}
							/>
						</Grid>												
					</Grid>

					<Grid container spacing={2}>
						<Grid item xs={12} md={4}>
							<Box spacing={2} justifyContent="space-between">
								<Card sx={{
									border: isExpired === true ? "1px solid red" : null
								}}>
									{/* <CardMediaLazy 
										idContent = {data?.id}
										source = {data?.properties?.attachments?.files?.[0]?.external?.url}
										fileName = {data?.properties?.attachments?.files?.[0]?.name}
										title = {data?.properties?.title?.title?.[0]?.plain_text}							
									/>				 */}
									{data && 
										<CardMediaLazy 
											mode = {1}
											source = {data?.properties?.attachments?.files?.[0]?.external?.url}
											autostart={true}
											// mute = {true}
											volume = {100}
										/>
										// <PlayerContainer
										// 	source = {data?.properties?.attachments?.files?.[0]?.external?.url}
										// 	autostart={true}
										// />
									}
									

									<Box marginTop={1} p={2}>
										<div className='contents-collection' style={{overflowWrap: "break-word"}}>
											{data && data?.properties?.collections && data?.properties?.collections?.relation?.map((item, index)=>(
												<Button
													key={index}
													size='small'
													variant='none'
													sx={{
														padding: "0px",
														marginRight: "3px"
													}}                            
												>
													<Link 
														href={`/collections/${item?.id}`}
														sx={{
															padding: "1px 0px",
															margin: "1px 2px",
															color: "grey",                                    
														}}
													>
														<small>
															#{data?.properties?.collection_name?.rollup?.array?.[index]?.title?.[0]?.plain_text}
															{/* #{data?.properties?.collection_name?.[index]?.title?.[0]?.plain_text} */}
														</small>
													</Link>
												</Button>
											))}                
										</div>

										{
											data?.properties?.reference_title?.rollup?.array?.[0]?.title?.[0]?.plain_text
											?
												<div className='reference-ip'>
													<Typography variant='caption' color="success">
														IP:     
														<Typography variant='caption' fontWeight={600} ml={0.5}>{data?.properties?.reference_title?.rollup?.array?.[0]?.title?.[0]?.plain_text}</Typography>
													</Typography>
												</div>
											: null
										}
									</Box>

									<Divider />																						
									<CardActions sx={{
										padding: "16px 16px !important",
										display: "grid",
										justifyItems: "center"							
									}}>
									{isExpired === false
									?
										<Box display="flex" gap={1} flexWrap="wrap">
											<RepostButton 
												title = {data?.properties?.title?.title?.[0]?.plain_text}
												attachments = {data?.properties?.attachments?.files || []}
												reposts = {posts || []}
												repostURLs = {data?.properties?.re_posts_url?.rollup?.array?.[0]?.rich_text|| []}		
												reviewCode = {data?.properties?.review_code?.number || 0}
												contentID = {data?.id}
											/>

											<LoveButton 
												contentID = {data?.id}
												lovedCount = {data?.properties?.loved_by?.relation?.length || 0}
												isLoved = {data?.properties?.is_loved || false}
											/>
										
											<DownloadButton 
												urlDownload = {data?.properties?.attachments?.files?.[0]?.file?.url || data?.properties?.attachments?.files?.[0]?.external?.url}
												title = {data?.properties?.title?.title?.[0]?.plain_text}
											/>		

											<ReviewButton 
												contentID = {data?.id}
												reviewStatus = {data?.properties?.review_code?.number || 0}													
											/>																	
											
											<ClaimButton 
												contentID = {data?.id}
												// reviewStatus = {data?.properties?.review_code?.number || 0}
												handleSuccess = {()=>{setIsExpired(true)}}
											/>						

											<EditContentButton 
												contentData = {data}
											/>																
										</Box>		
									:
										<Box mt={1}>
											{/* <Button disabled variant='outlined' color="success"> NGƯNG SỬ DỤNG NỘI DUNG NÀY</Button>                                 */}
											<Button
												sx={{
													backgroundColor: 'error.main',
													mr: 3,
													'&:hover': {
														backgroundColor: 'error.dark'
													}
												}}
												size="small"
												startIcon={<TrashIcon fontSize="small" />}
												variant="contained"
												>
												Nội Dung Đã Được Ngừng Sử Dụng
											</Button>
										</Box>
									}
									</CardActions>		

									{/* {data?.properties?.review_code?.number === 0 || data?.properties?.review_code?.number === null && (
										<Box>
											<Divider/>											
											
											<CardActions 
												sx={{ 
													padding: "16px 16px !important",
													display: "grid",
													justifyItems: "center"
												}}
											>			
												<ReviewButton 
													contentID = {data?.id}
													reviewStatus = {data?.properties?.review_code?.number || 0}													
												/>							
											</CardActions>							
										</Box>
									)}											 */}
								</Card>								
							</Box>								
						</Grid>
						<Grid item xs={12} md={8}>
							{/* {data?.properties?.review_code?.number === 1 && (																					 */}
								<Box>
									{objectGroupByChannel && objectGroupByChannel.map((channel, index)=>(
										<ChannelSummary 
											key={index}
											data={channel}
											onUpdateRevenue = {(data)=>{
												if(data === 0 || _.isNull(data) || _.isUndefined(data)) return;
												setRevenue(prev => prev+data)
											}}
											onUpdateImpression = {(data)=>{
												if(data === 0 || _.isNull(data) || _.isUndefined(data)) return;
												setImpression(prev => prev+data)
											}}
											onUpdateAdImpression = {(data)=>{
												if(data === 0 || _.isNull(data) || _.isUndefined(data)) return;
												setAdImpression(prev => prev+data)
											}}
											onUpdateView = {(data)=>{
												if(data === 0 || _.isNull(data) || _.isUndefined(data)) return;
												setView(prev => prev+data)
											}}
										/>
									))}											
								</Box>
							{/* )} */}
						</Grid>
					</Grid>															
				</Container>				
			</Box>
		</>
	);
};

export async function getServerSideProps(context) {
	const contentID = context.params.id; 
	return {
		props: {
		  	contentID
		}, // will be passed to the page component as props
	}
}


ContentDetail.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default ContentDetail;
