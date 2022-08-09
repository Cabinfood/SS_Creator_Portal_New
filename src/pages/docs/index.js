import Head from "next/head";
import { AuthProvider } from "../../contexts/auth-context";
import { AuthGuard } from "../../components/authentication/auth-guard";
import { DashboardLayout } from "../../layout/dashboard-layout/dashboard-layout";
import { Box, Container } from "@mui/material";
import DocumentsApiClient from "../../api-clients/document.api-client";
import cookieLib from "../../lib/cookie.lib";
import { useEffect, useState } from "react";
import { NotionRenderer } from 'react-notion-x'
import { Render } from '@9gustin/react-notion-render'

const DocumentIndex = (props) => {
    const token = cookieLib.getCookie("token")
    const {...others} = props
    
    const [blocksRender, setBlocksRender] = useState()

    useEffect(() => {
        initialize()
    },[])
    
    const initialize = async() => {
        const response = await DocumentsApiClient.home(token)
        console.log(response)
        const {data: recordMap} = response
        setBlocksRender(recordMap)        
    }

    return (
        <>
            <Head>
                <title>Thư viện | sand.so</title>
            </Head>            
            <Box
				component="main"
				sx={{
					flexGrow: 1,
					py: 4,              
                    px: 1      
				}}
			>
				<Container maxWidth="md" sx={{
                    backgroundColor: "white",
                    minHeight: "100vh",
                    borderRadius: "10px"
                }}>	
                    {/* <Render blocks={blocksRender} simpleTitles emptyBlocks/> */}
                    <NotionRenderer recordMap={blocksRender} fullPage={false} darkMode={false} />
                </Container>    
            </Box>
            
        </>
        
    )

}

DocumentIndex.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default DocumentIndex;