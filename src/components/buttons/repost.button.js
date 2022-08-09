import { useState, useEffect } from 'react';
import { Button, Dialog, Box, Typography, IconButton, DialogContent, CardMedia, Divider, InputAdornment, List, ListItem, TextField, Link, CircularProgress, Grid } from "@mui/material"
import { Tip } from '../tip';
import { X as XIcon } from '../../icons/x';
import { Search as SearchIcon } from '../../icons/search';
import { onlyNumbers, validURL } from '../../utils/sand-utils';
import cookieLib from '../../lib/cookie.lib';
import ContentsNotionApiClient from '../../api-clients/contents.api-client';
import { useAuth } from '../../hooks/use-auth';
import { MEMBER_TIER } from '../../constant';

export default function RepostButton(props) {
    const token = cookieLib.getCookie("token")
    const {user} = useAuth()    
    const {title, attachments, repostURLs, reviewCode, contentID, reposts, ...other} = props
    const [showUrlDialog, setShowUrlDialog] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [repostCount, setRepostCount] = useState(0)
    const [value, setValue] = useState('');    

    const toggleUrlDialog = () => {
        setShowUrlDialog(!showUrlDialog)
    }

    useEffect(()=>{
        setRepostCount(reposts?.length)
    },[reposts])

    const handleSubmit = async(e) => {
        if (isWorking) return;                    
        
        if (validURL(value) && checkValidRepostURL(value)) {
            setShowUrlDialog(false)   
            setIsWorking(true)

               
            const arrPostURLEle = value.split("/")
            let pageUserName = null
            let pageID = null
            console.log("arrPostURLEle: ", arrPostURLEle)

            if (onlyNumbers(arrPostURLEle[3])) pageID = arrPostURLEle[3]
            else pageUserName = arrPostURLEle[3]
        
            const objectID = arrPostURLEle[5]
            const typeObject = arrPostURLEle[4] === "videos" ? "videos" : "posts"
            
            console.log(pageUserName, pageID)

            const response = await ContentsNotionApiClient.repost(token, contentID, value, objectID, typeObject, pageUserName, pageID)        
            const {data} = response
            console.log(response)            
            
            if (!data?.error) {
                setRepostCount(repostCount+1)
                setIsWorking(false)  
                setValue('')
            } else {
                alert(data?.msg)
                setIsWorking(false)
            }

        } else {
            alert("Đường dẫn sai định dạng yêu cầu. Vui lòng kiểm tra lại")
        }
    }

    const checkValidRepostURL = (url) => {
        if (url.includes("/videos/") || url.includes("/posts/")) return true
        else return false
    }

    return (        
        <div className="repost-button" 
            {...other}
        >
            { (user?.tier === MEMBER_TIER.SOCIAL_PERFORMANCE_SPECIALIST || user?.tier === MEMBER_TIER.MASTER_ADMIN || user?.tier === MEMBER_TIER.GROWTH_LEADER)
            && (
                <Box>
                    {reviewCode === 1 && (
                        <Button 
                            size='small' 
                            variant='outlined' 
                            disabled={isWorking} 
                            onClick={toggleUrlDialog}
                            sx={{
                                minWidth: "100px"
                            }}
                        > 
                            <small> re-post ({repostCount}) </small>
                            {isWorking && (<CircularProgress size={20}/>)}        
                        </Button>
                    )}            
                    
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        onClose={() => {setShowUrlDialog(false)}}
                        open={showUrlDialog}
                        {...other}
                    >
                        <Box
                            sx={{
                                alignItems: 'center',
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                display: 'flex',
                                justifyContent: 'space-between',
                                px: 3,
                                py: 2
                            }}
                        >
                            <Typography variant="h6">
                                {title}
                            </Typography>
                            
                            <IconButton
                                color="inherit"
                                onClick={() => {setShowUrlDialog(false)}}
                            >
                                <XIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        <DialogContent>
                            <CardMedia
                                component="video"
                                src={`${attachments?.[0]?.file?.url || attachments?.[0]?.external?.url}#t=0.001`}
                                alt={title}
                                controls
                            />                
                            
                            <Divider sx={{
                                my:2
                            }}/>
                                <Box>
                                    <Tip 
                                        message="Đường dẫn hợp là phải ở dạng /videos hoặc /posts." 
                                    />
                                    <Box my={3}>
                                        <TextField
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon fontSize="small" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            label="Repost URL"
                                            onChange={(event) => {
                                                console.log(event.target.value)
                                                setValue(event.target.value)
                                            }}
                                            placeholder="Paste your repost link..."
                                            value={value}
                                        />
                                    </Box>

                                    <Box 
                                        className="submit-repost-button"            
                                        style={{
                                            display: "grid",
                                            justifyItems: "center"
                                        }}
                                    >
                                        <Button 
                                            variant='contained'
                                            onClick={handleSubmit}
                                        >
                                            Đăng
                                        </Button>                                
                                    </Box>                                                                               
                                </Box>       
                            <Divider sx={{
                                my:2
                            }}/>

                            {repostURLs.length > 0
                            ?
                                <Box>
                                    <Typography variant='h6'>Danh sách re-post</Typography>
                                    <List>
                                        {repostURLs?.length > 0 && repostURLs?.map((item, index)=>(
                                            <ListItem divider disableGutters key={index} sx={{
                                                fontSize: "0.9em"
                                            }}>
                                                <Typography variant='caption' sx={{lineBreak: "anywhere"}}>
                                                    <Link varian="caption" target="_blank" href={item?.rich_text?.[0]?.plain_text}>
                                                        {index+1} - {item?.rich_text?.[0]?.plain_text}
                                                    </Link>
                                                </Typography>
                                                
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>   
                            : 
                                <Box textAlign="left">
                                    <Typography variant='caption'>Hãy là người đầu tiên sử dụng nội dung này</Typography>
                                </Box>
                            }
                        </DialogContent>
                    </Dialog>
                </Box>
            )}            
        </div>
    )

}