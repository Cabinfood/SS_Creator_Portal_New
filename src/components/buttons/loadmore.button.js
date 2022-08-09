import { useState, useEffect } from 'react';
import { Button, CircularProgress, Box} from "@mui/material"

export default function LoadMoreButton(props) {    
    const {handleLoadMore, title, isWorking, ...other} = props
    
    const loadMoreAction = () => {
        if (handleLoadMore) {
            handleLoadMore()
        } else {
            console.log("chưa cài event callback")
        }
    }
    return (        
        <div 
            className="loadmore-button"            
            style={{
                display: "grid",
                justifyItems: "center",
                margin: "0 auto"
            }}
        >
            <Button 
                variant='contained' 
                onClick={loadMoreAction}
                size="small"
            >
                {title ? title : "Xem Thêm"}
                
                {isWorking
                ?
                    <CircularProgress 
                        size={15}
                        sx={{
                            marginLeft: 1,
                            color: "white"
                        }}
                        
                    />
                : null
                }                
            </Button>       
        </div>
    )

}