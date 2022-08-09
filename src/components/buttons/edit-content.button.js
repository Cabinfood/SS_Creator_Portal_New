import { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Drawer, Box, Typography, IconButton } from '@mui/material';
import ContentEditForm from "../content/edit-form"
import { useAuth } from '../../hooks/use-auth';
import { MEMBER_TIER } from '../../constant';


const EditContentButton = (props) => {
    const {user} = useAuth()    
    
    const {contentData, ...other} = props

    const rootRef = useRef(null);    
    const [drawer, setDrawer] = useState({
		isOpen: false,
		contentSelected: undefined
	});

    const handleOpenDrawer = (content) => {
		setDrawer({
		  isOpen: true,
		  contentSelected: content
		});
	  };
	
	const handleCloseDrawer = () => {
		setDrawer({
			isOpen: false,
			contentSelected: undefined
		});
	};

	const handleEditDrawer = () => {
		setDrawer({
			isOpen: true,
			contentSelected: undefined
		})
	}

    return (
        <Box 
            component="main"
            ref = {rootRef}
        >
            {(user?.notion_id === contentData?.editor_notion_id || user?.notion_id === contentData?.properties?.created_by?.relation?.[0]?.id || user?.tier === MEMBER_TIER.MASTER_ADMIN || user?.tier === MEMBER_TIER.GROWTH_LEADER) && (
                <Button variant='outlined' size='small' onClick={handleEditDrawer}>Edit</Button>
            )}
            
            <EditContentDrawer 
                containerRef = {rootRef}
                onClose = {handleCloseDrawer}
                open = {drawer?.isOpen}                
                contentSelected = {contentData}
            />
        </Box>
    )
}

const EditContentDrawer = (props) => {
    const {containerRef, open, onClose, contentSelected, ...other} = props
    console.log(contentSelected)
    
    const content = contentSelected 
    ? (
        <ContentEditForm 
            content = {contentSelected} 
            onCancel = {onClose}
            onSave = {onClose}
        />
        
    ): null
    
    return (
        <>
            <EditContentDrawerMobile
                anchor="right"
                ModalProps={{ container: containerRef?.current }}
                onClose={onClose}
                open={open}
                SlideProps={{ container: containerRef?.current }}
                variant="temporary"
                {...other}>
                {content}
            </EditContentDrawerMobile>
        </>        
        
    )
}

const EditContentDrawerMobile = styled(Drawer)({
    flexShrink: 0,
    maxWidth: '100%',
    height: 'calc(100% - 64px)',
    width: 500,
    '& .MuiDrawer-paper': {
        height: 'calc(100% - 64px)',
        maxWidth: '100%',
        top: 64,
        width: 500
    }
});

export default EditContentButton