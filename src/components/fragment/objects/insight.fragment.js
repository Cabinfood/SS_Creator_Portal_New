import { Button, Card, Divider, Typography, Box, Link, CircularProgress, Chip, Avatar, Grid } from "@mui/material"
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {formatDistanceStrict } from 'date-fns';
import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import cookieLib from "../../../lib/cookie.lib";
import PostApiClient from "../../../api-clients/post.api-client";
import {ExternalLink as ExternalLinkIcon} from '../../../icons/external-link'
import { TIME_INTERVAL } from "../../../constant";
import { diff_minutes } from "../../../utils/sand-utils";
import $ from "jquery";
import * as momentTz from 'moment-timezone'
import CardMediaLazy from "../../card-media-lazy";

export const ObjectInsightFragment = (props) => {
    const token = cookieLib.getCookie("token")
    const {objectData:object, handleUpdateRevenue, hanldeUpdateImpression, handleUpdateView, hanldeUpdateAdImpression, ...other} = props
    const [isWorking, setIsWorking] =  useState(false)

    const [impression, setImpression] = useState()
	const [reach, setReach] = useState()
	const [comment, setComment] = useState()
	const [share, setShare] = useState()
	const [view, setView] = useState()
	const [reaction, setReaction] = useState()
	const [earning, setEarning] = useState()
	const [cpm, setCPM] = useState()
	const [adImpression, setAdImpression] = useState()    
    const [lastEditedTime, setLastEditedTime] = useState()
    const [publishedTime, setPublisedTime] = useState()
    const [isPublished, setIsPublished] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false)
    const [postCreatedTime, setPostCreatedTime] = useState()
    const [insight, setInsight] = useState(null)    
    const [messageNoti, setMessageNoti] = useState("Post chưa có dữ liệu")
    const [isError, setIsError] = useState(false)
    const [CVREarnOnEstimate, setCVREarnOnEstimate] = useState(0)
    const [objectThumbnail, setObjectThumbnail] = useState()

    useEffect(() => {
        if (object) {
            setImpression(object?.properties?.impression?.number)
            setReach(object?.properties?.reach?.number)
            setView(object?.properties?.view?.number)
            setShare(object?.properties?.share?.number)
            setComment(object?.properties?.comment?.number)				
            setReaction(object?.properties?.reaction?.number)				
            setEarning(object?.properties?.earning?.number)
            setCPM(object?.properties?.cpm?.number)
            setAdImpression(object?.properties?.ad_impression?.number)
            setLastEditedTime(object.last_edited_time)
            setPostCreatedTime(object?.properties?.object_created_time?.date?.start)
            setPublisedTime(object?.properties?.object_schedule_time?.date?.start || object?.properties?.object_created_time?.date?.start)
            setIsPublished(object?.properties?.is_published?.checkbox)
            setIsDeleted(object?.properties?.is_deleted?.checkbox)
            console.log("object thumbnail: ", object?.properties?.object_thumbnail?.files?.[0])
            setObjectThumbnail(object?.properties?.object_thumbnail?.files?.[0])

            let estRev = object?.properties?.cpm?.number !== 0
                            ? (object?.properties?.cpm?.number * object?.properties?.ad_impression?.number)/1000  
                            : 0
            let CVREarnOnEst = object?.properties?.earning?.number !== 0 ? _.round(object?.properties?.earning?.number/estRev, 2) * 100 : 0
            setCVREarnOnEstimate(CVREarnOnEst)

            if (object?.properties?.is_deleted?.checkbox) setMessageNoti("Post đã bị xóa.")
            else if (object?.properties?.is_published?.checkbox === false) setMessageNoti(`Post đã được lên lịch, ${object?.properties?.object_schedule_time?.date?.start.toLocaleString("VN-vi")}`)
        }
    },[object])

    const refresh = async() => {	 
        if (isWorking) return;                
        setIsWorking(true)

        $(`#btn-refresh-${object?.id}`).hide()
		const insightData = await PostApiClient.getObjectInsight(token, object?.id)
        
		const {data, success} = insightData || null
        
        if (!success) {
            alert("Có lỗi xảy ra")
            return;
        } 		

        if (data?.error === true) {     
            setIsError(data?.error)       
            setMessageNoti(data?.msg)
            setIsWorking(false)
            return;
        }

        if (data?.error === false) {
            
            const {data: objectInsightData} = data || null
            setImpression(objectInsightData?.impression)
            setReach(objectInsightData?.reach)
            setView(objectInsightData?.view)
            setShare(objectInsightData?.share)
            setComment(objectInsightData?.comment)				
            setReaction(objectInsightData?.reaction)				
            setEarning(objectInsightData?.earning)
            setCPM(objectInsightData?.cpm)
            setAdImpression(objectInsightData?.ad_impression)
            setLastEditedTime(new Date())
            setPostCreatedTime(objectInsightData?.createdTime)
            setIsWorking(false)
            setIsPublished(objectInsightData?.isPublished)

            let estRev = objectInsightData?.cpm !== 0
                            ? (objectInsightData?.cpm * objectInsightData?.ad_impression)/1000  
                            : 0
            let CVREarnOnEst = objectInsightData?.earning !== 0 ? _.round(objectInsightData?.earning/estRev, 2) * 100 : 0
            setCVREarnOnEstimate(CVREarnOnEst)
            return;
        }		
	}

    return (
        <Fragment {...other}>            
            <Grid container spacing={1.5}
                sx={{
                    alignItems: 'center',
                    // display: 'flex',
                    justifyContent: 'space-between',
                    // flexWrap: 'wrap',
                    px: 2,
                    py: 1.5,
                }}
            >
                {/* <Grid item xs={12} md={2}>                    
                </Grid> */}
                <Grid item xs={12} md={9}>
                    <Box display="flex" gap={1}>
                        {objectThumbnail && (
                            <Box className="object-thumb" width="50px" alignSelf="end">
                                
                                    <CardMediaLazy
                                        source = {objectThumbnail?.external?.url}
                                        fileName = {objectThumbnail?.external?.url}
                                    />                                
                            </Box>
                        )}
                        <Box className="object-info">                            
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1
                                }}
                            >
                                <Chip label={`${object?.properties?.type_object?.select?.name}`} size="small" color="info" sx={{fontSize: "10px"}}/>
                                <Typography 
                                    variant="subtitle2"
                                    overflow= "hidden"
                                    textOverflow= "ellipsis"
                                    whiteSpace= "nowrap"
                                    component="p"
                                >
                                    {object?.properties?.object_id?.rich_text?.[0]?.plain_text}
                                </Typography>                                
                                <Link
                                    href={object?.properties?.url?.rich_text?.[0]?.plain_text}
                                    target="_blank"
                                >
                                    <ExternalLinkIcon 
                                        fontSize="small"
                                        sx={{ ml: 0.5 }}
                                    />
                                </Link>    
                            </Box>                    
                            
                            <NextLink
                                href={`/contents/${object?.properties?.of_resource?.relation?.[0]?.id}`}
                                passHref                                    
                            >
                                <Link
                                    target="_blank"                            
                                    maxWidth= "80%"                            
                                    whiteSpace= "nowrap"
                                    sx={{                                
                                        "&: hover" : {
                                            textDecoration: "none",
                                            color: "textPrimary"
                                        }
                                    }}
                                >
                                    <Typography 
                                        variant="body2"
                                        color="textSecondary"      
                                        overflow= "hidden"
                                        textOverflow= "ellipsis"                
                                        sx={{
                                            maxWidth: "70vw"                                    
                                        }}
                                    >
                                        {object?.properties?.resources_title?.rollup?.array?.[0]?.title?.[0]?.plain_text}
                                    </Typography>  
                                </Link>
                            </NextLink>     
                        </Box>              

                    </Box>                          
                
                    {_.isNull(reach) || isError === true || isDeleted === true
                    ?
                        <Typography variant="caption" color="error" fontWeight="bold">{messageNoti}</Typography>
                    :
                    <Box>
                        <Typography
                            color="textPrimary"
                            variant="caption"
                            component='p'
                            mt={1}
                            // noWrap
                        >
                            {reach?.toLocaleString("vi-VN") || 0} reach
                            {' '}
                            -
                            {' '}
                            {impression?.toLocaleString("vi-VN") || 0} impression                                
                        </Typography>  

                        <Typography
                            color="textPrimary"
                            variant="caption"
                            component='p'
                            // noWrap
                        >                                
                            {reaction?.toLocaleString("vi-VN") || 0} reaction
                            -
                            {' '}
                            {comment?.toLocaleString("vi-VN") || 0} comment
                            -
                            {' '}
                            {share?.toLocaleString("vi-VN") || 0} share
                            -
                            {' '}
                            {view?.toLocaleString("vi-VN") || 0} view
                        </Typography>   

                        <Box sx={{
                            border: "1px solid",
                            borderRadius: "5px",
                            padding: "1px 5px",
                            borderColor : adImpression === 0 ? "error.main"
                                            : CVREarnOnEstimate < 0.2 ? "warning.main"
                                                : "success.main"
                        }}>
                            <Typography
                                // color="textPrimary"
                                variant="caption"                            
                            >                                    
                                {adImpression?.toLocaleString("vi-VN") || 0} ad impression
                                -
                                {' '}
                                cpm: {' '}
                                {cpm?.toLocaleString("vi-VN") || 0}$
                                -
                                {' '}

                                earning: {' '}
                                <Box sx={{
                                    display: "inline-flex"
                                }}>
                                    <Typography 
                                        component="span" 
                                        variant="caption"
                                        fontWeight="bold"
                                        color={earning > 1 ? "success.main" : "inhirit"}                                    
                                    >
                                        {earning?.toLocaleString("vi-VN") || 0}                              
                                    </Typography>
                                    <Avatar sx={{ 
                                        width: 15, 
                                        height: 15, 
                                        marginLeft: 0.5,
                                        backgroundColor: earning > 0 ? "success.main" : "error.main"
                                    }}>$</Avatar>
                                </Box>                                                            
                            </Typography> 
                            {adImpression === 0
                            ?
                            <Typography 
                                variant="caption"
                                component="p"
                                fontWeight="bold"
                                color="error.main"
                            >Không hiển thị quảng cáo</Typography>
                            :
                            <Typography 
                                variant="caption"
                                component="p"
                                fontWeight="bold"
                                color={
                                    CVREarnOnEstimate === 0 ? "error.main"
                                                            : CVREarnOnEstimate < 40 ? "warning.main"
                                                                : CVREarnOnEstimate < 55 ? "primary.main"
                                                                    : "success.main"
                                }
                            >
                                Ad Play Rate (%): {CVREarnOnEstimate.toLocaleString("VN-vi")}%   
                                <Typography 
                                    component="p"
                                    variant="caption"
                                    color="textSecondary"
                                    fontStyle = "italic"
                                >
                                    Ad Play Rate càng cao sẽ thể hiện được khả năng giữ chân người dùng đến lúc xuất hiện quảng cáo càng cao, khi chỉ số này <b>vượt trên 55%</b> thì nghĩa là <b>nội dung có khả năng giữ chân người xem tốt</b> cần đẩy mạnh lượt tiếp cận để tăng doanh thu quảng cáo trên bài đăng
                                </Typography>
                            </Typography>
                            }                            

                        </Box>                                                                    
                    </Box>  

                    }
                    
                                                                                                                                                                                    
                </Grid>
                
                <Grid item xs={12} md={3} alignSelf="end" justifySelf="right" spacing={1}>                                        
                                        
                    <Typography color="info.main" variant="caption" component='p' fontWeight="bold">
                        {object?.properties?.posted_by_name?.rollup?.array?.[0]?.title?.[0]?.plain_text}
                    </Typography>                                

                    <Typography color="textSecondary" variant="caption" component="p" sx={{ mr: 2 }}>
                        updated: {' '}
                        {lastEditedTime && formatDistanceStrict(new Date(lastEditedTime).getTime(), new Date(), { addSuffix: true })}
                    </Typography>

                    {isPublished && (
                        <Typography color="textSecondary" variant="caption" component="p" sx={{ mr: 2 }}>
                            published: {' '}
                            {publishedTime && formatDistanceStrict(new Date(publishedTime).getTime(), new Date(), { addSuffix: true })}
                        </Typography>
                    )}                        

                    {postCreatedTime && (
                        <Typography color="textSecondary" variant="caption" component="p" sx={{ mr: 2 }}>
                            created: {' '}
                            {formatDistanceStrict(new Date(postCreatedTime).getTime(), new Date(), { addSuffix: true })}
                        </Typography>
                    )}

                    <Button id={`btn-refresh-${object?.id}`} onClick={refresh} variant="outlined" size="small" sx={{marginTop: 1}}>Resfresh</Button>
                    {isWorking && <CircularProgress size={10}/>}
                    
                </Grid>
            </Grid>            
        </Fragment>
    )
}