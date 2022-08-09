import { useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Card, Container, Divider, Link, Typography } from "@mui/material";
import { GuestGuard } from "../../components/authentication/guest-guard";
import { Logo } from "../../components/logo";
import { useAuth } from "../../hooks/use-auth";
import { gtm } from "../../lib/gtm";
import {AuthProvider} from '../../contexts/auth-context'
import { CeAccessAccountViaCabinID, CE_ICON_TYPE } from "@cabineat/ui-react";

const AuthAccess = () => {
	const { platform, access } = useAuth();
	const [isFetching, setFetching] = useState(false)
	useEffect(() => {
		gtm.push({ event: "page_view" });	
	}, []);

	return (
		<>
		<Head>
			<title>Access Account | Boxlink</title>
		</Head>
		<Box
			component="main"
			sx={{
			backgroundColor: "background.default",
			display: "flex",
			flexDirection: "column",
			minHeight: "100vh",
			}}
		>
			{/* <AuthBanner /> */}
			<Container
			maxWidth="sm"
			sx={{
				py: {
				xs: "60px",
				md: "120px",
				},
			}}
			>
				<Box
					sx={{
						alignItems: "center",
						backgroundColor: (theme) =>
							theme.palette.mode === "dark" ? "neutral.900" : "neutral.100",
						borderColor: "divider",
						borderRadius: 1,
						borderStyle: "solid",
						borderWidth: 1,
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "space-between",
						mb: 4,
						p: 2,
						"& > img": {
							height: 32,
							width: "auto",
							flexGrow: 0,
							flexShrink: 0,
						},
					}}
				>
					<Typography color="textSecondary" variant="caption">The app authenticates via CabinID</Typography>
					<img
						alt="Auth platform"
						src="https://cabinid.com/assets/img/logo/logo-full.svg"
					/>
					
				</Box>
					
			
				<Card elevation={16} sx={{ p: 4 }}>
					<Box
						sx={{
							alignItems: "center",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<NextLink href="/" passHref>
							<a>
							<Logo
								sx={{
									height: 40,
									width: 40,
								}}
							/>
							</a>
						</NextLink>
						
						<Typography variant="h4">Log in</Typography>

						<Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
							Sign in on the internal platform
						</Typography>
					
						<Box sx={{
							alignItems: "center",
							borderColor: "divider",
							borderRadius: 1,
							p: 2,			
						}}>
							<CeAccessAccountViaCabinID
								appId="002"
								env="prod"
								mode="dialog"				
								label="Đăng nhập tài khoản"
								callback= {(success, atk, profile)=>{
									setFetching(true)
									// console.log(success, atk, profile)
									if (success === 1) {
										access(atk, profile)
									}
								}}													
								buttonProps={isFetching ? {
									suffixIcon: {
										type: CE_ICON_TYPE.LOADING
									}
								}: null}
							/>
						</Box>
					</Box>						
				</Card>
			</Container>
		</Box>
		</>
	);
};

AuthAccess.getLayout = (page) => <AuthProvider>
<GuestGuard>{page}</GuestGuard>
</AuthProvider> ;

export default AuthAccess;
