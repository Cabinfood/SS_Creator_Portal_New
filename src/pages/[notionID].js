import Head from "next/head";
import { AuthProvider } from "../contexts/auth-context";
import { AuthGuard } from "../components/authentication/auth-guard";
import { DashboardLayout } from "../layout/dashboard-layout/dashboard-layout";
import { Render } from '@9gustin/react-notion-render'
import documentsRepo from "../api-server/notion/repos/documents.repo";
import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import DocumentsApiClient from "../api-clients/document.api-client";
import { NotionRenderer } from 'react-notion-x'
import cookieLib from "../lib/cookie.lib";

const DocumentDetailIndex = (props) => {
    const token = cookieLib.getCookie("token")
    const {pageNotionID, ...others} = props
    const [pageNotion, setPageNotion] = useState()
    
    useEffect(()=>{
        initialize()
    },[])

    const initialize = async() => {
        const response = await DocumentsApiClient.getPage(token, pageNotionID)
        const {data: pageNotion} = response
        setPageNotion(pageNotion)        
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
					py: 8,
				}}
			>
				<Container maxWidth="md">	
                    {/* <Render blocks={pageNotion} slugifyFn={text => text.replace(/[^a-zA-Z0-9]/g,'_')} /> */}
                    <NotionRenderer recordMap={pageNotion} fullPage={true} darkMode={false} />
                </Container>    
            </Box>
            
        </>
        
    )

}

export async function getServerSideProps(context) {    
    const pageNotionID = context.params.notionID;
    
	return {
		props: {
            pageNotionID
		}, // will be passed to the page component as props
	}
}

DocumentDetailIndex.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default DocumentDetailIndex;