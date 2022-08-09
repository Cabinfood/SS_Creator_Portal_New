import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useMounted } from '../../hooks/use-mounted';

import { styled } from '@mui/material/styles';
import Head from "next/head";
import {Box, Container,Typography, Grid, MenuItem, Button, TextField, CircularProgress} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../lib/gtm";
import { AuthProvider } from "../../contexts/auth-context";
import cookieLib from "../../lib/cookie.lib";
import IPsApiClient from "../../api-clients/ips.api-client";
import { Plus as PlusIcon } from '../../icons/plus';
import IPListTable from "../../components/ips/iplist-table";
import IPDrawer from "../../components/drawer/ip-drawer";

const _ = require("lodash"); 

const IPListInner = styled('div',
  { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    overflow: 'hidden',
    // paddingBottom: theme.spacing(8),
    // paddingTop: theme.spacing(8),
    zIndex: 1,
    [theme.breakpoints.up('lg')]: {
      marginRight: -500
    },
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
      [theme.breakpoints.up('lg')]: {
        marginRight: 0
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    })
}));


const IPs = () => {
	const isMounted = useMounted();
	const token = cookieLib.getCookie("token")
	const rootRef = useRef(null);

	const [listIps, setListIps] = useState([])

	const [drawer, setDrawer] = useState({
		isOpen: false,
		ipID: undefined
	});

	useEffect(() => {
		gtm.push({ event: "page_view" });
		initialize()
	}, []);

    const initialize = useCallback(async() => {
        console.log("init")
        const res = await IPsApiClient.all(token)
        if (res.success) {
            console.log(res)
			setListIps(res?.data?.data?.results)
        } else {
            console.log("error: ")
        }        
    },[isMounted])

	const handleOpenDrawer = (ipID) => {
		setDrawer({
		  isOpen: true,
		  ipID: ipID
		});
	  };
	
	const handleCloseDrawer = () => {
		setDrawer({
			isOpen: false,
			ipID: undefined
		});
	};

	const handleAddNewIP = () => {
		setDrawer({
			isOpen: true,
			ipID: undefined
		})
	}

	return (
		<>
			<Head>
				<title>IPs | sand.so</title>
			</Head>
			<Box
				component="main"
				ref={rootRef}
				sx={{
					backgroundColor: 'background.paper',
					display: 'flex',
					flexGrow: 1,
					overflow: 'hidden',
					// padding: "48px 0px"
				}}
			>
				<IPListInner open={drawer.isOpen}>
					<Box sx={{p: 3}}>
						<Grid
							container
							justifyContent="space-between"
							spacing={3}
						>
							<Grid item>
								<Typography variant="h4">IPs Studio </Typography>
							</Grid>
							<Grid item>
								<Button variant="contained" onClick={handleAddNewIP}> Add</Button>
							</Grid>
						</Grid>
					</Box>
					<IPListTable
						onOpenDrawer={handleOpenDrawer}
						// onPageChange={handlePageChange}
						// onRowsPerPageChange={handleRowsPerPageChange}
						ips={listIps}
						// ordersCount={filteredOrders.length}
						// page={page}
						// rowsPerPage={rowsPerPage}
					/>
				</IPListInner>					
				
				<IPDrawer
					containerRef={rootRef}
					onClose={handleCloseDrawer}
					open={drawer.isOpen}
					ipSelected={listIps.find((ip) => ip.id === drawer.ipID)}
					onCreateNewIpSuccess = {(value)=>{
						console.log("create ip success: ", value)
						setListIps([value, ...listIps])
						setDrawer({
							isOpen: false
						})
					}}
				/>
			</Box>
		</>
	);
};

IPs.getLayout = (page) => (
	<AuthProvider>		
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>		
	</AuthProvider>
);

export default IPs;
