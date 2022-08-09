import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useMounted } from '../../../hooks/use-mounted';
import NextLink from 'next/link';

import Head from "next/head";
import {Box, Container,Typography, Grid, MenuItem, Button, TextField, CircularProgress, Link} from "@mui/material";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../layout/dashboard-layout/dashboard-layout";
import { gtm } from "../../../lib/gtm";
import { AuthProvider } from "../../../contexts/auth-context";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Calendar as CalendarIcon } from '../../../icons/calendar';
import { ChevronDown as ChevronDownIcon } from '../../../icons/chevron-down';
import { PencilAlt as PencilAltIcon } from '../../../icons/pencil-alt';

const IPDetail = (props) => {
    return (
        <>
            <Head>
                <title>
                Dashboard: Order Details | Material Kit Pro
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}>
                    <Container maxWidth="md">
                        <Box sx={{ mb: 4 }}>
                            <NextLink
                                href="/dashboard/orders"
                                passHref
                                >
                                <Link
                                    color="textPrimary"
                                    component="a"
                                    sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                    }}
                                >
                                    <ArrowBackIcon
                                    fontSize="small"
                                    sx={{ mr: 1 }}
                                    />
                                    <Typography variant="subtitle2">
                                    Orders
                                    </Typography>
                                </Link>
                            </NextLink>
                        </Box>
                        <Box sx={{ mb: 4 }}>
                            <Grid
                            container
                            justifyContent="space-between"
                            spacing={3}
                            >
                            <Grid item>
                                <Typography variant="h4">
                                {/* {order.number} */}
                                </Typography>
                                <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    ml: -1,
                                    mt: 1
                                }}
                                >
                                <Typography
                                    color="textSecondary"
                                    variant="body2"
                                    sx={{ ml: 1 }}
                                >
                                    Placed on
                                </Typography>
                                <CalendarIcon
                                    color="action"
                                    fontSize="small"
                                    sx={{ ml: 1 }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ ml: 1 }}
                                >
                                    {/* {format(order.createdAt, 'dd/MM/yyyy HH:mm')} */}
                                </Typography>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                sx={{ ml: -2 }}
                            >
                                <Button
                                endIcon={(
                                    <PencilAltIcon fontSize="small" />
                                )}
                                variant="outlined"
                                sx={{ ml: 2 }}
                                >
                                Edit
                                </Button>
                                <Button
                                endIcon={(
                                    <ChevronDownIcon fontSize="small" />
                                )}
                                variant="contained"
                                sx={{ ml: 2 }}
                                >
                                Action
                                </Button>
                            </Grid>
                            </Grid>
                        </Box>
                    </Container>
            </Box>
        </>
    )
}

IPDetail.getLayout = (page) => (
	<AuthProvider>
		<AuthGuard>
			<DashboardLayout>{page}</DashboardLayout>
		</AuthGuard>
	</AuthProvider>
);

export default IPDetail