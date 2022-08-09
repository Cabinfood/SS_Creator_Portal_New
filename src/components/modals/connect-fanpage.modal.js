import { Modal, Avatar, Box, Button, Card,Container, Tooltip, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Link, TableContainer, Paper, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ChannelApiClient from '../../api-clients/channel.api-client';
import cookieLib from '../../lib/cookie.lib';
import $ from "jquery"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import _ from "lodash"

const token = cookieLib.getCookie("token")

export default function ConnectFanpageModal(props){
    const {isShowModal, handleClosed, fetchedFbPagesData, fbLoginData, onSuccess,listPageConnected, ...others} = props
    
    console.log("List page connected: ", listPageConnected)
    const connectPage = async(pageID) => {
        console.log("connect ", pageID)        
        const btnID = "#btn-connect-"+pageID
        $(btnID).html("Connecting...")
        
        const response = await ChannelApiClient.connectPage(token, fbLoginData.accessToken, pageID)
        console.log("response: .....", response)
        if (response?.success && response?.data?.status) {
            $(btnID).html("Connected")
            console.log(response)
            onSuccess(response?.data?.data)
        } 
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
                    // p: 3                    
                }}
            >
                <Box
                    onClick = {handleClosed} 
                    sx={{
                        position: "fixed",
                        right: 15,
                        top: 15,
                        '&:hover' : {
                            cursor: 'pointer'
                        }                    
                    }}>
                    <HighlightOffIcon/>
                </Box>                
                
                <Container maxWidth="sm">
                    <Paper elevation={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                pb: 2,
                                pt: 3,
                                px: 3
                            }}
                        >
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Connect</TableCell>                                
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fetchedFbPagesData && fetchedFbPagesData.map((page, index)=>(
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box 
                                                        display={'flex'}
                                                        alignItems = "center"
                                                    >
                                                        <Avatar src={page?.picture?.data?.url} />
                                                        <Box ml={2}>
                                                            <Typography variant='body' fontWeight='bold' component='p' >{page.name}</Typography>
                                                            <Typography variant='caption' color='grey' >{page.id}</Typography>
                                                        </Box>
                                                        
                                                        
                                                    </Box>
                                                    
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button 
                                                        id = {`btn-connect-`+page?.id}
                                                        variant='outlined' 
                                                        size='small' 
                                                        // disabled = {listPageConnected?.includes(page?.id)}
                                                        onClick={()=>{connectPage(page?.id)}}
                                                    >
                                                        Connect
                                                    </Button>
                                                </TableCell>                                    
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>                                
                            </TableContainer>
                        </Box>
                    </Paper>
                </Container>
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