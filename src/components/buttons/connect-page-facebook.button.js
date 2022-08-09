import { Modal, Avatar, Box, Button, Card,Container, Tooltip, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Link, TableContainer, Paper, CircularProgress } from '@mui/material';
import { CeIcon, CE_ICON_TYPE, useCeFetcher } from "@cabineat/ui-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFacebook } from '../../contexts/facebook.context';
import ChannelApiClient from '../../api-clients/channel.api-client';
import cookieLib from '../../lib/cookie.lib';
import $ from "jquery"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import _ from "lodash"
import ConnectFanpageModal from '../modals/connect-fanpage.modal';

const token = cookieLib.getCookie("token")

export default function ConnectPageFacebookButton(props) {        
    const {login, connectSuccess, listPageConnected, ...other} = props    
    const [isShowModal, setShowModal] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [fbLoginData, setFbLoginData] = useState(null);
    const [fbPages, setFbPages] = useState([]);
    
    const {
        initializeSdkOnClient,
        loginOnClient,
        getPagesManagedByUserOnClient,
    } = useFacebook();

    const initializeConn = useCallback(() => {
        if (!initializeSdkOnClient()) {
            console.log('INIT FAILED')
          setTimeout(() => {
            initializeConn();
          }, 1000);
        }else {
            console.log('INIT SUCCESS')
        }
    }, [initializeSdkOnClient]);


    const loadFbPages = useCallback(async () => {
        return loginOnClient().then((loginData) => {
            setFbLoginData(loginData);            
            return getPagesManagedByUserOnClient().then((pagesData) => {
                return {
                    data: pagesData,
                    error: null,
                };
            });
        });
    }, [loginOnClient, getPagesManagedByUserOnClient]);

    const {
        fetchData: fetchFbPages,
        loading: loadingFbPages,
        data: fetchedFbPagesData,
    } = useCeFetcher({ fetcher: loadFbPages, skipTimeout: true });

    useEffect(() => {
        initializeConn();
    }, [initializeConn]);


    useEffect(()=>{
        if (fetchedFbPagesData) {   
            setShowModal(true)         
            console.log("fetchedFbPagesData: ", fetchedFbPagesData)
        }
    },[fetchedFbPagesData])

    useEffect(()=>{
        if (fbLoginData) {
            console.log("fbLoginData: ", fbLoginData)            
        }
        setIsWorking(false)
    },[fbLoginData])
    

    return (        
        <div 
            className="login-facebook-button" 
            {...other}
        >            
            {!fetchedFbPagesData 
            ? 
                <Button 
                    variant="outlined" 
                    size='small' 
                    disabled = {isWorking}
                    onClick={() => {
                        setIsWorking(true)
                        fetchFbPages()
                    }}>
                        Connect 
                        {isWorking && (<CircularProgress size={15}/>)}
                    </Button>
            :
                <Button variant="outlined" size='small' onClick={()=>{setShowModal(true)}}>Pages</Button>
            }
            
            {isShowModal && (                
                <ConnectFanpageModal 
                    isShowModal = {isShowModal}
                    handleClosed = {()=>{setShowModal(false)}}
                    fetchedFbPagesData = {fetchedFbPagesData}
                    fbLoginData = {fbLoginData}
                    listPageConnected = {listPageConnected}
                    onSuccess = {(data)=>{connectSuccess(data)}}
                />
            )}
        </div>
    )
}