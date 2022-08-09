import { useEffect, useState } from "react";

import Head from "next/head";
import {Box, Container, Tabs, Tab, Typography, Divider, Link, Button} from "@mui/material";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { AccountGeneralSettings } from '../../components/dashboard/account/account-general-settings';
import { AccountBillingSettings } from '../../components/dashboard/account/account-billing-settings';

import { gtm } from "../../lib/gtm";
import { AuthProvider } from "../../contexts/auth-context";

const tabs = [
    { label: 'Thông tin', value: 'general' },
    { label: 'Ví điện tử', value: 'wallet' },
    { label: 'Team', value: 'team' },
    { label: 'Thông báo', value: 'notifications' },
    { label: 'Bảo mật', value: 'security' }
];

const Setting = () => {	
	const [currentTab, setCurrentTab] = useState('general');

	useEffect(() => {
	  gtm.push({ event: 'page_view' });
	}, []);
  
	const handleTabsChange = (event, value) => {
	  setCurrentTab(value);
	};

	return (
		<>
			<Head>
				<title>Account | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				
				<Container maxWidth="md">
					<Typography variant="h4">
						Account
					</Typography>
					<Tabs
						indicatorColor="primary"
						onChange={handleTabsChange}
						scrollButtons="auto"
						textColor="primary"
						value={currentTab}
						variant="scrollable"
						sx={{ mt: 3 }}
					>
						{tabs.map((tab) => (
						<Tab
							key={tab.value}
							label={tab.label}
							value={tab.value}
						/>
						))}
					</Tabs>
					<Divider sx={{ mb: 3 }} />
					{currentTab === 'general' && <AccountGeneralSettings />}
					{currentTab === 'wallet' && <AccountBillingSettings />}
					{/* {currentTab === 'team' && <AccountTeamSettings />}
					{currentTab === 'notifications' && <AccountNotificationsSettings />}
					{currentTab === 'security' && <AccountSecuritySettings />} */}
				</Container>
			</Box>
		</>
	);
};

Setting.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default Setting;
