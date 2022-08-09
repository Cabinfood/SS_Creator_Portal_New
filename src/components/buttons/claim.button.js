import { useState, useEffect } from 'react';
import { Button, Box, CircularProgress, Grid} from "@mui/material"
import ContentsNotionApiClient from '../../api-clients/contents.api-client';
import cookieLib from '../../lib/cookie.lib';
import { useAuth } from '../../hooks/use-auth';
import { CONTENT_REVIEW_CODE, ERR_MSG, MAX_REQUEST_PAGE_SIZE, MEMBER_TIER } from '../../constant';
import CaptchaDialog from '../content/captcha-dialog';
import {Eye as EyeIcon} from "../../icons/eye.js"

export default function ClaimButton(props) {    
    const {contentID, reviewStatus, handleSuccess, ...other} = props
    const token = cookieLib.getCookie("token")
    const {user} = useAuth()
    const [isWorking, setIsWorking] = useState(false)
    const [isManager, setIsManager] =  useState(false)

    const [toggeCaptchaDialog, setToggleCaptchaDialog] = useState(false)
    const [captchaValue, setCaptchaValue] = useState()

    useEffect(()=>{
        checkLevelMember()
    },[])            

    const handleExpired = async() => {
        generateCaptcha()
    }


    const generateCaptcha = () => {
        const captcha = Math.floor(Math.random()*90000) + 10000;
        setCaptchaValue(captcha)
        setToggleCaptchaDialog(true)
    }

    const checkLevelMember = () => {
        if (user?.tier === MEMBER_TIER.MASTER_ADMIN || user?.tier === MEMBER_TIER.GROWTH_LEADER) setIsManager(true)
        else setIsManager(false)
    }
        
    const expired = async() => {
        if (isWorking) return;
        setIsWorking(true)
        const response = await ContentsNotionApiClient.expired(token, contentID)
        if (response?.data) {
            if (handleSuccess) handleSuccess()
        }
        else alert(ERR_MSG.NORMAL)
        setToggleCaptchaDialog(false)
        setIsWorking(false)
    }

    return (        
        <div className="claim-button" {...other}>
            {isManager
            ?
                <Button
                    sx={{
                        backgroundColor: 'error.main',
                        // mr: 3,
                        '&:hover': {
                            backgroundColor: 'error.dark'
                        }
                    }}
                    size="small"
                    startIcon={<EyeIcon fontSize="small" />}
                    variant="contained"
                    onClick={handleExpired}
                >
                    Claim
                </Button>
            : null
            }

            <CaptchaDialog
                onClose={()=>{setToggleCaptchaDialog(false)}}
                open= {toggeCaptchaDialog}
                captchaValue = {captchaValue}
                contentID = {contentID}
                onSubmit= {()=>{expired()}}
                
            />
        </div>
    )

}