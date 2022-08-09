import { AuthProvider } from "../../../contexts/auth-context";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../layout/dashboard-layout/dashboard-layout";
import Head from "next/head";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import { CreateContentForm } from "../../../components/content/create-form";

const NewContent = () => {
    return (
        <>
        
            <Head>
				<title>New Content | sand.so</title>
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
                        <Typography variant="h4" sx={{mb: 2}}>Create new Content</Typography>
                        <CreateContentForm />
                    </Box>
                    
				</Container>
			</Box>
        </>
    )
}

NewContent.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default NewContent;

