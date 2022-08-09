import { Card, Tooltip, CardHeader,CardContent } from '@mui/material';
import { InformationCircleOutlined as InformationCircleOutlinedIcon } from '../../icons/information-circle-outlined';
import { PostInsightComponent } from './posts-insight.component';

export const PostsListTable = (props) =>{
    const {title, tooltipMsg, tableHeader, data, onUpdateRevenue, onUpdateImpression, onUpdateAdImpression, ...others} = props		

    return (
        <Card>
			<CardHeader 
				title= {title}
				action={(
					<Tooltip title={tooltipMsg}>
						<InformationCircleOutlinedIcon sx={{ color: 'action.active' }} />
					</Tooltip>
				)}
			/>
			
			{data && data?.map((post, index) => (
				<CardContent 
					key={index} 
					sx={{
						borderBottom: "1px solid #ddd",
						py: 2,
						'&:last-child td': {
							border: 0
						}
					}}
				>
					<PostInsightComponent 
						post = {post} 						
						handleUpdateRevenue = {(data)=>{
							if (_.isUndefined(data) || _.isNull(data)) return;
							onUpdateRevenue(data)
						}}
						hanldeUpdateImpression = {(data)=>{
							if (_.isUndefined(data) || _.isNull(data)) return;
							onUpdateImpression(data)							
						}}
						hanldeUpdateAdImpression = {(data)=>{
							if (_.isUndefined(data) || _.isNull(data)) return;
							onUpdateAdImpression(data)
						}}
					/>
					
				</CardContent>
			))}
			
		</Card>
    )
}

// const PostInsightComponent = (props) => {	
	
// 	const token = cookieLib.getCookie("token")
// 	const {post, handleUpdateRevenue, hanldeUpdateImpression} = props	
// 	const [impression, setImpression] = useState(0)
// 	const [reach, setReach] = useState(0)
// 	const [comment, setComment] = useState(0)
// 	const [share, setShare] = useState(0)
// 	const [view, setView] = useState(0)
// 	const [reaction, setReaction] = useState(0)
// 	const [earning, setEarning] = useState(0)
// 	const [cpm, setCPM] = useState(0)

// 	useEffect(()=>{
// 		getObjectInsight()
// 	},[])

// 	const getObjectInsight = async() => {	
// 		const typeObject = post?.properties?.type_object?.select ? post?.properties?.type_object?.select?.name : null
// 		const pageID = post?.properties?.channel_id?.rollup?.array?.[0] ? post?.properties?.channel_id?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text : null
// 		const channelNotionID = post?.properties?.of_channel?.relation?.[0] ? post?.properties?.of_channel?.relation?.[0]?.id : null
		
		
// 		if (typeObject) {
// 			const objectID = post?.properties?.object_id?.rich_text?.[0]?.plain_text
// 			const insightData = await ChannelApiClient.getObjectInsight(token, typeObject, objectID, pageID, channelNotionID)
// 			const {data} = insightData
// 			console.log(data)
			
// 			if (data?.error) return;

// 			if (typeObject === TYPE_OBJECT.POST) {
// 				setImpression(data?.data?.impression_quantity)
// 				setShare(data?.data?.share_quantity)
// 				setComment(data?.data?.comment_quantity)
// 				setReach(data?.data?.unique_impression_quantity)
// 				setReaction(data?.data?.reaction_quantity)
// 				setView(data?.data?.post_video_views)
// 				setEarning(data?.data?.post_video_ad_break_earnings)
// 				setCPM(data?.data?.post_video_ad_break_ad_cpm)
// 				if (handleUpdateRevenue) handleUpdateRevenue(data?.data?.post_video_ad_break_earnings)
// 				if (hanldeUpdateImpression) hanldeUpdateImpression(data?.data?.impression_quantity)
// 			}

// 			if (typeObject === TYPE_OBJECT.VIDEO) {
// 				setImpression(data?.data?.total_video_impressions)
// 				setReach(data?.data?.total_video_impressions_unique)
// 				setView(data?.data?.total_video_views)
// 				setShare(data?.data?.share_quantity)
// 				setComment(data?.data?.comment_quantity)				
// 				setReaction(data?.data?.reaction_quantity)				
// 				setEarning(data?.data?.total_video_ad_break_earnings)
// 				setCPM(data?.data?.total_video_ad_break_ad_cpm)
// 				if (handleUpdateRevenue) handleUpdateRevenue(data?.data?.total_video_ad_break_earnings)
// 				if (hanldeUpdateImpression) hanldeUpdateImpression(data?.data?.total_video_impressions)
// 			}
			
// 		}
		
// 	}

// 	return (
// 		<Box key={post?.id} 			
// 			sx={{
// 				fontSize: "10px",
// 				'&:last-child td': {
// 					border: 0
// 				}
// 			}}
// 		>
// 				<Box display='flex' alignItems='center'>
// 					<Avatar sx={{
// 						width: "15px", height: "15px", 
// 						bgcolor: earning >0 ? "green" : "red", 
// 						marginRight: "2px"
// 					}}>$</Avatar>
// 					<Typography variant='caption' fontWeight='bold' mr={2}>						
// 						{round(earning/100 || 0, 2)?.toLocaleString("vi-VN")}
// 					</Typography>
// 					{earning > 0 && (
// 						<>
// 						| 
// 						<Typography variant='caption' mx={2}>
// 							CPM: <b>{round(cpm/100,2)?.toLocaleString("vi-VN")}$</b>
// 						</Typography>
// 						</>
// 					)}					
// 					| 
// 					<Typography variant='caption' mx={2}>
// 						<b>{view?.toLocaleString("vi-VN")} </b>views
// 					</Typography>										
// 				</Box>

// 				<Box display='flex' alignItems='center'>
// 					<Typography variant='body2' component='span'>
// 						{post?.properties?.posted_by_name?.rollup?.array?.[0]?.title?.[0]?.plain_text}													
// 					</Typography>
// 					<ArrowRightAltIcon color='primary'/>
// 					<Typography variant='body2' component='span'>													
// 						{post?.properties?.channel_name?.rollup?.array?.[0]?.title?.[0]?.plain_text}
// 					</Typography>
// 					<ArrowRightAltIcon color='primary'/>
// 					<Link href={post?.properties?.url?.rich_text?.[0]?.plain_text} target="_blank">
// 						{post?.properties?.object_id?.rich_text?.[0]?.plain_text}
// 						<ExternalLinkIcon sx={{
// 							marginLeft: "2px",
// 							fontSize: "15px"
// 						}}/>
// 					</Link>
// 				</Box>			

// 				<Box display='flex' alignItems='center'>
// 					<BriefcaseIcon sx={{fontSize: "13px", mr: 0.5}}/>
// 					<Link href={`/contents/${post?.properties?.of_resource?.relation?.[0]?.id}`} target="_blank">
// 						<Typography variant='caption' component='p'>
// 							{post?.properties?.resources_title?.rollup?.array?.[0]?.title?.[0]?.plain_text}
// 						</Typography>
// 					</Link>
// 				</Box>
// 				<Box my={2}>
// 					<Box display='flex' alignItems='center'>
// 						<UsersIcon sx={{fontSize: "13px", mr: 0.5}}/>
// 						<Typography variant='caption' component='p'>					
// 							{impression?.toLocaleString("vi-VN")} impressions / 
// 							<b>{reach?.toLocaleString("vi-VN")} reach</b>
// 						</Typography> 				
// 					</Box>
// 					<Box display='flex' alignItems='center'>
// 						<Box display='flex' alignItems='center'>
// 							<EmojiHappyIcon sx={{fontSize: "13px", mr: 0.5}}/>
// 							<Typography variant='caption' component='p'>					
// 								{reaction?.toLocaleString("vi-VN") || 0}
// 							</Typography> 				
// 						</Box>
// 						<Box display='flex' alignItems='center' mx={1}>
// 							<PencilIcon sx={{fontSize: "13px", mr: 0.5}}/>
// 							<Typography variant='caption' component='p'>					
// 								{comment?.toLocaleString("vi-VN") || 0}
// 							</Typography> 				
// 						</Box>
// 						<Box display='flex' alignItems='center' mx={1}>
// 							<ShareIcon sx={{fontSize: "13px", mr: 0.5}}/>
// 							<Typography variant='caption' component='p'>					
// 								{share?.toLocaleString("vi-VN") || 0}
// 							</Typography> 				
// 						</Box>
// 					</Box>
// 				</Box>
// 				<Box display='flex' alignItems='center'>
// 					<ClockIcon sx={{fontSize: "13px", mr: 0.5}}/>
// 					<Typography variant='caption'>
// 						{new Date(post?.properties?.created_at?.created_time).toLocaleString("vi-VN")}
// 					</Typography>																					
// 				</Box>
// 		</Box>
// 	)
// }