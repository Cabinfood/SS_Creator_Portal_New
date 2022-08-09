import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {Box,Container,Grid,Typography} from "@mui/material";
import { AuthGuard } from "../components/authentication/auth-guard";
import { DashboardLayout } from "../layout/dashboard-layout/dashboard-layout";
import { AuthProvider } from "../contexts/auth-context";

const Overview = () => {
	const router = useRouter()
	const [resources, setResources] = useState()

	useEffect(() => {
		router.push("/newsfeed")
		// initialize()
	}, []);

	return (
		<>
			<Head>
				<title>Dashboard: Growth | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>				
			</Box>
		</>
	);
};

Overview.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default Overview;
