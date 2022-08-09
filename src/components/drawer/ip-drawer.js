import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import {Box,Button,Divider,Drawer,IconButton,Card, Table,TableBody,TableCell,TableHead,TableRow,TextField,Typography,useMediaQuery, Link, CircularProgress} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import { X as XIcon } from '../../icons/x';
import { ExternalLink as ExternalLinkIcon } from '../../icons/external-link';
import { PropertyList } from '../property-list';
import { PropertyListItem } from '../property-list-item';
import { Scrollbar } from '../scrollbar';
import { format } from 'date-fns';
import NewIPForm from "../form/new-ip-form";
import IPReferenceApiClient from "../../api-clients/ip-reference.api-client";
import cookieLib from "../../lib/cookie.lib";
import { validURL } from "../../utils/sand-utils";
import $ from "jquery";

const IPDrawer = (props)=> {
    const { containerRef, onClose, open, ipSelected, onCreateNewIpSuccess, ...other } = props;
    
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    

    const content = ipSelected
    ? (
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
            {ipSelected.title}
          </Typography>
          <IconButton
            color="inherit"
            onClick={onClose}
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
            <IPPreview
                onApprove={onClose}
                // onAddReference={handleAddReference}
                onReject={onClose}
                ipSelected={ipSelected}
                lgUp={lgUp}
              />            
        </Box>
      </>
    )
    // : null;
    : (
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
              {'Add New IP'}
            </Typography>
            <IconButton
              color="inherit"
              onClick={onClose}
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
              <NewIPForm 
                onApprove = {(value)=>{
                    onCreateNewIpSuccess(value)
                }}
              />
          </Box>
        </>
      )

    if (lgUp) {
        return (
          <IPDrawerDesktop
            anchor="right"
            open={open}
            SlideProps={{ container: containerRef?.current }}
            variant="persistent"
            {...other}>
            {content}
          </IPDrawerDesktop>
        );
      }
    
    return (
        <IPDrawerMobile
            anchor="right"
            ModalProps={{ container: containerRef?.current }}
            onClose={onClose}
            open={open}
            SlideProps={{ container: containerRef?.current }}
            variant="temporary"
            {...other}>
            {content}
        </IPDrawerMobile>
    );
}

const IPDrawerDesktop = styled(Drawer)({
    width: 500,
    flexShrink: 0,
    height: 'calc(100% - 64px)',
    '& .MuiDrawer-paper': {
      position: 'relative',
      width: 500
    }
  });
  
const IPDrawerMobile = styled(Drawer)({
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

export default IPDrawer

IPDrawer.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  order: PropTypes.object
};



const IPPreview = (props) => {
    const { lgUp, onApprove, onReject, ipSelected } = props;
    const [isAddReference, setIsAddReference] = useState(false);
    const align = lgUp ? 'horizontal' : 'vertical';
    const token = cookieLib.getCookie("token")    
    const [isWorking, setIsWorking] = useState(false)

    const hanldeAddReference = () => {
        setIsAddReference(true)
    }

    const handleSubmit = async(title, url) => {
        if (isWorking) return;
        
        setIsWorking(true)
        const response = await IPReferenceApiClient.create(token, ipSelected?.id, title, url)
        console.log("add reference: ", response)
        const {data : newReference} = response?.data
        console.log(newReference)
        
        ipSelected.reference = [...ipSelected.reference, {
            id: newReference?.id,
            title: newReference?.properties?.title?.title?.[0]?.plain_text,
            url: newReference?.properties?.url?.rich_text?.[0]?.plain_text
        }]    
        
        setIsAddReference(false)
        setIsWorking(false)
    }

    return (
      <>        
        <Typography
          sx={{ my: 1.5 }}
          variant="h6"
        >
          IP Details
        </Typography>
        <PropertyList>
          <PropertyListItem
            align={align}
            disableGutters
            label="ID"
            value={ipSelected?.id}
          />
          <PropertyListItem
            align={align}
            disableGutters
            label="Title"
            value={ipSelected?.title}
          />
          <PropertyListItem
            align={align}
            disableGutters
            label="Authorized by"
          >
            <Typography
              color="primary"
              variant="body2"
            >
              {ipSelected?.ownerName}
            </Typography>            
          </PropertyListItem>
          <PropertyListItem
            align={align}
            disableGutters
            label="Authorized from"
            value={format(new Date(ipSelected?.authorizeFrom), 'dd/MM/yyyy HH:mm')}
          />
          <PropertyListItem
            align={align}
            disableGutters
            label="Authorized expired"
            value={format(new Date(ipSelected?.authorizeExpired), 'dd/MM/yyyy HH:mm')}
          />
          
          <PropertyListItem
            align={align}
            disableGutters
            label="Earning"
            value={`${ipSelected.earning.toLocaleString("VN-vi")} $`}
          />
          <PropertyListItem
            align={align}
            disableGutters
            label="Status"
            value={ipSelected?.status}
          />
        </PropertyList>
        <Divider sx={{ my: 3 }} />
        <Typography
          sx={{ my: 3 }}
          variant="h6"
        >
          Referrences
        </Typography>
        
        {!isAddReference 
        ?
        <>
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
                    my: 3
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
                        onClick={hanldeAddReference}
                        size="small"
                        variant="outlined"
                        startIcon={(
                            <PlusOneIcon fontSize="small" />
                        )}
                    >
                    Add
                    </Button>                                               
                </Box>            
            </Box>                    
        </>            
        :   
            <IPReferenceForm 
                onApprove = {(title, url) => {                    
                    handleSubmit(title, url)
                }}
                onReject = {() => setIsAddReference(false)}
                isBusy = {isWorking}
            />
        }

        <Scrollbar             
            sx={{
                my: 1.5
            }} 
        >
            {(ipSelected.reference || []).map((item, index) => (                
                <CardIPReference 
                    key = {item?.id}
                    title = {item?.title}
                    url = {item?.url}
                />
            ))}

            <div id="ip-reference-list-extra"></div>
            
        </Scrollbar>
        

        
        
        
      </>
    );
};

const IPReferenceForm = (props) => {
    const {onApprove, onReject, isBusy, ...other} = props    
    const [title, setTitle] = useState(null)
    const [url, setURL] = useState(null)

    const checkValid = () => {
        if (title.length === 0) return false
        return validURL(url)
    }
    const hanldeSubmit = () => {
        if (checkValid() === false) {
            alert("Vui lòng kiểm tra lại dữ liệu")
            return
        }
        onApprove(title, url)
    }

    return (
        <>
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
                    my: 3
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
                        onClick={hanldeSubmit}
                        size="small"
                        variant="contained"
                        disabled = {isBusy}
                    >
                    Approve
                    {isBusy && (<CircularProgress size={10} />)}
                    </Button>
                    <Button
                        onClick={onReject}
                        size="small"
                        variant="outlined"
                        disabled = {isBusy}
                    >
                    Cancel
                    </Button>
                    
                    
                </Box>
            </Box>

            <Box>
                <TextField
                    fullWidth
                    label="Title"
                    margin="normal"
                    name="title"
                    onChange={(event)=>{setTitle(event.target.value)}}
                />
                <TextField
                    fullWidth
                    label="URL (youtube/vimeo/google drive)"
                    margin="normal"
                    name="url"
                    onChange={(event)=>{setURL(event.target.value)}}
                />
            </Box>
            
        </>
        
    )
}

const CardIPReference = (props) => {
    const {title, url} = props
    return (
        <Card sx={{
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.mode === 'dark'
            ? 'neutral.800'
            : 'neutral.100',
            borderRadius: 1,
            px: 3,
            py: 2.5,
            my: 3
        }}>
            <Typography component="p" variant="h6">
                {title}
                {url && (
                    <Link href={url} target="_blank">
                        <ExternalLinkIcon sx={{
                            fontSize: "20px",
                            marginLeft: "5px"
                        }}/>
                    </Link>
                )}
                
            </Typography>                       
            <Typography variant="caption">
                {url}                                
            </Typography>
        </Card>
    )
}