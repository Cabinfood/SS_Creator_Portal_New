
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link} from "@mui/material"
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import WrapperModal from '../modals/wrapper.modal';
import { CreateContentForm } from '../content/create-form';

export default function AlertDialog(props) {    
    const {title, message, agreeTitle, disagreeTitle, onAgree, onDisagree, handleClose, open, ...other} = props        

    return (        
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDisagree} autoFocus>{disagreeTitle}</Button>
                <Button onClick={onAgree}> {agreeTitle}</Button>
            </DialogActions>
        </Dialog>
    )

}