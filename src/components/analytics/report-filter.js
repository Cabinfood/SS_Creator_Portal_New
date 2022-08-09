import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Checkbox, Divider, Drawer, FormControlLabel, FormGroup, IconButton, InputAdornment, Stack, Switch, TextField, Typography, useMediaQuery} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/lab';
import { Search as SearchIcon } from '../../icons/search';
import { X } from '../../icons/x';
import { Scrollbar } from '../scrollbar';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import PartnerApiClient from '../../api-clients/partner.api-client';
import cookieLib from '../../lib/cookie.lib';

// const partnerCreators = [
//     'Blind Spots Inc.',
//     'Dispatcher Inc.',
//     'ACME SRL',
//     'Novelty I.S',
//     'Beauty Clinic SRL',
//     'Division Inc.'
// ];

const FiltersDrawerDesktop = styled(Drawer)({
    flexShrink: 0,
    width: 380,
    '& .MuiDrawer-paper': {
      position: 'relative',
      width: 380
    }
  });
  
  const FiltersDrawerMobile = styled(Drawer)({
    maxWidth: '100%',
    width: 380,
    '& .MuiDrawer-paper': {
      height: 'calc(100% - 64px)',
      maxWidth: '100%',
      top: 64,
      width: 380
    }
  });

const ReportFilter = (props) => {
    const token = cookieLib.getCookie("token")
    const { containerRef, filters = {},onSubmit, onChange, onClose, open,isBusy, ...other } = props;
    const queryRef = useRef(null);
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const [partnerCreators, setPartnerCreators] = useState([])

    useEffect(()=>{
        getPartnerCreator()
    },[])

    const handleQueryChange = (event) => {
        event.preventDefault();
        onChange?.({
          ...filters,
          query: queryRef.current?.value
        });
    };

    const handleStartDateChange = (date) => {
        const newFilters = {
          ...filters,
          startDate: date
        };
    
        // Prevent end date to be before start date
        if (newFilters.endDate && date && date > newFilters.endDate) {
          newFilters.endDate = date;
        }
    
        onChange?.(newFilters);
    };

    const handleEndDateChange = (date) => {
        const newFilters = {
          ...filters,
          endDate: date
        };
    
        // Prevent start date to be after end date
        if (newFilters.startDate && date && date < newFilters.startDate) {
          newFilters.startDate = date;
        }
    
        onChange?.(newFilters);
    };

    const handlePartnerChange = (event) => {
        if (event.target.checked) {
          onChange?.({
            ...filters,
            partner: [...(filters.partner || []), event.target.value]
          });
        } else {
          onChange?.({
            ...filters,
            partner: (filters.partner || []).filter((partner) => partner !== event.target.value)
          });
        }
    };

    const getPartnerCreator = async() => {
        const response = await PartnerApiClient.all(token)
        console.log("partner: ", response?.data)
        setPartnerCreators(response?.data)
    }

    const content = (
        <Box
            sx={{
                pb: 3,
                pt: {
                    xs: 3,
                    lg: 8
                },
                px: 3
            }}
        >
            <Box
                sx={{
                display: {
                    lg: 'none'
                },
                mb: 2
                }}
            >
                <IconButton onClick={onClose}>
                <X fontSize="small" />
                </IconButton>
            </Box>
            <Box
                component="form"
                onSubmit={handleQueryChange}
            >
                <TextField
                    defaultValue=""
                    fullWidth
                    inputProps={{ ref: queryRef }}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                        )
                    }}
                    label="Search"
                    placeholder="Search by object number"
                />
            </Box>
        
            <Typography
                color="textSecondary"
                sx={{ mt: 3 }}
                variant="subtitle2"
            >
                Issue date
            </Typography>
            
            <Stack
                spacing={2}
                sx={{ mt: 2 }}
            >
                <MobileDatePicker
                    label="From"
                    inputFormat="dd/MM/yyyy"
                    value={filters?.startDate}
                    onChange={(value)=>{
                        console.log(value)
                        handleStartDateChange(value)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <MobileDatePicker
                    label="To"
                    inputFormat="dd/MM/yyyy"
                    value={filters?.endDate}
                    onChange={(value)=>{
                        console.log(value)
                        handleEndDateChange(value)
                        
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
            
            <Typography
                color="textSecondary"
                sx={{ mt: 3 }}
                variant="subtitle2"
            >
                From Creator
            </Typography>
            <Box
                sx={{
                backgroundColor: 'background.default',
                borderColor: 'divider',
                borderRadius: 1,
                borderStyle: 'solid',
                borderWidth: 1,
                mt: 2
                }}
            >
                <Scrollbar sx={{ maxHeight: 200 }}>
                    <FormGroup
                        sx={{
                            py: 1,
                            px: 1.5
                        }}
                    >
                        {partnerCreators.map((partner) => (
                        <FormControlLabel
                            control={(
                                <Checkbox
                                    checked={filters.partner?.includes(partner?.id)}
                                    onChange={handlePartnerChange}
                                />
                            )}
                            key={partner?.id}
                            label={partner?.name}
                            value={partner?.id}
                        />
                        ))}
                    </FormGroup>
                </Scrollbar>
            </Box>
            
            <Divider sx={{
                marginY: 3
            }}/>
            <Button 
                variant='outlined'
                onClick={onSubmit}
                disabled = {isBusy}
            >
                Submit
            </Button>
        </Box>
    );

      
    if (lgUp) {
        return (
        <FiltersDrawerDesktop
            anchor="left"
            open={open}
            SlideProps={{ container: containerRef?.current }}
            variant="persistent"
            {...other}
        >
            {content}
        </FiltersDrawerDesktop>
        );
    }

    return (
        <FiltersDrawerMobile
            anchor="left"
            ModalProps={{ container: containerRef?.current }}
            onClose={onClose}
            open={open}
            SlideProps={{ container: containerRef?.current }}
            variant="temporary"
            {...other}
        >
            {content}
        </FiltersDrawerMobile>
    );
}

export default ReportFilter