import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
Box,
Button,
Chip,
Divider,
Drawer,
Typography,
useMediaQuery,
} from "@mui/material";
import { Calendar as CalendarIcon } from "../../icons/calendar";
import { Cash as CashIcon } from "../../icons/cash";
import { ChartBar as ChartBarIcon } from "../../icons/chart-bar";
import { ChartPie as ChartPieIcon } from "../../icons/chart-pie";
import { ChatAlt2 as ChatAlt2Icon } from "../../icons/chat-alt2";
import { ClipboardList as ClipboardListIcon } from "../../icons/clipboard-list";
import { CreditCard as CreditCardIcon } from "../../icons/credit-card";
import { Home as HomeIcon } from "../../icons/home";
import { LockClosed as LockClosedIcon } from "../../icons/lock-closed";
import { Mail as MailIcon } from "../../icons/mail";
import { MailOpen as MailOpenIcon } from "../../icons/mail-open";
import { Newspaper as NewspaperIcon } from "../../icons/newspaper";
import { OfficeBuilding as OfficeBuildingIcon } from "../../icons/office-building";
import { ReceiptTax as ReceiptTaxIcon } from "../../icons/receipt-tax";
import { Selector as SelectorIcon } from "../../icons/selector";
import { Share as ShareIcon } from "../../icons/share";
import { ShoppingBag as ShoppingBagIcon } from "../../icons/shopping-bag";
import { ShoppingCart as ShoppingCartIcon } from "../../icons/shopping-cart";
import { Truck as TruckIcon } from "../../icons/truck";
import { UserCircle as UserCircleIcon } from "../../icons/user-circle";
import { Users as UsersIcon } from "../../icons/users";
import { XCircle as XCircleIcon } from "../../icons/x-circle";
import { Logo } from "../../components/logo";
import { Scrollbar } from "../../components/scrollbar";
import { DashboardSidebarSection } from "./dashboard-sidebar-section";
import { OrganizationPopover } from "../../components/dashboard/organization-popover";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FlagIcon from '@mui/icons-material/Flag';
import CopyrightIcon from '@mui/icons-material/Copyright';
import CloudIcon from '@mui/icons-material/Cloud';
import { Audiotrack, Bookmark, HealthAndSafetyRounded } from "@mui/icons-material";

import { useAuth } from "../../hooks/use-auth";

const getSections = (t) => [
{
	title: t("general"),
	items: [
	{
		title: t("Feed"),
		path: "/newsfeed",
		icon: <DynamicFeedIcon fontSize="small" />,
	},
	{
		title: t("Discover"),
		path: "/discover",
		icon: <FlagIcon fontSize="small" />,
	},
	{
		title: t("Analytics"),
		path: "/analytics",
		icon: <ChartBarIcon fontSize="small" />,
	},
	{
		title: t("Channels"),
		path: "/channels",
		icon: <CloudIcon fontSize="small" />,
	},	
	// {
	// 	title: t("Posts"),
	// 	path: "/incubator/posts",
	// 	icon: <FlagIcon fontSize="small" />,
	// },
	// {
	// 	title: t("Challenges"),
	// 	path: "/incubator/challenges",
	// 	icon: <EmojiEventsIcon fontSize="small" />,
	// },
	{
		title: t("IPs"),
		path: "/ips",
		icon: <CopyrightIcon fontSize="small" />,
	},	
	

	// ----------------------------------------------------------
	//   {
	//     title: t("Logistics"),
	//     path: "/dashboard/logistics",
	//     icon: <TruckIcon fontSize="small" />,
	//     chip: (
	//       <Chip
	//         color="secondary"
	//         label={
	//           <Typography
	//             sx={{
	//               fontSize: "10px",
	//               fontWeight: "600",
	//             }}
	//           >
	//             NEW
	//           </Typography>
	//         }
	//         size="small"
	//       />
	//     ),
	//   },
	//   {
	//     title: t("Account"),
	//     path: "/dashboard/account",
	//     icon: <UserCircleIcon fontSize="small" />,
	//   },
	],
},
{
	title: t("Personal Workspace"),
	items: [
		{
			title: t("My Favourite"),
			icon: <ShareIcon fontSize="small" />,
			path: "/account/favourite",			
		},
		{
			title: t("My Contents"),
			icon: <Audiotrack fontSize="small" />,
			path: "/account/contents",			
		},
		{
			title: t("In Review"),			
			icon: <HealthAndSafetyRounded fontSize="small" />,
			path: "/account/in-review",			
		},
		{
			title: t("My Posts"),
			icon: <Bookmark fontSize="small" />,
			path: "/account/posts",
		},
		
		// {
		// 	title: t("My Channels"),
		// 	icon: <NewspaperIcon fontSize="small" />,
		// 	path: "/account/channels",
		// },
		
		// {
		// 	title: t("order"),
		// 	icon: <ShoppingCartIcon fontSize="small" />,
		// 	path: "/dashboard/orders",
		// 	children: [
		// 	{
		// 		title: t("List"),
		// 		path: "/dashboard/orders",
		// 	},
		// 	{
		// 		title: t("Details"),
		// 		path: "/dashboard/orders/1",
		// 	},
		// 	],
		// },
		// {
		// 	title: t("fanpage-management"),
		// 	icon: <ShoppingCartIcon fontSize="small" />,
		// 	path: "/dashboard/fanpages",
		// },
		// {
		// 	title: t("invoice"),
		// 	path: "/dashboard/invoices",
		// 	icon: <ReceiptTaxIcon fontSize="small" />,
		// },
		// {
		// 	title: t("account"),
		// 	path: "/dashboard/account",
		// 	icon: <ReceiptTaxIcon fontSize="small" />,
		// },
	],
},
// {
//   title: t("Platforms"),
//   items: [
//     {
//       title: t("Job Listings"),
//       path: "/dashboard/jobs",
//       icon: <OfficeBuildingIcon fontSize="small" />,
//       children: [
//         {
//           title: t("Browse"),
//           path: "/dashboard/jobs",
//         },
//         {
//           title: t("Details"),
//           path: "/dashboard/jobs/companies/1",
//         },
//         {
//           title: t("Create"),
//           path: "/dashboard/jobs/new",
//         },
//       ],
//     },
//     {
//       title: t("Social Media"),
//       path: "/dashboard/social",
//       icon: <ShareIcon fontSize="small" />,
//       children: [
//         {
//           title: t("Profile"),
//           path: "/dashboard/social/profile",
//         },
//         {
//           title: t("Feed"),
//           path: "/dashboard/social/feed",
//         },
//       ],
//     },
//     {
//       title: t("Blog"),
//       path: "/blog",
//       icon: <NewspaperIcon fontSize="small" />,
//       children: [
//         {
//           title: t("Post List"),
//           path: "/blog",
//         },
//         {
//           title: t("Post Details"),
//           path: "/blog/1",
//         },
//         {
//           title: t("Post Create"),
//           path: "/blog/new",
//         },
//       ],
//     },
//   ],
// },
// {
// 	title: t("application"),
// 	items: [
// 	{
// 		title: "Fanpage Listings",
// 		path: "/dashboard/apps/fanpage-listings",
// 		icon: <ClipboardListIcon fontSize="small" />,
// 	},
// 	{
// 		title: "Smart link",
// 		path: "/dashboard/apps/smart-link",
// 		icon: <MailIcon fontSize="small" />,
// 	},
// 	],
// },
// {
// 	title: t("add-ons"),
// 	items: [
// 	{
// 		title: t("following"),
// 		path: "/dashboard/add-ons/following",
// 		icon: <ClipboardListIcon fontSize="small" />,
// 	},
// 	{
// 		title: t("chat"),
// 		path: "/dashboard/add-ons/chat",
// 		icon: <MailIcon fontSize="small" />,
// 	},
// 	{
// 		title: t("calendar"),
// 		path: "/dashboard/add-ons/calendar",
// 		icon: <MailIcon fontSize="small" />,
// 	},
// 	],
// },
// {
//   title: t("Pages"),
//   items: [
//     {
//       title: t("Auth"),
//       path: "/authentication",
//       icon: <LockClosedIcon fontSize="small" />,
//       children: [
//         {
//           title: t("Register"),
//           path: "/authentication/register?disableGuard=true",
//         },
//         {
//           title: t("Login"),
//           path: "/authentication/login?disableGuard=true",
//         },
//       ],
//     },
//     {
//       title: t("Pricing"),
//       path: "/dashboard/pricing",
//       icon: <CreditCardIcon fontSize="small" />,
//     },
//     {
//       title: t("Checkout"),
//       path: "/checkout",
//       icon: <CashIcon fontSize="small" />,
//     },
//     {
//       title: t("Contact"),
//       path: "/contact",
//       icon: <MailOpenIcon fontSize="small" />,
//     },
//     {
//       title: t("Error"),
//       path: "/error",
//       icon: <XCircleIcon fontSize="small" />,
//       children: [
//         {
//           title: "401",
//           path: "/401",
//         },
//         {
//           title: "404",
//           path: "/404",
//         },
//         {
//           title: "500",
//           path: "/500",
//         },
//       ],
//     },
//   ],
// },
];

export const DashboardSidebar = (props) => {
	const { onClose, open } = props;
	const {user} = useAuth()
	const router = useRouter();
	const { t } = useTranslation();
	const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
		noSsr: true,
	});
	const sections = useMemo(() => getSections(t), [t]);
	const organizationsRef = useRef(null);
	const [openOrganizationsPopover, setOpenOrganizationsPopover] =
		useState(false);

	const handlePathChange = () => {
		if (!router.isReady) {
		return;
		}

		if (open) {
		onClose?.();
		}
	};

	useEffect(
		handlePathChange,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.isReady, router.asPath]
	);

	const handleOpenOrganizationsPopover = () => {
		setOpenOrganizationsPopover(true);
	};

	const handleCloseOrganizationsPopover = () => {
		setOpenOrganizationsPopover(false);
	};

	const content = (
		<>
			<Scrollbar
				sx={{
					height: "100%",
					"& .simplebar-content": {
						height: "100%",
					},
				}}
			>
				<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
				}}
				>
					<div>
						<Box sx={{ p: 3 }}>
							<NextLink href="/" passHref>
								<a>
									<Logo
										source = "/static/logo.svg"
										sx={{
											height: 42,
											width: 42,
										}}
									/>
								</a>
							</NextLink>
						</Box>
						<Box sx={{ px: 2 }}>
							<Box
								// onClick={handleOpenOrganizationsPopover}
								ref={organizationsRef}
								sx={{
									alignItems: "center",
									backgroundColor: "rgba(255, 255, 255, 0.04)",
									cursor: "pointer",
									display: "flex",
									justifyContent: "space-between",
									px: 3,
									py: "11px",
									borderRadius: 1,
								}}
							>
								<div>
									<Typography color="inherit" variant="subtitle1">
										{user?.fullname}
									</Typography>
									<Typography color="neutral.400" variant="body2">
										{t("Your tier")} : {user?.tier}
									</Typography>
								</div>
								<SelectorIcon
									sx={{
										color: "neutral.500",
										width: 14,
										height: 14,
									}}
								/>
							</Box>
						</Box>
					</div>

					<Divider
						sx={{
							borderColor: "#2D3748",
							my: 3,
						}}
					/>
					<Box sx={{ flexGrow: 1 }}>
						{sections.map((section) => (
							<DashboardSidebarSection
								key={section.title}
								path={router.asPath}
								sx={{
									mt: 2,
									"& + &": {
										mt: 2,
									},
								}}
								{...section}
							/>
						))}
					</Box>
					<Divider
						sx={{
						borderColor: "#2D3748", // dark divider
						}}
					/>
					<Box sx={{ p: 2 }}>
						<Typography color="neutral.100" variant="subtitle2">
							{t("need-support")}
						</Typography>
						<Typography color="neutral.500" variant="body2">
							Liên hệ admin@sand.so
						</Typography>
						<NextLink href="/docs" passHref>
							<Button
								color="secondary"
								component="a"
								fullWidth
								sx={{ my: 2 }}
								variant="contained"
							>
								{t('Kiến thức')}
							</Button>
						</NextLink>
					</Box>
				</Box>
			</Scrollbar>		
		</>
	);

	if (lgUp) {
		return (
		<Drawer
			anchor="left"
			open
			PaperProps={{
			sx: {
				backgroundColor: "neutral.900",
				borderRightColor: "divider",
				borderRightStyle: "solid",
				borderRightWidth: (theme) =>
				theme.palette.mode === "dark" ? 1 : 0,
				color: "#FFFFFF",
				width: 280,
			},
			}}
			variant="permanent"
		>
			{content}
		</Drawer>
		);
	}

	return (
		<Drawer
			anchor="left"
			onClose={onClose}
			open={open}
			PaperProps={{
				sx: {
					backgroundColor: "neutral.900",
					color: "#FFFFFF",
					width: 280,
				},
			}}
			sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
			variant="temporary"
		>
			{content}
		</Drawer>
	);
};

DashboardSidebar.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool,
};
