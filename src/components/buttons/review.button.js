import { useState, useEffect } from 'react';
import { Button, Box, CircularProgress, Grid} from "@mui/material"
import ContentsNotionApiClient from '../../api-clients/contents.api-client';
import cookieLib from '../../lib/cookie.lib';
import { useAuth } from '../../hooks/use-auth';
import { CONTENT_REVIEW_CODE, ERR_MSG, MAX_REQUEST_PAGE_SIZE, MEMBER_TIER } from '../../constant';
import CaptchaDialog from '../content/captcha-dialog';


export default function ReviewButton(props) {    
    const {contentID, reviewStatus, handleSuccess, ...other} = props
    const token = cookieLib.getCookie("token")
    const {user} = useAuth()
    const [isWorking, setIsWorking] = useState(false)
    const [isManager, setIsManager] =  useState(false)
    const [isInReview, setIsInReview] = useState(true)

    const [reviewCode, setReviewCode] = useState(CONTENT_REVIEW_CODE.NOT_REVIEW)
    const [toggeCaptchaDialog, setToggleCaptchaDialog] = useState(false)
    const [captchaValue, setCaptchaValue] = useState()

    useEffect(()=>{
        checkLevelMember()
    },[])            

    const handleApproved = async() => {
        setReviewCode(CONTENT_REVIEW_CODE.APPROVED)
        generateCaptcha()
    }

    const handleRejected = async() => {
        setReviewCode(CONTENT_REVIEW_CODE.REJECTED)
        generateCaptcha()
        setToggleCaptchaDialog(true)
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
        
    const updateReview = async() => {
        if (isWorking) return;
        setIsWorking(true)
        const response = await ContentsNotionApiClient.review(token, contentID, reviewCode)
        if (response?.data) {
            setIsInReview(false)
            if (handleSuccess) handleSuccess()
        }
        else alert(ERR_MSG.NORMAL)
        setToggleCaptchaDialog(false)
        setIsWorking(false)
    }

    return (        
        <div className="review-button" {...other}>
            {isManager && reviewStatus === 0 && isInReview
            ?
                <Grid container spacing={1}>
                    <Grid item>
                        <Button size='small' variant='outlined' color='error' disabled={isWorking} onClick={handleRejected}> Reject</Button>                    
                    </Grid>
                    <Grid item>
                        <Button size='small' variant='contained' color='success' disabled={isWorking} onClick={handleApproved}> Approve</Button>                          
                    </Grid>                    
                </Grid>
            : null
            }

            <CaptchaDialog
                onClose={()=>{setToggleCaptchaDialog(false)}}
                open= {toggeCaptchaDialog}
                captchaValue = {captchaValue}
                contentID = {contentID}
                onSubmit= {()=>{updateReview()}}
                
            />
        </div>
    )

}