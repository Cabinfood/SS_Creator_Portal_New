import { useState, useEffect } from 'react';
import { Box, Button, Link} from "@mui/material"
import WrapperModal from '../modals/wrapper.modal';
import { CreateContentForm } from '../content/create-form';
import AlertDialog from '../dialog/alert.dialog';
import { useAuth } from '../../hooks/use-auth';
import { MEMBER_TIER } from '../../constant';

export default function CreateNewContentButton(props) {    
    const {title, ...other} = props
    const {user} = useAuth()
    const [isShowModal, setShowModal] = useState(false)
    const [isWorking, setIsWorking] = useState(false)
    const [waringClose, setWarningClose] = useState(false)
    const [showAlertModal, setShowAlertModal] = useState(false)

    const closeModal = () => {
        if (isWorking) return;
        if (waringClose) {
            setShowAlertModal(true)
            return;
        }
        setShowModal(false)
    }

    return (        
        <div 
            className="create-new-content-button" 
            {...other}
        >
            {(user?.tier === MEMBER_TIER.MASTER_ADMIN || user?.tier === MEMBER_TIER.EDITOR_SPECIALIST || user?.tier === MEMBER_TIER.GROWTH_LEADER) && (
                <Box>
                    <Button 
                        variant="contained" 
                        size="small" 
                        sx={{                    
                            minWidth: "50px"
                        }}
                        onClick={()=>{setShowModal(true)}}
                    >                   
                        {title ? title : "Thêm nội dung"}
                    </Button>
                    
                    <WrapperModal 
                        isShowModal = {isShowModal}
                        handleClosed = {()=> {closeModal()}}
                    >
                        <CreateContentForm 
                            onSuccess = {() => setShowModal(false)}
                            onPreventClose = {(status)=>{setIsWorking(status)}}
                            onWarningClose = {(status)=>{setWarningClose(status)}}
                        />
                        
                        <AlertDialog 
                            title = "Cảnh báo quan trọng"
                            message = "Dữ liệu hiện tại của bạn sẽ bị mất khi đóng trang tạo nội dung này."
                            agreeTitle = "Xác nhận"
                            disagreeTitle = "Hủy"

                            open = {showAlertModal}
                            onAgree = {()=>{
                                setShowModal(false)
                                setWarningClose(false)
                                setShowAlertModal(false)
                                setIsWorking(false)
                            }}
                            onDisagree = {()=>{setShowAlertModal(false)}}
                            handleClose = {()=>{setShowAlertModal(false)}}
                        />
                        
                        
                    </WrapperModal>
                </Box>
            )}            
        </div>
    )

}