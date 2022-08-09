import { Avatar, Box, Button, Card, Tooltip, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Link, TableContainer, CardContent } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import ChannelApiClient from '../../../api-clients/channel.api-client';
import ConnectPageFacebookButton from "../../buttons/connect-page-facebook.button";
import cookieLib from '../../../lib/cookie.lib';
import FanpageInsightModal, { OrderDrawer } from '../../modals/fanpage-insight.modal';
import { useAuth } from '../../../hooks/use-auth';
import InsightsIcon from '@mui/icons-material/Insights';
import { MEMBER_TIER } from '../../../constant';

export const ChannelsTable = (props) =>{    
    const token = cookieLib.getCookie("token")
    const {user} = useAuth()
    
    const {pages: listPages, listPagesIDConnected, handleConnectSuccess, ...others} = props
    // const [listPages, setListPages] = useState([])
    const [showInsightModal, setShowInsightModal] = useState(false)
    const [selectedPage, setSelectedPage] = useState()
    const rootRef = useRef(null)
    

    const showInsightPage = (page) => {
        console.log(page)
        setSelectedPage(page)
        setShowInsightModal(true)
    }

    const initialize = async() => {
        pages.forEach(async(page, index) => {
            const apiRet = await ChannelApiClient.insightPage(token, page.id)
            if (apiRet?.success) {
                console.log(index, "- ",page?.propertise?.name?.title?.[0]?.title, ": ", apiRet)
                setListPages((prev) => {
                    return [...prev, apiRet?.data]
                })                
            } else {
                console.log("error: ", page?.page_name)
                return;
            }
            
        });
        
    }



    return (    
        <Box>
            <Card>
                <CardHeader 
                    title= {`Danh sách kênh`}
                    action={
                        user?.tier === MEMBER_TIER.MASTER_ADMIN && (
                            <ConnectPageFacebookButton 
                                connectSuccess = {(data)=>{handleConnectSuccess(data)}}
                                listPageConnected = {listPagesIDConnected}
                            />
                        )
                    }
                />            
                <Box>                
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Followers</TableCell>
                                            <TableCell align="right">Updated At</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {listPages && listPages.map((page, index)=>(
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box display={'flex'} alignItems="center">
                                                        <Avatar src={page?.avatarURL}/>
                                                        <Box ml={2}>
                                                            <Box>
                                                                <Typography variant='body' mr={1} fontWeight='bold'>
                                                                    <Link href={`/channels/${page?.notionID}`}>{page?.name}</Link>
                                                                </Typography>
                                                                <InsightsIcon 
                                                                    fontSize='14px' 
                                                                    onClick={()=>{showInsightPage(page)}} 
                                                                    sx={{
                                                                        border: "1px solid black",
                                                                        borderRadius: "50%",
                                                                        '&: hover' : {
                                                                            cursor: 'pointer'
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>                                                
                                                            <Typography variant='caption' >{page?.id} | {page?.username}</Typography>
                                                        </Box>                                            
                                                    </Box>                                        
                                                </TableCell>
                                                <TableCell align="right">{page?.followersCount?.toLocaleString("vi-VN")}</TableCell>
                                                <TableCell align="right">{new Date(page?.updatedAt)?.toLocaleString("vi-VN")}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>                
                </Box>							
            </Card>
            {showInsightModal && (
                <FanpageInsightModal 
                    isShowModal = {showInsightModal}
                    handleClosed = {()=>{setShowInsightModal(false)}}
                    pageNotionID = {selectedPage?.notionID}
                    pageName = {selectedPage?.name}
                    avatarURL = {selectedPage?.avatarURL}
                    coverURL = {selectedPage?.coverURL}
                    pageID = {selectedPage?.id}
                    userName = {selectedPage?.username}
                />
                
            )}
        </Box>   
    )
}