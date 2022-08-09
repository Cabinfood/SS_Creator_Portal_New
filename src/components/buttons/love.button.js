import { useState, useEffect } from 'react';
import { Button, Box, CircularProgress } from "@mui/material"

import cookieLib from '../../lib/cookie.lib';
import ContentsNotionApiClient from '../../api-clients/contents.api-client';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function LoveButton(props) {
    const token = cookieLib.getCookie("token")
    const {contentID, lovedCount, isLoved, ...other} = props
    const [isWorking, setIsWorking] = useState(false)

    const [loveStatus, setLoveStatus] = useState(false)    
    const [noOfLoved, setNoOfLoved] = useState(0)
    
    useEffect(()=>{
        setLoveStatus(isLoved)
        setNoOfLoved(lovedCount)
    },[lovedCount, isLoved])

    const hanldeLove = async(contentID) => {
        if (isWorking) return;
		setIsWorking(true)
		const response = await ContentsNotionApiClient.loved(token, contentID)
		if (response && response?.data) {
            setLoveStatus(!loveStatus)
            setNoOfLoved(response?.data?.properties?.loved_by?.relation?.length)
        }        
		setIsWorking(false)
    }

    return (        
        <div className="love-button"
            {...other}
        >
            <Button 
                variant="outlined" 
                size="small" 
                disabled={isWorking} 
                onClick={()=>{hanldeLove(contentID)}}        
                sx={{                    
                    minWidth: "50px"
                }}
            >   
                {loveStatus === true
                ? <FavoriteIcon fontSize='10px'/>
                : <FavoriteBorderIcon fontSize='10px'/>
                }                 
                <small style={{
                    marginLeft: "2px"
                }}>
                    {noOfLoved}

                    {isWorking && (
                        <Box
                            sx={{
                                display: 'inline-flex',
                                justifyContent: 'center',
                                ml: 1
                            }}
                        >
                            <CircularProgress size={10}/>
                        </Box>
                    )}
                </small>
            </Button>
            
        </div>
    )

}