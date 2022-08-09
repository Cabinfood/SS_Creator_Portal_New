import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useMounted } from '../../hooks/use-mounted';
import IPsApiClient from "../../api-clients/ips.api-client"
import MemberApiClient from "../../api-clients/member.api-client"
import cookieLib from "../../lib/cookie.lib"
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro';
// import MobileDateRangePicker from '@mui/x-date-pickers-pro/MobileDateRangePicker';

const NewIPForm = (props) => {
    const isMounted = useMounted();
    const {onApprove, onReject, ...other} = props
    const token = cookieLib.getCookie("token")
    const [partners, setPartners] = useState()
    const [partnerSelected, setPartnerSelected] = useState(null)
    const [title, setTitle] = useState()
    const [authorizedFrom, setAuthorizedFrom] = useState(new Date())
    const [authorizedExpired, setAuthorizedExpired] = useState(new Date())
    const [isWorking, setIsWorking] = useState(false)
    // const [value, setValue] = useState([new Date(), new Date()]);

    useEffect(()=>{
        initialize()
    },[])

    const initialize = useCallback(async() => {
        const partnerRes = await MemberApiClient.getPartner(token) 
        console.log("partnerRes: ", partnerRes)
        setPartners(partnerRes?.data)
        setPartnerSelected(partnerRes?.data?.[0]?.id)
    },[isMounted])

    const checkValid = () => {
        if (title?.length === 0) return false
        if (authorizedExpired === null || authorizedFrom === null) return false
        return true
    }

    const handleSubmit = async() => {
        if (isWorking) return;
        if (checkValid() === false) alert("Thông tin chưa chính xác")        
        
        setIsWorking(true)
        const createRes = await IPsApiClient.createIP(token, title, partnerSelected, authorizedFrom, authorizedExpired )
        console.log("create Res: ", createRes)
        if (createRes?.data?.error === false) {
            const ipCreated = createRes?.data?.data
            onApprove({
                id: ipCreated?.id,
                title: ipCreated.properties?.title?.title?.[0]?.plain_text,
                status: "AUTHORIZED",
                ipReference: ipCreated.properties?.ip_references?.relation,
                tags: ipCreated.properties?.tags?.multi_select,
                typeOfFile: ipCreated.properties?.tags?.select,                
                owner: ipCreated.properties?.owner || [],
                ownerName: ipCreated?.properties?.owner_name?.rollup?.array?.[0]?.title?.[0]?.plain_text,
                authorizeFrom: ipCreated?.properties?.authorize_from?.date?.start,
                authorizeExpired: ipCreated?.properties?.authorize_expired?.date?.start,
                earning: 0,
                ipReferenceURL: ipCreated.properties?.ip_reference_url?.rollup?.array,
                ipReferenceTitle: ipCreated.properties?.ip_reference_title?.rollup?.array
            })  
        }
        setIsWorking(false)
        
    }


    // const handleChange = ([newStartDate, newEndDate]) => {
    //     console.log(newEndDate);
    //     setValue([newStartDate, newEndDate]);
    // }

    
    return(
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
                        onClick={onReject}
                        size="small"
                        variant="outlined"
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
                    label="Partner"
                    margin="normal"
                    name="partner"
                    select
                    SelectProps={{ native: true }}
                    onChange={(event)=>{
                        console.log("select: ", event.target.value)
                        setPartnerSelected(event.target.value)
                    }}
                >
                    {(partners || []).map((item) => (
                        <option
                            key={item.id}
                            value={item.id}
                        >
                            {item.name}
                        </option>
                    ))}
                </TextField>

                <Box sx={{
                    my: 2
                }}>
                    <Typography component="p">Authorized from</Typography>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: "center",
                            gap: 1,
                            my: 1.5
                        }}
                    >
                        <MobileDatePicker
                            label="Start"
                            inputFormat="dd/mm/yyyy"
                            value={authorizedFrom}
                            onChange={(value)=>{
                                setAuthorizedFrom(value)
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        <MobileDatePicker
                            label="End"
                            inputFormat="dd/mm/yyyy"
                            value={authorizedExpired}
                            onChange={(value)=>{
                                setAuthorizedExpired(value)
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />

                        {/* <MobileDateRangePicker 
                            startText="Start"
                            endText="End"
                            value={value}
                            onChange = {handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        /> */}

                    </Box>                    
                </Box>
                
            </Box>
            
        </>
    )
}

export default NewIPForm