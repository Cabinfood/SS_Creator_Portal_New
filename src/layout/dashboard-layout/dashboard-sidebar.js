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
import {
	AccountCircle,
	AccountCircleOutlined,
	CloudUploadOutlined,
	Copyright,
	Flag,
	FlagOutlined,
	Leaderboard,
	LeaderboardOutlined,
	Message,
	MessageOutlined,
	ProductionQuantityLimitsOutlined,
	Tag,
	ToggleOn,
	ToggleOnOutlined,
	VideoLibrary,
	VideoLibraryOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/use-auth";

const getSections = (t) => [
	{
		title: t("Overview"),
		items: [
			{
				title: t("Analytics"),
				path: "/dashboard",
				icon: <ChartBarIcon fontSize="small" />,
			},
			{
				title: t("Finance"),
				path: "/dashboard/finance",
				icon: <ChartPieIcon fontSize="small" />,
			},
		],
	},
	{
		title: t("Management"),
		items: [
			{
				title: t("Content IP"),
				path: "/dashboard/content-ip",
				icon: <Copyright fontSize="small" />,
			},
			{
				title: t("Viral Contents"),
				path: "/dashboard/viral-contents",
				icon: <VideoLibraryOutlined fontSize="small" />,
			},
			{
				title: t("Products"),
				path: "/dashboard/products",
				icon: <CloudUploadOutlined fontSize="small" />,
			},
			{
				title: t("Posts"),
				path: "/dashboard/posts",
				icon: <Tag fontSize="small" />,
			},
			{
				title: t("Users"),
				path: "/dashboard/users",
				icon: <AccountCircleOutlined fontSize="small" />,
			},
			{
				title: t("Campaigns"),
				path: "/dashboard/campaigns",
				icon: <FlagOutlined fontSize="small" />,
			},
			{
				title: t("Challengers"),
				path: "/dashboard/challengers",
				icon: <LeaderboardOutlined fontSize="small" />,
			},
			{
				title: t("Notifications"),
				path: "/dashboard/notifications",
				icon: <MessageOutlined fontSize="small" />,
			},
			{
				title: t("General Setting"),
				path: "/dashboard/general-setting",
				icon: <ToggleOnOutlined fontSize="small" />,
			}
		]
	},
];

export const DashboardSidebar = (props) => {
	const { onClose, open } = props;
	const { user } = useAuth()
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
									<Logo />
								</a>
							</NextLink>
						</Box>
						{/* <Box sx={{ px: 2 }}>
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
						</Box> */}
					</div>

					{/* <Divider
						sx={{
							borderColor: "#2D3748",
							my: 3,
						}}
					/> */}
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
							Check our docs
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
						backgroundImage: "linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #E5F7FD 100%)",
						// backgroundColor: "neutral.900",
						borderRightColor: "divider",
						borderRightStyle: "solid",
						borderRightWidth: (theme) => theme.palette.mode === "dark" ? 1 : 0,
						color: "#121828",
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
					backgroundColor: "neutral.100",
					backgroundImage: "linear-gradient(-225deg, #E3FDEC 0%, #F8FFE9 100%);",
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
