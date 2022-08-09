import { Fragment, useState } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { X as XIcon } from '../../icons/x';
import { Tip } from '../tip';
import { FacebookProvider, Comments } from 'react-facebook';
import { FB_APP_ID } from '../../constant';

export default function CaptchaDialog(props) {
    const { onClose, open, onSubmit, captchaValue, contentID, ...other } = props;
    const [isWorking, setIsWorking] = useState(false)
    const [value, setValue] = useState('');

    const handleSubmit = async(event) => {
        setIsWorking(true)
        event.preventDefault();
        
        if (isWorking) return;
        if ( parseInt(value) === captchaValue) {
            onSubmit()
        }
        else {
            alert("Sai Captcha vui lòng nhập lại.")
            setIsWorking(false)
        } 
    }
    
    return (        
        <Dialog
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
            {...other}>
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
                <Typography variant="h6">Xác nhận CAPTCHA</Typography>
                
                <IconButton
                    color="inherit"
                    onClick={onClose}
                >
                    <XIcon fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent>                
                <Box>
                    <Typography variant='h1' textAlign="center">{captchaValue}</Typography>
                </Box>
                
                <form onSubmit={handleSubmit}>
                    <Tip message="Nhập thông tin captcha được cung cấp ở trên để xác nhận lệnh." />
                    <TextField
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                        label="Captcha"
                        type="number"
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Nhập mã captcha"
                        sx={{ mt: 3 }}
                        value={value}
                    />
                </form>      

                {isWorking && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            ml: 1,
                            mt: 1
                        }}
                    >
                        <CircularProgress size={30}/>
                    </Box>
                )}        
                <Box my={3}>
                    <FacebookProvider appId={FB_APP_ID}>
                        <Comments href={`https://www.sand.so/contents/${contentID}`} />
                    </FacebookProvider>
                </Box>        
            </DialogContent>
        </Dialog>
    )

}