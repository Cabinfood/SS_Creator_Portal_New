import { Card,Divider, Typography, Link, CardContent, CardActions, Grid, Button, Stack} from '@mui/material';
import cookieLib from '../../lib/cookie.lib';
import _ from "lodash"
import CardMediaLazy from '../card-media-lazy';
import RepostButton from '../buttons/repost.button';
import LoveButton from '../buttons/love.button';
import DownloadButton from '../buttons/download.button';
import ReviewButton from '../buttons/review.button';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import {Eye as EyeIcon} from "../../icons/eye.js"
import { Trash as TrashIcon } from '../../icons/trash';
import ClaimButton from '../buttons/claim.button';
import EditContentButton from '../buttons/edit-content.button'
import PlayerContainer from '../jwplayer-custom';

const token = cookieLib.getCookie("token")

export default function ContentCardComponent({data}) {    
    const [isInReview, setIsInReview] = useState(true)
    
    const [isExpired, setIsExpired] = useState(data?.is_expired)
    
    console.log("content data: ", data)
    return (        
        <Card sx={{
            marginBottom: 1.5,
            border: isExpired === true ? "1px solid red" : null
        }}>
            <Grid container spacing={1}>
                <Grid item 
                    xs={12} md={3}
                    className="media-attachment"                     
                >
                    {data?.attachments?.length > 0
                    ?
                        <CardMediaLazy
                            mode = {1}
                            idContent = {data?.id}
                            title = {data?.title}
                            source = {data?.attachments?.[0]?.file?.url || data?.attachments?.[0]?.external?.url}
                            fileName = {data?.attachments?.[0]?.name}
                        />                                                
                    :   null
                    }
                </Grid>        

                <Grid item 
                    xs={12} md={9}
                    className="media-info"     
                >
                    <Box p={1}>
                        <Typography 
                            variant='caption' 
                            fontWeight="bold"
                            color='black'
                            sx={{
                                textTransform: "capitalize",
                                paddingRight: 1                            
                            }}
                            component="p"
                        >
                            <Link href={`/contents/`+data?.id}>
                                {data?.title}
                            </Link>
                        </Typography>
                        
                        <Typography variant='caption' color="secondary">
                            <Link href={`/account/${data?.editor_notion_id}`} target="_blank">
                                {data?.editor_name || data?.added_by}
                            </Link>
                        </Typography>

                        <Typography variant='caption' color="gray" ml={1}>                        
                            ,{new Date(data?.created_at).toLocaleString("vi-VN")}
                        </Typography>


                        <div className='contents-collection' style={{overflowWrap: "break-word"}}>                    
                            {data && data?.collections && data?.collections.map((item, index)=>(                        
                                <Link 
                                    key={index}
                                    href={`/collections/${item?.id}`} 
                                    variant='caption'
                                    style={{
                                        textDecoration: "none",                                
                                        display: "inline-flex",
                                        marginRight: "4px",                                
                                    }}
                                >                            
                                    #{data?.collection_name?.[index]?.title?.[0]?.plain_text}
                                    {index != data?.collections.length - 1 ? ',': ''}
                                </Link>                        
                            ))}            
                        </div>              
                        {
                            data?.reference_ip?.title
                            ?
                                <div className=''>
                                    <Typography variant='caption' color="success">
                                        IP:     
                                        <Typography variant='caption' fontWeight={600} ml={0.5}>{data?.reference_ip?.title}</Typography>
                                    </Typography>
                                </div>
                            : null
                        }
                        

                        <Divider sx={{marginY: 0.5}}/>
                        <Box display='flex' flexDirection='row' gap={1} mt={0.5}>
                            <Typography variant='caption' mr={0.5}><b>{data?.impression?.toLocaleString("vi-VN") || 0}</b> impression</Typography>
                            <Typography variant='caption' mr={0.5}><b>{data?.view?.toLocaleString("vi-VN")  || 0}</b> view</Typography>
                            <Typography variant='caption' mr={0.5}><b>{data?.earning?.toLocaleString("vi-VN")  || 0}</b>$</Typography>
                        </Box>

                        {isExpired === false
                        ?
                            <Box 
                                display='flex' 
                                flexDirection='row' 
                                flexWrap='wrap'
                                gap={1} 
                                mt={1}
                            >
                                <LoveButton 
                                    contentID = {data?.id}
                                    lovedCount = {data?.loved_by?.length || 0}
                                    isLoved = {data?.is_loved || false}
                                    // style = {{
                                    //     marginLeft: "2px"
                                    // }}
                                />
                                <DownloadButton 
                                    urlDownload = {data?.attachments?.[0]?.file?.url || data?.attachments?.[0]?.external?.url}
                                    title = {data?.title}
                                    // style = {{
                                    //     marginLeft: "2px"
                                    // }}
                                />
                                {data?.review_code === 1 && (
                                    <RepostButton 
                                        title = {data?.title}
                                        attachments = {data?.attachments || []}
                                        reposts = {data?.re_posts?.relation || []}
                                        repostURLs = {data?.re_posts_url || []}		
                                        reviewCode = {data?.review_code || 0}
                                        contentID = {data?.id}
                                        // style = {{
                                        //     marginLeft: "0px",
                                        //     minWidth: "50px"
                                        // }}
                                    />
                                )} 
                                {data?.review_code !== 1 && (
                                    <ReviewButton 
                                        contentID = {data?.id}
                                        reviewStatus = {data?.review_code || 0}
                                        handleSuccess = {()=>{console.log("review success")}}
                                    />
                                )}     

                                <ClaimButton 
                                    contentID = {data?.id}
                                    reviewStatus = {data?.review_code || 0}
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
                        

                    </Box>                    
                </Grid>                
            </Grid>            
        </Card>
    )
}