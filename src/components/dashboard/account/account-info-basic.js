import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/use-auth";

import {Grid, Typography, Box, Link, Button, Avatar, TextField} from "@mui/material";
import DropZoneCustom from "../../drop-zone-custom"
import { UserCircle as UserCircleIcon } from '../../../icons/user-circle';
import cookieLib from "../../../lib/cookie.lib";
import MemberApiClient from "../../../api-clients/member.api-client";

export const AccountInformationBasic = (props) => {
    const token = cookieLib.getCookie("token")
    const {user} = useAuth()
    const [isWorking, setIsWorking] = useState(false)
    const [avatarURL, setAvatarURL] = useState(user?.avatar)
    
    const handleSelectedFile = (file) => {
        console.log(file)
    }    
    
    const handleUpdateAvatar = async(avatarURL) => {
        const res = await MemberApiClient.updateAvatar(token, avatarURL)
        console.log(res)
    }

    return(
        <div {...props}>            
            <Box
                sx={{
                alignItems: 'center',
                display: 'flex'
                }}
            >
                <Avatar
                    src={avatarURL}
                    sx={{
                        height: 64,
                        mr: 2,
                        width: 64
                    }}
                    >
                    <UserCircleIcon fontSize="small" />
                </Avatar>
                {/* <Button>Change</Button> */}
                <DropZoneCustom 
                    onSelectedFile = {(file)=>{
                        handleSelectedFile(file)
                        setIsWorking(true) // waiting for upload file
                    }}
                    onUploadSuccess = {(data)=>{
                        console.log(data)     
                        setAvatarURL(data?.url)                 
                        handleUpdateAvatar(data?.url)
                        setIsWorking(false) // finished upload file
                    }}
                    onUploadError = {(error)=> {                                
                        console.log(error)
                        alert("Có lỗi xảy ra, vui lòng thử lại !!!")
                    }}
                />                    
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    mt: 3,
                    alignItems: 'center'
                }}
            >
                <TextField
                    defaultValue={user.fullname}
                    label="Full Name"
                    disabled
                    size="small"
                    sx={{
                        flexGrow: 1,
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    mt: 3,
                    alignItems: 'center'
                }}
            >
                <TextField
                    defaultValue={user?.email}
                    disabled
                    label="Email Address"
                    required
                    size="small"
                    sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed'
                        }
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    mt: 3,
                    alignItems: 'center'
                }}
            >
                <TextField
                    defaultValue={user?.phone}
                    disabled
                    label="Phone Number"
                    required
                    size="small"
                    sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderStyle: 'dashed'
                        }
                    }}
                />
            </Box>
        </div>
    )
}