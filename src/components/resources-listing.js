import { useState, useEffect } from 'react';
import {Box, Button, Card, CardActions, CardContent, Typography, CircularProgress, Divider, Grid } from '@mui/material';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ContentsNotionApiClient from '../api-clients/contents.api-client';
import cookieLib from '../lib/cookie.lib';
import CardMediaLazy from './card-media-lazy';
import RepostButton from './buttons/repost.button';
import LoveButton from './buttons/love.button';
import DownloadButton from './buttons/download.button';
import { Link } from '@mui/material';
import ContentCardComponent from './card/content.card';

export default function NotionResourcesListing (props){
    const token = cookieLib.getCookie("token")    
    const { listItem, ...other } = props;    
    

    return (
        <Box sx={{justifyItems: "center"}}>
            {/* {listItem && listItem.length > 0
            ?
                <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 3, 900: 4}}>
                    <Masonry gutter = "10px">
                        {listItem?.map((item, index) => (
                            // <MasonryNotionResourceItem data={item} key={item?.id}/>    
                            <ContentCardComponent data={item} key={item?.id} />
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            :   null
            }             */}
            {listItem && listItem.map((item, index)=>(
                <ContentCardComponent data={item} key={item?.id} />
            ))}
        </Box>
    )
}

const MasonryNotionResourceItem = ({data}) => {    
    
    return(
        <Card variant="outlined">

            {data?.attachments?.length > 0
            ?
                <CardMediaLazy
                    title = {data?.title}
                    source = {data?.attachments?.[0]?.file?.url || data?.attachments?.[0]?.external?.url}
                    fileName = {data?.attachments?.[0]?.name}
                />
            :   null
            }
            
            <CardContent sx={{
                padding: "16px 16px !important",                    
            }}>
                <Link href={`/contents/`+data?.id}>
                    <Typography variant='subtitle2' sx={{textTransform: "capitalize"}}>{data?.title}</Typography>
                </Link>
                
                <Typography variant='caption'>Editor: 
                    <Link href={`/account/${data?.editor_notion_id}`} fontWeight="bold" ml={1} target="_blank">
                        {data?.editor_name || data?.added_by}
                    </Link>
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
                            #{data?.collection_name?.[index]?.plain_text}
                            {index != data?.collections.length - 1 ? ',': ''}
                        </Link>                        
                    ))}            
                </div>
                
            </CardContent>

            <Divider />

            <CardActions sx={{
                padding: "16px 16px !important",
                float: 'right'
            }}>
                <RepostButton 
                    title = {data?.title}
                    attachments = {data?.attachments || []}
                    reposts = {data?.re_posts?.relation || []}
                    repostURLs = {data?.re_posts_url[0]?.rich_text|| []}		
                    reviewCode = {data?.review_code || 0}
                    contentID = {data?.id}
                    style = {{
                        marginLeft: "0px",
                        minWidth: "50px"
                    }}
                />

                <LoveButton 
                    contentID = {data?.id}
                    lovedCount = {data?.loved_by?.length || 0}
                    isLoved = {data?.is_loved || false}
                    style = {{
                        marginLeft: "2px"
                    }}
                />
                <DownloadButton 
                    urlDownload = {data?.attachments?.[0]?.file?.url || data?.attachments?.[0]?.external?.url}
                    title = {data?.title}
                    style = {{
                        marginLeft: "2px"
                    }}
                />
            </CardActions>            
        </Card>             
    )
}