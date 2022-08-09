import { useState, useEffect, useMemo } from 'react';
import { Box, Card, Checkbox, Chip, Divider, FormControlLabel, Input } from '@mui/material';
import {Search as SearchIcon} from "../icons/search"
import { MultiSelect } from '../components/multi-select';
import CollectionApiClient from '../api-clients/collection.api-client';
import cookieLib from '../lib/cookie.lib';

export default function ContentFilter(props) {    
    const { ...other} = props    
    const token = cookieLib.getCookie("token")
    const [collections, setCollections] = useState()    
    
    useEffect(()=>{
        initialize()
    },[])

    const initialize = async() => {
        const collectionRet = await CollectionApiClient.all(token)
        console.log(collectionRet?.data?.results)
        setCollections(collectionRet?.data?.results)
    }

    const removeItem = async(id) => {
        let temp = collections
        console.log("before:", temp)
        temp.splice(temp.findIndex(v => v.value === id), 1);
        console.log("after:",temp)
        setCollections(temp)
    }

    return (        
        <Card {...other}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    p: 2
                }}
            >
                <SearchIcon fontSize="small" />
                <Box
                    sx={{
                        flexGrow: 1,
                        ml: 3
                    }}
                >
                    <Input
                        disableUnderline
                        fullWidth
                        placeholder="Enter a keyword"
                    />
                </Box>
            </Box>
            <Divider />
            
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexWrap: 'wrap',
                    p: 2
                }}
            >
                {collections && collections.map((filterItem, i) => (
                    <Chip
                        key={i}
                        label={(
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    '& span': {
                                        fontWeight: 600
                                    }
                                }}
                            >
                                <span>{filterItem.label}</span>                                
                            </Box>
                        )}
                        onDelete={() => { removeItem(filterItem?.value) }}
                        sx={{ m: 0.5 }}
                        variant="outlined"
                    />
                ))}                
            </Box>
            
        </Card>
    )
}