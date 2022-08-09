import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {Grid, Typography, Box, Link, Button, Avatar} from "@mui/material";
import DropZoneCustom from "../../drop-zone-custom"
import MemberApiClient from "../../../api-clients/member.api-client";
import cookieLib from "../../../lib/cookie.lib";
import { useAuth } from "../../../hooks/use-auth";
import { isAsyncThunkAction } from "@reduxjs/toolkit";

export const AccountKYC = (props) => {
    const token = cookieLib.getCookie("token")
    const {user} = useAuth()
    const [isKYCSuccess, setIsKYCSuccess] = useState(user?.isKYC)
    const [isWorking, setIsWorking] = useState(false)
    const [IDFrontImage, setIDFrontImage] = useState(null);
    const [IDBackImage, setIDBackImage] = useState(null);
    const [isValid, setIsValid] = useState(false)

    const handleSubmitKYC = async() => {
        if (isWorking) return;
        setIsWorking(true)
        const response = await MemberApiClient.updateIDImage(token, IDFrontImage, IDBackImage)        
        console.log(response)
        if (response?.success) {

        }
        setIsWorking(false)
    }        

    return(
        <div {...props}>
            {isKYCSuccess === false
            ?
            <Box>
                {/* KYC Front */}
                <Grid
                    container
                    spacing={3}
                    my={2}
                >
                    <Grid item md={4} xs={12}>
                        <Typography variant="subtitle1">CMND/CCCD Mặt trước</Typography>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                            Hình ảnh chụp rõ, không mờ, không nhòe
                        </Typography>
                    </Grid>
                    
                    <Grid item md={8} xs={12}
                    >
                        <DropZoneCustom 
                            onSelectedFile = {(file)=>{
                                setIsWorking(true) // waiting for upload file
                            }}
                            onUploadSuccess = {(data)=>{
                                console.log(data)                                 
                                setIDFrontImage(data?.url)
                                setIsWorking(false) // finished upload file
                            }}
                            onUploadError = {(error)=> {                                
                                console.log(error)
                                alert("Có lỗi xảy ra, vui lòng thử lại !!!")
                            }}
                        />                    
                    </Grid>
                </Grid>
                
                {/* KYC Back */}

                <Grid container spacing={3}>
                    <Grid item md={4} xs={12}>
                        <Typography variant="subtitle1">CMND/CCCD Mặt sau</Typography>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                            Hình ảnh chụp rõ, không mờ, không nhòe
                        </Typography>
                    </Grid>
                    
                    <Grid item md={8} xs={12}>                    
                        <DropZoneCustom 
                            onSelectedFile = {(file)=>{
                                setIsWorking(true) // waiting for upload file
                            }}
                            onUploadSuccess = {(data)=>{
                                console.log(data)     
                                setIDBackImage(data?.url)           
                                setIsWorking(false) // finished upload file
                            }}
                            onUploadError = {(error)=> {                                
                                console.log(error)
                                alert("Có lỗi xảy ra, vui lòng thử lại !!!")
                            }}
                        />
                    </Grid>
                </Grid>
                
                <Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            mb: 4,
                            mt: 3
                        }}
                    >
                        <Typography
                            color="primary.main"
                            variant="body2"
                            fontWeight={"bold"}
                        >
                            Toàn bộ dữ liệu của Bạn cung cấp sẽ được chúng tôi bảo mật.
                        </Typography>

                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                            Bạn cần đảm bảo các thông tin mà Bạn đã cung cấp cho chúng tôi là hoàn toàn chính xác.
                        </Typography>                            
                    </Box>
                </Box>
                
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button            
                        variant="contained" 
                        color="secondary" 
                        onClick={handleSubmitKYC}
                        disabled = {(!IDFrontImage?.length > 0 || !IDBackImage?.length > 0) ? true : false}
                    >
                        Xác Thực Tài Khoản
                    </Button>
                </Box>
            </Box>
            : 
            <KYCSuccess />
            }            
        </div>
    )
}

export const KYCSuccess = () => {
    return (
        <Box>
            <Button variant="contained" color="secondary">
                <Typography>
                    We are verifing your account ...
                </Typography>                
            </Button>
            <Typography
                color="textSecondary"
                variant="caption"
                component={"p"}
            >
                The verify account process maybe take 1-3 working days.
            </Typography>                            
        </Box>
    )
}