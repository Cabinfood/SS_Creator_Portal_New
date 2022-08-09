import { useState, useEffect, useCallback, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { endOfDay, startOfDay } from 'date-fns';
import cookieLib from "../../lib/cookie.lib";
import { gtm } from "../../lib/gtm";

import Head from 'next/head';
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { AuthProvider } from "../../contexts/auth-context";
import { useMounted } from '../../hooks/use-mounted';

import { Filter as FilterIcon } from '../../icons/filter';
import { Plus as PlusIcon } from '../../icons/plus';
import ReportFilter from '../../components/analytics/report-filter';
import {Box,Button,CircularProgress,FormControlLabel,Grid,Switch,Typography,useMediaQuery} from '@mui/material';
import ReportListTable from '../../components/analytics/report-list-table';
import AnatlyticsApiClient from '../../api-clients/analytics.api-client';
import ReportApiClient from '../../api-clients/report.api-client';

const ReportListInner = styled('div',
  { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    zIndex: 1,
    [theme.breakpoints.up('lg')]: {
      marginLeft: -380
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      [theme.breakpoints.up('lg')]: {
        marginLeft: 0
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
}));

const Report = (props) => {
    const token = cookieLib.getCookie("token")
    const isMounted = useMounted();
    const rootRef = useRef(null);
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'), { noSsr: true });
    const [isWorking, setIsWorking] = useState(false)
    const [openFilters, setOpenFilters] = useState(mdUp);
    const [group, setGroup] = useState(false);
    const [onlyMoneitized, setOnlyMoneitized] = useState(false);
    const [objects, setObjects] = useState([]);
    const [objectsByChannel, setObjectsByChannel] = useState()
    const [filters, setFilters] = useState({
        query: '',
        startDate: new Date(),
        endDate: new Date(),
        partner: [],
        isOnlyMoneitized: false
    });

    useEffect(()=>{
        // loadDataSummary(new Date())
    },[])

    const loadDataSummary =  useCallback(async(date)=>{
		if (isWorking) return;
		setIsWorking(true)
		// reset()
        
		const res = await ReportApiClient.getSummary(token, date)		
		
        if (res?.success) {
            const {data} = res
            const {contents, posts} = data
            console.log("posts: ", posts)
			setObjects(posts)
			
        }
		setIsWorking(false)
	},[isMounted])

    const handleChangeGroup = (event) => {
        setGroup(event.target.checked);
    };
    const handleToggleFilters = () => {
        setOpenFilters((prevState) => !prevState);
    };
    
    const handleChangeFilters = (newFilters) => {
        setFilters(newFilters);
    };
    
    const handleCloseFilters = () => {
        setOpenFilters(false);
    };    

    const handleSubmit = async() => {
        if (isWorking) return
        setObjects([])
        setIsWorking(true)
        const dataRes = await ReportApiClient.query(token, filters?.query, [filters?.startDate, filters?.endDate], filters?.partner)
        console.log(filters?.startDate, filters?.endDate, dataRes?.data)
        setObjects(dataRes?.data)
        setIsWorking(false)
    }
    
    return(
        <>
            <Head>
                <title>
                    Report | sand.so
                </title>
            </Head>
            <Box
                component="main"
                ref={rootRef}
                sx={{
                backgroundColor: 'background.default',
                display: 'flex',
                flexGrow: 1,
                overflow: 'hidden'
                }}
            >
                <ReportFilter 
                    containerRef={rootRef}
                    filters={filters}
                    onChange={handleChangeFilters}
                    onClose={handleCloseFilters}
                    onSubmit = {handleSubmit}                    
                    open={openFilters}
                    isBusy = {isWorking}
                />
                
                {/* REPORT LIST INNER */}
                <ReportListInner open={openFilters}>
                    <Box sx={{ mb: 3 }}>
                        <Grid
                            container
                            spacing={3}
                            justifyContent="space-between"
                        >
                            <Grid item>
                                <Typography variant="h4">Report</Typography>
                            </Grid>
                            
                            <Grid
                                item
                                sx={{ m: -1 }}
                            >
                                <Button
                                    endIcon={<FilterIcon fontSize="small" />}
                                    onClick={handleToggleFilters}
                                    sx={{ m: 1 }}
                                    variant="outlined"
                                >
                                Filters
                                </Button>
                                <Button
                                    startIcon={<PlusIcon fontSize="small" />}
                                    sx={{ m: 1 }}
                                    variant="contained"
                                >
                                New
                                </Button>
                            </Grid>
                        </Grid>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 3
                            }}
                        >
                            <FormControlLabel
                                control={(
                                    <Switch
                                        checked={group}
                                        onChange={handleChangeGroup}
                                    />
                                    )}
                                label="Show groups"
                            />
                            <FormControlLabel
                                control={(
                                    <Switch
                                        checked={onlyMoneitized}
                                        onChange={()=>setOnlyMoneitized((prev)=> !prev)}
                                    />
                                )}
                                label="Show paid only"
                            />
                        </Box>
                    </Box>
                    {isWorking && <CircularProgress size={20} />}
                    <ReportListTable 
                        group={group}
                        invoices={objects}
                        // invoicesCount={filteredInvoices.length}
                        // onPageChange={handlePageChange}
                        // onRowsPerPageChange={handleRowsPerPageChange}
                        // page={page}
                        // rowsPerPage={rowsPerPage}
                    />
                </ReportListInner>

            </Box>
        </>
    )
}




Report.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default Report