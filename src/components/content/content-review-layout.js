import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Button, Card, CardActions, CardContent, Typography, CircularProgress, Divider, Grid, Avatar } from '@mui/material';

import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import ContentsNotionApiClient from '../../api-clients/contents.api-client';
import cookieLib from '../../lib/cookie.lib';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { CONTENT_REVIEW_CODE, ERR_MSG, MAX_REQUEST_PAGE_SIZE, MEMBER_TIER } from '../../constant';
import CaptchaDialog from './captcha-dialog';
import { useAuth } from '../../hooks/use-auth';
import AuthApiClient from '../../api-clients/auth.api-client';
import CardMediaLazy from '../card-media-lazy';
import Link from '@mui/material/Link';
import ReviewButton from '../buttons/review.button';
import ContentCardComponent from '../card/content.card';

export default function NotionContentReviewLayout (props){
    const { listItem, ...other } = props;    

    return (
        <Box sx={{justifyItems: "center"}}>
            {/* {listItem && (
                <ResponsiveMasonry
                    columnsCountBreakPoints={{350: 1, 750: 3, 900: 4}}                
                >
                    <Masonry gutter = "10px">
                        {listItem.map((item, index) => (
                            <NotionContentReviewCard 
                                data={item} 
                                key={item?.id}
                            />
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            )}               */}
            {listItem && listItem.map((item, index)=>(
                <ContentCardComponent data={item} key={item?.id} />
            ))}            
        </Box>
    )
}

const NotionContentReviewCard = ({data}) => {        
    const [isInReview, setIsInReview] = useState(true)
    const [editor, setEditor] = useState()
    
    return(
        <>
        {isInReview
        ?
        <Card>
            <Box
                sx={{
                    padding: "16px 16px !important",
                }}
            >                
                <Box sx={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Avatar sizes='small'/>
                    <Box ml={1}>
                        <Typography variant='subtitle2'>
                            <Typography variant='caption'>
                                <Link href={`/account/${data?.editor_notion_id}`} fontWeight="bold"target="_blank" color="initial">
                                    {data?.editor_name || data?.added_by}
                                </Link>
                            </Typography>
                        </Typography>
                        <Box display="flex" textAlign="center" alignItems="center">
                            <AccessTimeFilledIcon display="flex" fontSize='10'/>
                            <Typography variant='caption' marginLeft={0.5}>{data?.created_at}</Typography>
                        </Box>
                    </Box>
                </Box>                
            </Box>
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
                <Link
                    href={`/contents/`+data?.id}                    
                >
                    <Typography variant='subtitle2' sx={{textTransform: "capitalize"}}>{data?.title}</Typography>
                </Link>                                        

                <div className='contents-collection' style={{overflowWrap: "break-word"}}>                    
                    {data && data?.collections && data?.collections.map((item, index)=>(                        
                        <Link 
                            key={item?.id}
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
            <CardActions 
                sx={{ 
                    padding: "16px 16px !important",
                    justifyContent: "center"
                }}
            >		
                <ReviewButton 
                    contentID = {data?.id}
                    reviewStatus = {data?.properties?.review_code?.number || 0}
                    handleSuccess = {()=>{setIsInReview(false)}}
                />
            </CardActions>								
            
            <Divider />
            <Typography component="div" variant='caption' textAlign="center">{data?.review_status}</Typography>
        </Card>     
        : null
        }
        </>        
    )

}