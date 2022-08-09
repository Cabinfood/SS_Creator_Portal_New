import { Button, Card, Autocomplete, CardContent, Grid, TextField, Typography, Box, CircularProgress, Divider, MenuItem, Select, OutlinedInput, FormControl, CardHeader, FormControlLabel, Checkbox, FormGroup } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import DropZoneCustom from "../drop-zone-custom";
import LinearWithValueLabel from "../linear-progress-lable";
import cookieLib from "../../lib/cookie.lib";
import ContentsNotionApiClient from "../../api-clients/contents.api-client";
import CollectionApiClient from "../../api-clients/collection.api-client";
import IPReferenceApiClient from "../../api-clients/ip-reference.api-client";
const _ = require('lodash');

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const CreateContentForm = (props) => {
    const token = cookieLib.getCookie("token")
    const {onPreventClose, onWarningClose} = props

    const router = useRouter()
    const [title, setTitle] = useState()
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadPercentage, setUploadPercentage] = useState(0)    
    const [isBusy, setBusy] = useState(false)
    const [isValid, setValid] = useState(false)
    const [fileName, setFileName] = useState()
    const [urlMedia, setUrlMedia] = useState()
    const [collectionList, setCollectionList] = useState()
    const [collectionSelected, setCollecitonSelected] = useState([])
    const [collectionSelectedID, setCollectionSelectedID] = useState([])
    const [isFetchingCollection, setIsFetchingCollection] = useState(false)
    const [referenceIPSelected, setReferenceIPSelected] = useState(null)
    const [listReference, setListReference] = useState(null)

    useEffect(()=>{
        fetchCollection()
        fetchReferenceIP()
    },[])

    useEffect(()=>{
        checkValid()                   
    },[selectedFile, title, collectionSelectedID])  

    const handleSelectCollection = (collectionNotionID) => {
        const indexOfSelectedID = collectionSelectedID.indexOf(collectionNotionID)
        if ( indexOfSelectedID > -1) {
            let temp = collectionSelectedID.filter(item => item !== collectionNotionID)
            console.log("remove: ", temp)            
            setCollectionSelectedID(temp)            
        } else {
            setCollectionSelectedID([...collectionSelectedID, collectionNotionID])
            console.log("add: ", [...collectionSelectedID, collectionNotionID])            
        }
    }

    const fetchReferenceIP = async() => {
        
        const response = await IPReferenceApiClient.all(token)
        const data = response?.data?.data?.results        
        setListReference(response?.data?.data?.results)
    }

    const fetchCollection = async() => {        
        setIsFetchingCollection(true)
        const collectionRes = await CollectionApiClient.getAll(token)        
        console.log(collectionRes)
        setCollectionList(collectionRes?.data?.results)
        setIsFetchingCollection(false)
    }

    const handleSelectedFile = async(file) => {
        console.log(file)
        setSelectedFile(file)        
    }    

    const handleSubmit = async() => {        
        
        if (isBusy || !isValid) return
        setBusy(true)                    
        console.log("ip selected: ", referenceIPSelected)

        const createContentResponse  = await ContentsNotionApiClient.create(token, title, fileName, urlMedia, collectionSelectedID, referenceIPSelected?.id)
        console.log("createContentResponse: ",createContentResponse)
        
        if (createContentResponse?.success) {
            console.log(createContentResponse)
            router.reload(window.location.pathname)
        } else {
            alert("Có lỗi xảy ra, vui lòng thử lại")
        }
        
    }        

    const checkValid = () => {
        // console.log(title?.length , selectedFile)
        if (!title || title?.length === 0) return setValid(false)
        if (!selectedFile) return setValid(false)
        console.log("collectionSelectedID: ",collectionSelectedID)
        if (collectionSelectedID?.length === 0) return setValid(false)
        return setValid(true)
    }

    return (
        <Box>
            <Card variant="outlined">
                <CardHeader 
                    title = "Thêm Nội Dung Mới"
                    subheader = "Nội dung của bạn sau khi được thêm mới sẽ được bộ phận kiểm duyệt nội dung xét duyệt trong 24g."
                />
                
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item md={12} xs={12}>
                            <Typography variant="h6">Tiêu đề</Typography>                            
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                // label="Chủ đề nội dung"
                                name="name"                                
                                onChange={(event)=>{
                                    setTitle(event.target.value)
                                }}
                            />
                            
                        </Grid>
                    </Grid>
                </CardContent>

                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item md={12} xs={12}>
                            <Typography variant="h6">Media</Typography>
                            <Typography
                                color="textSecondary"
                                variant="body2"
                                sx={{ mt: 1 }}
                            >
                                File hình ảnh/video thể hiện nội dung chủ đề
                            </Typography>
                        </Grid>
                        
                        <Grid item md={12} xs={12}>
                            <DropZoneCustom 
                                onSelectedFile = {(file)=>{
                                    console.log(file)
                                    handleSelectedFile(file)
                                    setBusy(true) // waiting for upload file
                                    onPreventClose(true)
                                }}
                                onUploadSuccess = {(data)=>{
                                    console.log(data)
                                    onWarningClose(true)

                                    setFileName(data?.fileName)
                                    setUrlMedia(data?.url)
                                    setBusy(false) // finished upload file
                                    onPreventClose(false)
                                    
                                }}
                                onUploadError = {(error)=> {                                
                                    console.log(error)
                                    alert("Có lỗi xảy ra, vui lòng thử lại !!!")
                                    onPreventClose(false)
                                    onWarningClose(false)
                                }}
                            />
                            
                        </Grid>
                    </Grid>
                </CardContent>

                <CardContent>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box>
                            <Typography variant="h6">Collection (*)</Typography>
                            <Typography
                                color="textSecondary"
                                variant="body2"
                                sx={{ mt: 1 }}
                            >
                                Tạo mới hoặc chọn bộ sưu tập cho nội dung
                            </Typography>
                        </Box>
                        
                        <Box>
                            {isFetchingCollection && (<CircularProgress size={15} />)}
                            <FormControl
                                required
                                component="fieldset"                                
                                variant="standard"
                                sx={{ m: 3 }}
                            >
                                <FormGroup >
                                    {collectionList && collectionList.map((item, index) => (
                                        <CollectionFormControlLabel 
                                            key = {index}
                                            title = {item?.label}
                                            onSelected={(data)=>{
                                                handleSelectCollection(item?.value)
                                            }}                                                 
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="h6" paddingBottom={3}>
                            Video có sử dụng bản quyền ?
                        </Typography>

                        {listReference && (
                            <Autocomplete
                                freeSolo
                                options={listReference}
                                getOptionLabel = {option => option.title}
                                // defaultValue = {listReference.find(option => option.id === content?.reference_ip?.id)}
                                renderInput = {(params) => <TextField {...params} label="Tham chiếu" />}
                                onChange = {(event, value)=>{setReferenceIPSelected(value)}}
                            />
                        )}                        

                    </Box>                    
                </CardContent>
            </Card>

            <Box sx={{
                position: "fixed",
                bottom: 10,       
                right: 10,         
            }}>
                <Box sx={{
                    display: "flex",
                }}>
                    <Button 
                        variant="contained" 
                        sx={{marginLeft: "auto"}}
                        onClick={handleSubmit}
                        disabled = {(isBusy || !isValid) ? true : false}
                    >
                        Submit                    
                        {isBusy
                        ? <CircularProgress size={20} color="inherit" sx={{marginLeft: 1}} />
                        : null
                        }                    
                    </Button>

                    {uploadPercentage > 0 && (
                        <Box sx={{width: '100%'}}>
                            <LinearWithValueLabel value={uploadPercentage} />
                            <Typography variant="caption" >Vui lòng không đóng cửa sổ này khi đến khi quá trình tải file lên hoàn tất.</Typography>
                        </Box>
                    )}       
                </Box>                                         
            </Box>
        </Box>
    )
}


const CollectionFormControlLabel = (props) => {
    const {onSelected, title, ...others} = props

    return (
        <FormControlLabel
            label= {title}
            control={<Checkbox size="small"/>} 
            onChange={(event)=>{onSelected(event.target.checked)}}            
            sx = {others}
        />
    )
}