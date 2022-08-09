import { Autocomplete, Box,IconButton,Stack,TextField,Typography, CircularProgress, Button, Divider} from '@mui/material';
import { param } from 'jquery';
import { useCallback, useEffect, useState } from 'react';
import ContentsNotionApiClient from '../../api-clients/contents.api-client';
import IPReferenceApiClient from '../../api-clients/ip-reference.api-client';
import { X as XIcon } from '../../icons/x';
import cookieLib from '../../lib/cookie.lib';

const ContentEditForm = (props) => {
    const token = cookieLib.getCookie("token")
    const { onCancel, onSave, content } = props;
    const [listReference, setListReference] = useState(null)
    const [isWorking, setIsWorking] = useState(false)
    const [referenceIPSelected, setReferenceIPSelected] = useState(null)

    useEffect(()=>{
        initialize()
    },[])

    const initialize = async() => {
        if (isWorking) return;
        setIsWorking(true)
        const response = await IPReferenceApiClient.all(token)
        const data = response?.data?.data?.results
        console.log("response: ", data.find(option => option.id === content?.reference_ip?.id))
        setListReference(response?.data?.data?.results)
        setIsWorking(false)
    }
    
    const checkValid = () => {
        if (referenceIPSelected === null) {
            alert("Chưa chọn tham chiếu")
            return false
        }
        return true;
    }

    const handleSubmit = async() => {        
        if (isWorking) return;
        checkValid()

        setIsWorking(true)
        const response = await ContentsNotionApiClient.update(token, content?.id, referenceIPSelected?.id)
        console.log("udpate response: ", response)
        onSave()
        setIsWorking(false)
    }

    return (
        <>            
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
                <Typography
                    color="inherit"
                    variant="h6"
                >
                    {content?.title}
                </Typography>
                <IconButton
                    color="inherit"
                    onClick={onCancel}
                >
                    <XIcon fontSize="small" />
                </IconButton>
            </Box>

            <Box
                sx={{
                    px: 3,
                    py: 4
                }}
            >                                
                <Box
                    sx={{
                        alignItems: 'center',
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'neutral.800'
                        : 'neutral.100',
                        borderRadius: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        px: 3,
                        py: 2.5,
                        mb: 2
                    }}
                >
                    <Typography
                        color="textSecondary"
                        sx={{ mr: 2 }}
                        variant="overline"
                    >
                        Actions
                    </Typography>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexWrap: 'wrap',
                            m: -1,
                            '& > button': {
                                m: 1
                            }
                        }}
                    >
                        
                        <Button
                            onClick={handleSubmit}
                            size="small"
                            variant="contained"
                        >
                        Approve
                            {isWorking && <CircularProgress size={10} />}
                        </Button>
                        <Button
                            onClick={onCancel}
                            size="small"
                            variant="outlined"
                        >
                        Cancel
                        </Button>
                    </Box>
                </Box>

                <Box sx={{
                    marginTop: 3
                }}>
                    <Box>
                        <Typography variant="h6" paddingBottom={3}>
                            Video có sử dụng bản quyền ?
                        </Typography>
                        {isWorking && (<CircularProgress size={20}/>)}
                        {listReference && (
                            <Autocomplete
                                freeSolo
                                options={listReference}
                                getOptionLabel = {option => option.title}
                                defaultValue = {listReference.find(option => option.id === content?.reference_ip?.id)}
                                renderInput = {(params) => <TextField {...params} label="Tham chiếu" />}
                                onChange = {(event, value)=>{setReferenceIPSelected(value)}}
                            />
                        )}                        

                    </Box>                    
                </Box>
                
            </Box>
        </>
    )
}

export default ContentEditForm;