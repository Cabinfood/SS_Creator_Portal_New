import {Box, Avatar, Card, CardContent, Link, Typography, Divider, Button } from "@mui/material"
import NextLink from 'next/link';
import { useState, useMemo, useEffect } from "react";
import {Star as StarIcon} from "../../icons/star"
import { Users as UsersIcon } from '../../icons/users';
import {Eye as EyeIcon} from '../../icons/eye'
import {CurrencyDollar as CurrencyDollarIcon} from '../../icons/currency-dollar'
import {ChartBar as ChartBarIcon} from '../../icons/chart-bar'
import { getInitials } from '../../utils/get-initials';
import { ObjectInsightFragment } from "../fragment/objects/insight.fragment";
import { wrap } from "lodash";
import { height } from "@mui/system";

export const ChannelSummary = (props) => {
    const {data,onUpdateRevenue,onUpdateImpression,onUpdateAdImpression, onUpdateView, ...other} = props    
    const [impression, setImpression] = useState(0)
    const [view, setView] = useState(0)
    const [adImpression, setAdImpression] = useState(0)
    const [revenue, setRevenue] = useState(0)
    const [collapsed, setCollapsed] = useState(true)
        
    useEffect(() => {
        summary()
    },[])

    const summary = () => {
        data?.objects?.forEach((object,index) => {
            
            if(!_.isNull(object?.properties?.impression?.number) && !_.isUndefined(object?.properties?.impression?.number)) {
                setImpression(prev => prev + object?.properties?.impression?.number)   
                if(onUpdateImpression) onUpdateImpression(object?.properties?.impression?.number)  
            }
            if(!_.isNull(object?.properties?.ad_impression?.number) && !_.isUndefined(object?.properties?.ad_impression?.number)) {
                setAdImpression(prev => prev + object?.properties?.ad_impression?.number)     
                if (onUpdateAdImpression) onUpdateAdImpression(object?.properties?.ad_impression?.number)
            }
            if(!_.isNull(object?.properties?.view?.number) && !_.isUndefined(object?.properties?.view?.number)) {
                setView(prev => prev + object?.properties?.view?.number)     
                if (onUpdateView) onUpdateView(object?.properties?.view?.number)
            }
            if(!_.isNull(object?.properties?.earning?.number) && !_.isUndefined(object?.properties?.earning?.number)) {
                setRevenue(prev => prev + object?.properties?.earning?.number)   
                if(onUpdateRevenue) onUpdateRevenue(object?.properties?.earning?.number)  
            }
        })
    }


    return (
        
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {
                                xs: 'column',
                                sm: 'row'
                            }                        
                        }}
                    >                        
                        <div>
                            <NextLink
                                href={`/channels/${data?.objects?.[0]?.properties?.of_channel?.relation?.[0]?.id}`}
                                passHref
                            >
                                <Link
                                    color="textPrimary"
                                    variant="h6"
                                    target="_blank"
                                >
                                    {data?.name}
                                </Link>
                            </NextLink>
                            <Typography variant="body2">Tổng số lượng post được đăng lên là <b>{data?.objects?.length} posts.</b></Typography>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    ml: -3,
                                    '& > *': {
                                        ml: 3,
                                        mt: 1
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                    }}
                                >
                                    <UsersIcon
                                        color="action"
                                        fontSize="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography
                                        color="textSecondary"
                                        noWrap
                                        variant="overline"
                                    >
                                        {impression.toLocaleString("vi-VN")}
                                    </Typography>
                                </Box>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                <EyeIcon
                                    color="action"
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                />
                                <Typography
                                    color="textSecondary"
                                    noWrap
                                    variant="overline"
                                >
                                    {view.toLocaleString("vi-VN")}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                <CurrencyDollarIcon
                                    color= {revenue > 0 ? "success" : "textSecondary"}
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                />
                                <Typography
                                    color= {revenue > 0 ? "success" : "textSecondary"}
                                    noWrap
                                    variant="overline"
                                >
                                    {revenue.toLocaleString("vi-VN")}
                                </Typography>
                            </Box>      
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                }}
                            >
                                
                                <Typography
                                    color= {adImpression > 0 ? "success" : "textSecondary"}
                                    noWrap
                                    variant="overline"
                                >
                                    Ad Impression {' '} :
                                    {adImpression.toLocaleString("vi-VN")}
                                </Typography>
                            </Box>                        
                            {data?.isVerified && (
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex'
                                    }}
                                >
                                    <BadgeCheckOutlinedIcon
                                        color="success"
                                        fontSize="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography
                                        color="success"
                                        noWrap
                                        variant="overline"
                                    >
                                        Verified
                                    </Typography>
                                </Box>
                            )}
                            </Box>
                        </div>
                    </Box>
                    
                    <div>
                        <Button onClick={()=>{setCollapsed(!collapsed)}}>
                            {collapsed ? "Chi tiết" : "Thu gọn" }
                        </Button>
                    </div>                    
                </Box>  

                <Box sx={{ 
                    mt: 2,
                    height: collapsed ? 0 : "auto",
                    overflow: "hidden"
                }} 
                >
                    <Card variant="outlined">
                        {data?.objects && data?.objects.map((object, index) => (                                                
                            <div key={index}>
                                <ObjectInsightFragment 
                                    objectData = {object} 
                                    hanldeUpdateImpression = {(data)=>{updateImpression(data)}}
                                    handleUpdateView = {(data)=>{updateView(data)}}
                                    handleUpdateRevenue = {(data)=>{updateRevenue(data)}}
                                    hanldeUpdateAdImpression = {(data)=>{updateAdImpression(data)}}
                                />
                                {(index !== data.length - 1) && <Divider />}
                            </div>
                        ))}                        
                    </Card>
                </Box>
            </CardContent>
        </Card>
    )
}