import React, {useEffect, useState} from 'react';
import { Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import { Duplicate as DuplicateIcon } from '../icons/duplicate';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { bytesToSize } from '../utils/bytes-to-size';
import cookieLib from '../lib/cookie.lib';
import LinearProgressWithLabel from './linear-progress-lable';
import { VNG } from '../constant';
import { X as XIcon } from '../icons/x';

export default function DropZoneCustom(props){
    // const {isShowDescription, ...others} = props
    const {onSelectedFile, onUploadSuccess, onUploadError} = props
    const token = cookieLib.getCookie("token")
	
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [file, setFile] = useState()
    const [uploadPercentage, setUploadPercentage] = useState(0)    


	const changeHandler = async(event) => {
        
        if (event.target.files.length > 0) {
            setIsFilePicked(true)
            console.log(event.target.files)
            setFile(event.target.files[0]) 
            onSelectedFile(event.target.files[0])
        }        
	};

    useEffect(()=>{
        if (!file) return;
        hanldeUpload()
    },[file])

    const hanldeUpload = async() => {
        const endPoint = await axios.post("/api/vng/upload", {token: token})
        const dataEndPoint = endPoint?.data

        const { type, name } = file;
        const nameSplit = name.split(".")        
        var fileName = uuidv4()+"."+ nameSplit[nameSplit.length-1]
        setUploadPercentage(0)

        var reader = new FileReader();
        // reader.readAsArrayBuffer(file);
        reader.onload = function (e) {        
            // binary data
            console.log(e.target.result);
            console.log(VNG.FOLDER)
            axios
                .put(
                    dataEndPoint?.urlUpload + "/"+VNG.FOLDER+"/" + fileName,
                    e.target.result,
                    {
                        headers: {
                            "Content-Type": type,
                            "X-Auth-Token": dataEndPoint?.tokenUpload,
                        },
                        onUploadProgress: (progress) => {
                            console.log("UPLOAD PROGRESS", progress);
                            setUploadPercentage(Math.round(progress.loaded / progress.total * 100))                            
                        },
                    }
                )
                .then(({ status, data }) => {
                    console.log("RES", status, data);                    
                    onUploadSuccess({
                        status: true, 
                        fileName: fileName,
                        url: VNG.CDN_URL +  "/" + VNG.FOLDER + "/" + fileName
                    })

                })
                .catch((err) => {
                    console.error(err);
                    onUploadError(err)
                });
        };
        reader.onerror = function (e) {
            // error occurred
            console.log("Error : " + e.type);
            onUploadError(err)
        };
        reader.readAsArrayBuffer(file);
    }

    const hanldeRemoveFile = () => {
        setFile(null)
    }

	return(
        <div>
            <input type="file" name="file" onChange={changeHandler} />
			{isFilePicked ? (
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <DuplicateIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={file?.name}
                            primaryTypographyProps={{
                                color: 'textPrimary',
                                variant: 'subtitle2'
                            }}
                            secondary={
                                <React.Fragment>                                
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {bytesToSize(file?.size)} - {file?.type}
                                    </Typography>
                                </React.Fragment>
                                
                            }
                        ></ListItemText>                        
                        {/* <IconButton onClick={hanldeRemoveFile}>
                            <XIcon />
                        </IconButton> */}
                    </ListItem>
                    <LinearProgressWithLabel value={uploadPercentage} />
                </List>				
			) : (
                <Typography variant='caption' component={'p'}>
                    Select a file to show details
                </Typography>
			)}
			
		</div>
	)
}