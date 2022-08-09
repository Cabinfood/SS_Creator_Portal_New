import { Avatar, Box, Typography, Link } from '@mui/material';
import { ExternalLink as ExternalLinkIcon } from '../../icons/external-link';
import { Briefcase as BriefcaseIcon } from '../../icons/briefcase';
import { Users as UsersIcon } from '../../icons/users';
import { Clock as ClockIcon } from '../../icons/clock';
import { Share as ShareIcon } from '../../icons/share';
import { Pencil as PencilIcon } from '../../icons/pencil';
import { EmojiHappy as EmojiHappyIcon } from '../../icons/emoji-happy';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useEffect, useState } from 'react';
import cookieLib from "../../lib/cookie.lib";
import _, { round } from 'lodash';
import { useAuth } from '../../hooks/use-auth';
import PostApiClient from '../../api-clients/post.api-client';

export const PostInsightComponent = (props) => {	
	
	const token = cookieLib.getCookie("token")
	const {user} = useAuth()

	const {post, handleUpdateRevenue, hanldeUpdateImpression, handleUpdateView, hanldeUpdateAdImpression} = props	
	const [impression, setImpression] = useState(0)
	const [reach, setReach] = useState(0)
	const [comment, setComment] = useState(0)
	const [share, setShare] = useState(0)
	const [view, setView] = useState(0)
	const [reaction, setReaction] = useState(0)
	const [earning, setEarning] = useState(0)
	const [cpm, setCPM] = useState(0)
	const [adImpression, setAdImpression] = useState(0)
	const [data, setData] = useState()

	useEffect(()=>{
		getObjectInsight()
	},[])

	const getObjectInsight = async() => {	
		const insightData = await PostApiClient.getObjectInsight(token, post?.id)		

		const {data} = insightData
		if (_.isNull(data)) return;

		setData(data)
		setImpression(data?.impression)
		setReach(data?.reach)
		setView(data?.view)
		setShare(data?.share)
		setComment(data?.comment)				
		setReaction(data?.reaction)				
		setEarning(data?.earning)
		setCPM(data?.cpm)
		setAdImpression(data?.ad_impression)

		if (handleUpdateRevenue) handleUpdateRevenue(data?.earning)
		if (hanldeUpdateImpression) hanldeUpdateImpression(data?.impression)
		if (handleUpdateView) handleUpdateView(data?.view)
		if (hanldeUpdateAdImpression) hanldeUpdateAdImpression(data?.ad_impression)		
	}

	return (
		<Box 			
			sx={{
				fontSize: "10px",
				'&:last-child td': {
					border: 0
				}
			}}
		>
				{(!data) && (
					<Typography variant='subtitle' sx={{color: "red"}}>Không lấy được dữ liệu</Typography>
				)}
				{ data && (
					<Box display='flex' alignItems='center'>
						<Avatar sx={{
							width: "15px", height: "15px", 
							bgcolor: earning >0 ? "green" : "red", 
							marginRight: "2px"
						}}>$</Avatar>

						<Typography variant='caption' fontWeight='bold' mr={2}>						
							{round(earning/100 || 0, 2)?.toLocaleString("vi-VN")}
						</Typography>
						{earning > 0 && (
							<>
								| 
								<Typography variant='caption' mx={2}>
									Ad Impression: <b>{adImpression?.toLocaleString("vi-VN")} times</b>
								</Typography>
								| 
								<Typography variant='caption' mx={2}>
									CPM: <b>{round(cpm/100,2)?.toLocaleString("vi-VN")}$</b>
								</Typography>
								
							</>
						)}					
						| 
						<Typography variant='caption' mx={2}>
							<b>{view?.toLocaleString("vi-VN")} </b>views
						</Typography>										
					</Box>
				)}				

				<Box display='flex' alignItems='center'>
					<Typography variant='body2' component='span'>
						<Link href={`/account/${user?.notion_id}`}>
							{post?.properties?.posted_by_name?.rollup?.array?.[0]?.title?.[0]?.plain_text}													
						</Link>
					</Typography>
					<ArrowRightAltIcon color='primary'/>
					<Typography variant='body2' component='span'>
						<Link href={`/channels/${post?.properties?.of_channel?.relation?.[0]?.id}`}>
							{post?.properties?.channel_name?.rollup?.array?.[0]?.title?.[0]?.plain_text}
						</Link>
					</Typography>
					<ArrowRightAltIcon color='primary'/>
					<Link 
						href={post?.properties?.url?.rich_text?.[0]?.plain_text} 
						target="_blank" 
						sx={{
							wordBreak: "break-all"
						}}
					>
						{post?.properties?.object_id?.rich_text?.[0]?.plain_text}
						<ExternalLinkIcon sx={{
							marginLeft: "2px",
							fontSize: "15px"
						}}/>
					</Link>
				</Box>			

				<Box display='flex' alignItems='center'>
					<BriefcaseIcon sx={{fontSize: "13px", mr: 0.5}}/>
					<Link href={`/contents/${post?.properties?.of_resource?.relation?.[0]?.id}`} target="_blank">
						<Typography variant='caption' component='p'>
							{post?.properties?.resources_title?.rollup?.array?.[0]?.title?.[0]?.plain_text}
						</Typography>
					</Link>
				</Box>
				{!data?.error && (
					<Box my={2}>
						<Box display='flex' alignItems='center'>
							<UsersIcon sx={{fontSize: "13px", mr: 0.5}}/>
							<Typography variant='caption' component='p'>					
								{impression?.toLocaleString("vi-VN")} impressions / 
								<b>{reach?.toLocaleString("vi-VN")} reach</b>
							</Typography> 				
						</Box>
						<Box display='flex' alignItems='center'>
							<Box display='flex' alignItems='center'>
								<EmojiHappyIcon sx={{fontSize: "13px", mr: 0.5}}/>
								<Typography variant='caption' component='p'>					
									{reaction?.toLocaleString("vi-VN") || 0}
								</Typography> 				
							</Box>
							<Box display='flex' alignItems='center' mx={1}>
								<PencilIcon sx={{fontSize: "13px", mr: 0.5}}/>
								<Typography variant='caption' component='p'>					
									{comment?.toLocaleString("vi-VN") || 0}
								</Typography> 				
							</Box>
							<Box display='flex' alignItems='center' mx={1}>
								<ShareIcon sx={{fontSize: "13px", mr: 0.5}}/>
								<Typography variant='caption' component='p'>					
									{share?.toLocaleString("vi-VN") || 0}
								</Typography> 				
							</Box>
						</Box>
					</Box>
				)}
				<Box display='flex' alignItems='center'>
					<ClockIcon sx={{fontSize: "13px", mr: 0.5}}/>
					<Typography variant='caption'>
						{new Date(post?.properties?.created_at?.created_time).toLocaleString("vi-VN")}
					</Typography>																					
				</Box>
		</Box>
	)
}