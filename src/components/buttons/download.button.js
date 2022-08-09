import { useState, useEffect } from 'react';
import { Button, Link} from "@mui/material"
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { useAuth } from '../../hooks/use-auth';
import { MEMBER_TIER } from '../../constant';

export default function DownloadButton(props) {    
    const {urlDownload, title, ...other} = props
    const {user} = useAuth()            
    return (        
        <div 
            className="download-button" 
            {...other}
        >
            { (user?.tier === MEMBER_TIER.SOCIAL_PERFORMANCE_SPECIALIST || user?.tier === MEMBER_TIER.MASTER_ADMIN || user?.tier === MEMBER_TIER.GROWTH_LEADER)
            && urlDownload && (
                <Button 
                    variant="contained" 
                    size="small" 
                    sx={{                    
                        minWidth: "50px"
                    }}
                >   
                    <Link href={urlDownload} target="_blank" download={title} color="white">
                        <ArrowDownwardRoundedIcon fontSize='10px' />
                    </Link>                
                </Button>
            )}            
        </div>
    )

}