import { Button, Card, Divider, Typography, Box, Link, CircularProgress, AppBar, Container, Tab, Tabs } from "@mui/material"
import NextLink from 'next/link';
import { Fragment, useEffect, useState } from "react"
import cookieLib from "../../../lib/cookie.lib";
import CollectionApiClient from "../../../api-clients/collection.api-client";

export const SuggestBarFragment = (props) => {
    const token = cookieLib.getCookie("token")    
    const {handleSelected, isBusy, ...other} = props
    const [isWorking, setIsWorking] = useState(false)
    const [currentTab, setCurrentTab] = useState()
    const [tabs, setTabs] = useState()

    useEffect(() => {
        initialize()
    },[])

    const initialize = async() => {	 
        if (isWorking) return;        
        let collectionRes = await CollectionApiClient.getAll(token)
        collectionRes.data.results.unshift({
            label: "All",
            value: "all"
        })
        console.log(collectionRes?.data?.results)
        setTabs(collectionRes?.data?.results)
        setCurrentTab(collectionRes?.data?.results?.[0]?.value)
        setIsWorking(false)
	}

    const handleTabsChange = (e , value) => {
        if (isBusy) return;
        setCurrentTab(value)
        if (handleSelected) handleSelected(value)
    }

    return (
        <Card {...other}>
            {currentTab && tabs && (
                <Tabs
                    value={currentTab}
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    sx={{ px: 3 }}
                    textColor="primary"                
                    variant="scrollable"
                >
                    {tabs && tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={`${tab.label}`}
                            value={tab.value}
                        />
                    ))}

                </Tabs>
            )}                
        </Card>            
    )
}