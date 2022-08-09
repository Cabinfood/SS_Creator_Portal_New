import LazyLoad from 'react-lazyload';
import {Box, CardMedia} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import JWPlayer from '@jwplayer/jwplayer-react';
import PlayerContainer from './jwplayer-custom';

export default function CardMediaLazy(props) {
    const {idContent, source, title, fileName, autostart, mute, mode, volume, ...others} = props
    
    
    useEffect(()=>{
        
        
    },[source])

    return(
        <LazyLoad once>
            {fileName && (fileName.includes(".jpg") || fileName.includes(".jpeg") || fileName.includes(".png"))
            ?
            <CardMedia
                component="img"
                image={`${source}`}
                alt={title}
            />                
            :
            
            <Box display="absolute">
                {/* <CardMedia
                    component="video"
                    src={`${source}#t=0.001`}
                    alt={title}
                    controls
                    preload='metadata'
                /> */}

                { source && (                           
                    <PlayerContainer
                        source = {source}                            
                        mode = {mode}
                        autostart = {autostart}
                        mute = {mute}
                        volume = {volume}
                    />                    
                )}
                
            </Box>            
            }            
            
        </LazyLoad>
    )
}