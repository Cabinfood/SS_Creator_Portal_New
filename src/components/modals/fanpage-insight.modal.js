import { Modal, Box,Container, Link, useMediaQuery, Typography, IconButton, Avatar, Card, CardMedia, CardContent, CircularProgress, Grid, Button, Stack, Divider, List, ListItem, TableContainer, TableHead, TableBody, TableRow, TableCell, CardHeader, Tooltip } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styled } from '@mui/material/styles';
import { InformationCircleOutlined as InformationCircleOutlinedIcon } from '../../icons/information-circle-outlined';
import ChannelApiClient from '../../api-clients/channel.api-client';
import cookieLib from '../../lib/cookie.lib';
import $ from "jquery"
import { X as XIcon } from '../../icons/x';
import _ from "lodash"
import { ExternalLink as ExternalLinkIcon } from "../../icons/external-link";

export default function FanpageInsightModal(props){
    const token = cookieLib.getCookie("token")
    const {isShowModal, handleClosed, pageNotionID, pageName, avatarURL, coverURL, pageID, userName, ...others} = props    
    
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const [isWorking, setIsWorking] = useState(false)
    const [insightData, setInsightData] = useState()
    const [pageEngageuser, setPageEngageUser] = useState()
    const [reach, setReach] = useState()
    const [view, setView] = useState()
    const [newFan, setNewFan] = useState()

    useEffect(()=>{
        if (!pageNotionID) return;
        getInsightPage()
        console.log("data:....", pageNotionID, pageName, avatarURL, coverURL, pageID, userName)
    },[pageNotionID])

    const getInsightPage = async() => {
        setIsWorking(true)
        const insightResponse = await ChannelApiClient.insightPage(token, pageNotionID)
        if (insightResponse?.success) {
            console.log(insightResponse)
            const {data} = insightResponse
            setInsightData(data)

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
        <Modal
            open={isShowModal}
            onClose={handleClosed}
            aria-labelledby="Connect Facebook Fanpage"
            aria-describedby="modal-modal-description"                
            sx={style}
        >
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                }}
            >                
                <IconButton
                    color="inherit"
                    onClick={handleClosed}
                    sx={{
                        position: "fixed",
                        top: 10,
                        right: 10,     
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: 50,
                        '& :hover' : {
                            color: 'black'
                        }
                    }}
                >
                    <XIcon fontSize="small" />
                </IconButton>
                
                <Box>
                    <Box>
                        <CardMedia 
                            component='img'
                            image={coverURL}
                            sx = {{
                                maxHeight: "290px"
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

                    

                    <Container maxWidth="sm" sx={{marginTop: "15px"}}>
                        <Box sx={{ mb: 4 }}>
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
                                                {insightData?.followers_count.toLocaleString("vi-VN")}
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
                                                {insightData?.fan_count.toLocaleString("vi-VN")}
                                            </Typography>                                        
                                        </div>

                                </Grid>
                            </Grid>
                            </Card> 
                            
                            
                            
                            {pageEngageuser && (
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
                            )}                        
                            
                        </Box>
                    </Container>

                </Box>

                <Box 
                    sx={{
                        px: 3,
                        py: 4
                    }}
                >

                </Box>               
            </Box>
        </Modal>
    )
}

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

const TableInsightDataWithoutCompare = (props) => {
    const {title, description, headerTable, data} = props
    return (
        <>
        {data && (
            <Card sx={{marginTop: 3}}>
                <CardHeader
                    title = {title}
                    subheader = {description}
                />
                
                <Box width="100%">
                    <TableContainer sx={{
                        display: "table"
                    }}>
                        <TableHead>                        
                            <TableRow>
                                {headerTable && headerTable?.map((item, index)=>(
                                    <TableCell 
                                        key={index}
                                        align = {index > 0 ? "right" : 'inherit'}
                                    >
                                        {item}
                                    </TableCell>                                
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data && data?.values?.map((item, index)=>(    
                                <TableRow key={index}>
                                    <TableCell>{new Date(item?.end_time).toLocaleDateString("vi-VN")}</TableCell>
                                    <TableCell align="right">{item?.value.toLocaleString("vi-VN")}</TableCell>                                                
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableContainer>      
                </Box>                     
            </Card>
        )}            
        </>        
    )
}

const TableInsightData = (props) => {
    const {title, description, headerTable, data, followersCount} = props
    if (data) return (
        <Card sx={{marginTop: 3}}>
            <CardHeader
                title = {title}
                subheader = {description}
            />
            
            <Box width="100%">
                <TableContainer sx={{
                    display: "table"
                }}>
                    <TableHead>                        
                        <TableRow>
                            {headerTable && headerTable?.map((item, index)=>(
                                <TableCell 
                                    key={index}
                                    align = {index > 0 ? "right" : 'inherit'}
                                >
                                    {item}
                                </TableCell>                                
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data && data?.values?.map((item, index)=>(    
                            <TableRow key={index}>
                                <TableCell>{new Date(item?.end_time).toLocaleDateString("vi-VN")}</TableCell>
                                <TableCell align="right">{item?.value.toLocaleString("vi-VN")}</TableCell>
                                <TableCell align="right">
                                    {Math.round((item?.value / followersCount)*100,2)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableContainer>      
            </Box>                     
        </Card>
    )
}


const TableInsightViewData = (props) => {
    const {title, description, data} = props
    if (data) return (
        <Card sx={{marginTop: 3}}>
            <CardHeader
                title = {title}
                subheader = {description}
            />
            
            <Box>
                <TableContainer sx={{
                    // display: "table"
                }}>
                    <TableHead>                        
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell align='right'>
                                Total
                                <Tooltip title={data?.totalVideoViews?.description}>
                                    <InformationCircleOutlinedIcon sx={{ color: 'action.active' }} fontSize="15px"/>
                                </Tooltip>
                            </TableCell>
                            <TableCell align='right'>
                                Organic
                                <Tooltip title={data?.totalVideoViewsOrganic?.description}>
                                    <InformationCircleOutlinedIcon sx={{ color: 'action.active' }} fontSize="15px"/>
                                </Tooltip>
                            </TableCell>
                            <TableCell align='right'>
                                Paid
                                <Tooltip title={data?.totalVideoViewsPaid?.description}>
                                    <InformationCircleOutlinedIcon sx={{ color: 'action.active' }} fontSize="15px"/>
                                </Tooltip>
                            </TableCell>
                            <TableCell align='right'>
                                Viewer
                                <Tooltip title={data?.uniqueView?.description}>
                                    <InformationCircleOutlinedIcon sx={{ color: 'action.active' }} fontSize="15px"/>
                                </Tooltip>
                            </TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data?.totalVideoViews && data?.totalVideoViews?.values?.map((item, index)=>(    
                            <TableRow key={index}>
                                <TableCell>{new Date(item?.end_time).toLocaleDateString("vi-VN")}</TableCell>
                                <TableCell align="right">{item?.value.toLocaleString("vi-VN")}</TableCell>
                                <TableCell align="right">{data?.totalVideoViewsOrganic?.values?.[index].value.toLocaleString("vi-VN")}</TableCell>
                                <TableCell align="right">{data?.totalVideoViewsPaid?.values?.[index].value.toLocaleString("vi-VN")}</TableCell>                                
                                <TableCell align="right">{data?.uniqueView?.values?.[index].value.toLocaleString("vi-VN")}</TableCell>                                
                            </TableRow>
                        ))}
                    </TableBody>
                </TableContainer>      
            </Box>                     
        </Card>
    )
}





// const OrderDrawerDesktop = styled(Modal)({
//     width: 500,
//     flexShrink: 0,
//     '& .MuiDrawer-paper': {
//       position: 'relative',
//       width: 500
//     }
//   });
  
// const OrderDrawerMobile = styled(Modal)({
// flexShrink: 0,
// maxWidth: '100%',
// height: 'calc(100% - 64px)',
// width: 500,
// '& .MuiDrawer-paper': {
//     height: 'calc(100% - 64px)',
//     maxWidth: '100%',
//     top: 64,
//     width: 500
// }
// });
