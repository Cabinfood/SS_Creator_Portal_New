import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import _,{ round } from 'lodash';
import Head from "next/head";
import {Box,Container,Typography, Grid, MenuItem, Button, CircularProgress, Modal, IconButton, Card, CardContent, CardHeader, Divider, List, ListItem, ListItemText, ListItemIcon, ListItemButton, ListItemAvatar, Avatar} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../lib/gtm";
import { AuthProvider } from "../../contexts/auth-context";
import cookieLib from "../../lib/cookie.lib";
import { Reports as ReportsIcon } from '../../icons/reports';
import { AnalyticsOverview } from "../../components/analytics/overview.analytics";
import AnatlyticsApiClient from "../../api-clients/analytics.api-client";
import { CONTENT_REVIEW_STATUS, MEMBER_TIER, PERIOD, TIMEZONE_ZERO } from "../../constant";
import { PostsListTable } from "../../components/analytics/posts.table";
import { keys } from "lodash";
import { PosterTable } from "../../components/analytics/poster.table";
import { CreatorTable } from "../../components/analytics/creator.table";
import { useAuth } from "../../hooks/use-auth";
import { X as XIcon } from '../../icons/x';
import DatePickerButton from "../../components/buttons/datepicker.button";
import { ChannelSummary } from "../../components/analytics/channel-summary";
import * as momentTz from 'moment-timezone'
import SummaryWidgetFragment from "../../components/fragment/summary-widget.fragment";
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { borderRadius, width } from "@mui/system";

const Analytics = () => {
	const token = cookieLib.getCookie("token")
	const {user} = useAuth()
	const router = useRouter()
	const [ period, setPeriod] = useState(PERIOD.TODAY)
	const [selectedDate, setSelectedDate] = useState(new Date());

	const [contents, setContents] = useState()
    const [posts, setPosts] = useState()
	const [postsGroupByPoster, setPostsGroupByPoster] = useState()
	const [contentsGroupByCreator, setContentsGroupByCreator] = useState()
	const [objectGroupByChannel, setObjectGroupByChannel] = useState()
	const [isWorking, setIsWorking] = useState(false)
	const [revenue, setRevenue] = useState(0)
	const [impression, setImpression] = useState(0)
	const [adImpression, setAdImpression] = useState(0)
	const [isShowContentModal, setIsShowContentModal] = useState(false)
	const [isShowPostModal, setIsShowPostModal] = useState(false)


	useEffect(() => {
		gtm.push({ 
			event: "page_view",
			value: "analytics"
		});
	}, []);

	const reset = () => {
		setRevenue(0)
		setImpression(0)
		setContents([])		
		setPosts([])
		setAdImpression(0)
		setObjectGroupByChannel()
		setPostsGroupByPoster()
		setContentsGroupByCreator()
	}
	
	useEffect(()=>{
		if (!selectedDate) return;
		if (user.tier === MEMBER_TIER.MASTER_ADMIN || user.tier === MEMBER_TIER.GROWTH_LEADER || user.tier === MEMBER_TIER.SOCIAL_PERFORMANCE_SPECIALIST) loadDataSummary(selectedDate)
	},[selectedDate])

	const loadDataSummary =  useCallback(async(date)=>{
		if (isWorking) return;
		setIsWorking(true)
		reset()
		const res = await AnatlyticsApiClient.getSummary(token, date)		
		
        if (res?.success) {
            const {data} = res
            const {contents, posts} = data
			
			groupPostsByPoster(posts)
			groupContentsByCreator(contents)
			groupObjectByChannel(posts)

            setContents(contents)
			setPosts(posts)			
        }
		setIsWorking(false)
	},[])

	const groupPostsByPoster = (data) => {
		let results = {}
		data.forEach(post => {
			const name = post?.properties?.posted_by_name?.rollup?.array?.[0]?.title?.[0]?.plain_text			
			const publishedStatus = post?.properties?.published_status?.formula?.string
			if (!results[name]) {
				results[name] = {
					"PUBLISHED": [],
					"SCHEDULE": []
				};
			}
			results[name][publishedStatus].push(post)
		});
		console.log("group: ", results)

		setPostsGroupByPoster(keys(results).map(name => ({
			name,
			data: results[name],
			count: results[name]["PUBLISHED"]?.length + results[name]["SCHEDULE"]?.length
		})))		
	}

	const groupContentsByCreator = (data) => {
		let results = {}
		data.forEach(content => {
			const name = content?.properties?.editor_name?.rollup?.array?.[0]?.title?.[0]?.plain_text
			const reviewStatus = content?.properties?.review_status?.formula?.string
			console.log("review Status: ", reviewStatus)

			if (!results[name]) {
				results[name] = {
					"APPROVED":[],
					"NOT_REVIEW": [],
					"REJECTED": [],
				};
			}
			
			results[name][reviewStatus].push(content)
		});
		
		console.log("group creator: ", results)

		setContentsGroupByCreator(keys(results).map(name => ({
			name,
			data: results[name],
			count: results[name]["APPROVED"]?.length + results[name]["NOT_REVIEW"]?.length + results[name]["REJECTED"]?.length
		})))		
	}


	const groupObjectByChannel = (data) => {
		console.log(data)
		let results = {}

		data.forEach(post => {
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

	const updatePostInsight = async() => {	 
        

        // $(`#btn-refresh-${object?.id}`).hide()
		// const insightData = await PostApiClient.getObjectInsight(token, object?.id)
        
		// const {data, success} = insightData || null
        
        // if (!success) {
        //     alert("Có lỗi xảy ra")
        //     return;
        // } 		

        // if (data?.error === true) {     
        //     setIsError(data?.error)       
        //     setMessageNoti(data?.msg)
        //     setIsWorking(false)
        //     return;
        // }

        // if (data?.error === false) {
            
        //     const {data: objectInsightData} = data || null
        //     setImpression(objectInsightData?.impression)
        //     setReach(objectInsightData?.reach)
        //     setView(objectInsightData?.view)
        //     setShare(objectInsightData?.share)
        //     setComment(objectInsightData?.comment)				
        //     setReaction(objectInsightData?.reaction)				
        //     setEarning(objectInsightData?.earning)
        //     setCPM(objectInsightData?.cpm)
        //     setAdImpression(objectInsightData?.ad_impression)
        //     setLastEditedTime(new Date())
        //     setPostCreatedTime(objectInsightData?.createdTime)
        //     setIsWorking(false)
        //     setIsPublished(objectInsightData?.isPublished)

        //     let estRev = objectInsightData?.cpm !== 0
        //                     ? (objectInsightData?.cpm * objectInsightData?.ad_impression)/1000  
        //                     : 0
        //     let CVREarnOnEst = objectInsightData?.earning !== 0 ? _.round(objectInsightData?.earning/estRev, 2) * 100 : 0
        //     setCVREarnOnEstimate(CVREarnOnEst)
        //     return;
        // }		
	}


	return (
		<>
			<Head>
				<title>Analytics | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth="xl">						
					<Box sx={{ mb: 4 }}>
						<Grid container justifyContent="space-between" spacing={3}>
							<Grid item>
								<Typography variant="h4">Analytics</Typography>
							</Grid>

							<Grid item
								sx={{
									alignItems: 'center',
									display: 'flex',
									m: -1
								}}
							>
								<Button
									startIcon={<ReportsIcon fontSize="small" />}
									sx={{ m: 1 }}
									variant="outlined"
								>
									Reports
								</Button>

								<DatePickerButton
									handleSelected = {(date)=>{setSelectedDate(date)}}
									isBusy = {isWorking}
								/>								
							</Grid>
						</Grid>
					</Box>
					{/* {isShowContentModal && (
										<ModalContent
											isShowModal = {isShowContentModal}
											handleClosed = {()=>{
												console.log("asdfasfsad")
												setIsShowContentModal(false)
											}}
											data = {contentsGroupByCreator}
										/>
									)} */}
					<Box my={4}>
						<Grid container spacing={2}>
							<Grid item sm={4} xs={12}>
								<SummaryWidgetFragment
									title = "Content"
									value = {contents?.length}
									isWorking = {isWorking}
									onClick = {()=>{setIsShowContentModal(true)}}
								/>										
							</Grid>
							<Grid item sm={4} xs={12}>
								<SummaryWidgetFragment
									title = "Post"
									value = {posts?.length}
									isWorking = {isWorking}
									onClick = {()=>{setIsShowPostModal(true)}}
								/>									

							</Grid>
							<Grid item sm={4} xs={12}>
								<SummaryWidgetFragment
									title = "Impression"
									value = {impression.toLocaleString("vi-VN")}
									isWorking = {isWorking}
								/>
							</Grid>							

							<Grid item sm={4} xs={12}>
								<SummaryWidgetFragment
									title = "Ad Impression"
									value = {adImpression.toLocaleString("vi-VN")}
									isWorking = {isWorking}
								/>
							</Grid>							
							<Grid item sm={4} xs={12}>
								<SummaryWidgetFragment
									title = "Revenue"
									value = {revenue.toLocaleString("vi-VN")}
									isWorking = {isWorking}
								/>
							</Grid>							
							<Grid item sm={4} xs={12}>
								<SummaryWidgetFragment
									title = "CPM"
									value = {_.isNaN(round(revenue/adImpression*1000,2)) ? 0 : round(revenue/adImpression*1000,2)}
									isWorking = {isWorking}
								/>
							</Grid>
						</Grid>						
					</Box>

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
							/>
						))}											
					</Box>
					
				</Container>
			</Box>
			{isShowContentModal && (
				<ModalContent
					title = "Danh sách nội dung"
					isShowModal = {isShowContentModal}
					handleClosed = {()=>{
						setIsShowContentModal(false)
					}}
					data = {contentsGroupByCreator}
				/>
			)}	
			{isShowPostModal && (
				<ModalContent
					title = "Danh sách bài đăng"
					isShowModal = {isShowPostModal}
					handleClosed = {()=>{
						setIsShowPostModal(false)
					}}
					data = {postsGroupByPoster}
				/>
			)}	
		</>
	);
};

Analytics.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default Analytics;


const style  = {
    width: "100%",
    maxWidth: 500,
    overflowY:'scroll',
    height:'100%',
    display:'block',
    right: 0,
    top: 0,
    left: "auto",
};

const ModalContent = (props) => {
	const {title, isShowModal, handleClosed, data} = props
	console.log("data: ", data)
	return (
		<Modal 
			open={isShowModal}
			onClose={()=>{
				console.log("closed")
				handleClosed()
			}}
			sx={style}
		>
			<Box 
				sx={{
					backgroundColor: 'background.default',
					height: '100vh',					
				}}
			>																							
				<Card sx={{
					maxHeight: "100vh",
					overflow: "scroll"
				}}>
					<CardHeader 
						title={title}
						action={
							<Button 
								variant="outlined" 
								size="small" 
								onClick={()=>{
									handleClosed()
								}}
							>
								Close
							</Button>															
						}
						sx={{
							'& :hover' : {
								cursor: "pointer",
							}
						}}
					/>
					<Divider/>
					<List>
						{data && data.map((item, index)=>(
							<div key={index}>
								<ListItem disablePadding>							
									<ListItemButton>
										<ListItemAvatar>
											<Avatar>
												<BeachAccessIcon />
											</Avatar>
										</ListItemAvatar>								
										<ListItemText primary={item?.name} secondary={
											<React.Fragment>
												<Typography  sx={{ 
													display: 'inline',
													color: "textPrimary"
												}}
													component="p"
													variant="body2"
													fontWeight="bold"
												>
													{`${item?.count}`} nội dung
												</Typography>
												<br/>
												<Typography sx={{
													backgroundColor: "gray",
													borderRadius: "5px",
													color: "white",
													borderRadius: "5px",
													padding: "2px 2px",
													width: "100%"
												}}
													component= "span"
												>
													{keys(item?.data).map((val, index) =>(
														<Typography key={index} variant="caption" component="span" paddingRight={3}>
															{val} - {item?.data[val]?.length}
														</Typography>
													))}
												</Typography>
											</React.Fragment>
											
										}/>
										
									</ListItemButton>											
								</ListItem>
							</div>
						))}							
					</List>
				</Card>
				
			</Box>
		</Modal>
	)
}