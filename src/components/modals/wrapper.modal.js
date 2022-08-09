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
import { CreateContentForm } from '../content/create-form';

export default function WrapperModal(props){
    const token = cookieLib.getCookie("token")
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const {isShowModal, handleClosed, children, ...others} = props    
    
    const [isWorking, setIsWorking] = useState(false)
    

    useEffect(()=>{
        
        
    },[])

    
    return (
        <Modal
            open={isShowModal}
            onClose={handleClosed}
            aria-labelledby="Connect Facebook Fanpage"
            aria-describedby="modal-modal-description"                
            sx={{
                width: "100%",
                maxWidth: 500,
                overflowY:'scroll',
                height:'100%',
                display:'block',
                right: 0,
                top: 0,
                left: "auto"
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    px: 3,
                    pt: 5,
                    pb: 2
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
                    {children}
                </Box>                            
            </Box>
        </Modal>
    )
}