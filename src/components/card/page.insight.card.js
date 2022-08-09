import { Card,Divider, Typography, Link, CardContent, CardActions,Box, Grid, CardMedia, Avatar, CircularProgress} from '@mui/material';
import cookieLib from '../../lib/cookie.lib';
import _ from "lodash"
import { useEffect, useState } from 'react';
import { ExternalLink as ExternalLinkIcon } from "../../icons/external-link";
import ChannelApiClient from '../../api-clients/channel.api-client';

const token = cookieLib.getCookie("token")

export default function PageInsightCardComponent(props) {    
    const {channelNotionID} = props
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
            <Box sx={{ mb: 4 }}>
                {/* {pageEngageuser && (
                    <TableInsightData
                        followersCount = {insightData?.followers_count}
                        title = {pageEngageuser?.title}
                        description = {pageEngageuser?.description}
                        headerTable = {['Time', 'Engage', '%']}
                        data = {pageEngageuser}
                    />
                )}

                {reach && (
                    <TableInsightData 
                        followersCount = {insightData?.followers_count}
                        title = {reach?.title}
                        description = {reach?.description}
                        headerTable = {['Time', 'Reach', '%']}
                        data = {reach}
                    />
                )}
                
                {view && (
                    <TableInsightViewData 
                        title = "Daily View"
                        description = {`${view?.totalVideoViews?.title}, ${view?.totalVideoViewsOrganic?.title}, ${view?.totalVideoViewsPaid?.title}, ${view?.uniqueView?.title}`}
                        headerTable = {['Time', 'Total', 'Organic', 'Paid']}
                        data = {view}
                    />
                )}                         */}
                
            </Box>
    )
}