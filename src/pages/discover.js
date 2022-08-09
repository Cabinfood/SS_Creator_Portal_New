import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import {Box,Container,Typography} from "@mui/material";
import { AuthGuard } from "../components/authentication/auth-guard";
import { DashboardLayout } from "../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../lib/gtm";
import { AuthProvider } from "../contexts/auth-context";
import cookieLib from "../lib/cookie.lib";

const Discover = () => {
	const token = cookieLib.getCookie("token")
	const router = useRouter()

	useEffect(() => {
		gtm.push({ event: "page_view" });
		initialize()
	}, []);

	const initialize = async() => {

	}

	return (
		<>
			<Head>
				<title>Discover | sand.so</title>
			</Head>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 8,
				}}
			>
				<Container maxWidth="xl">						
					<Box>
						<Typography variant="h5">Discover,</Typography>
					</Box>					
				</Container>
			</Box>
		</>
	);
};

Discover.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default Discover;
