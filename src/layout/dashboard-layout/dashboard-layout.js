import { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { Box } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
	display: "flex",
	flex: "1 1 auto",
	maxWidth: "100%",
	paddingTop: 64,
	[theme.breakpoints.up("lg")]: {
		paddingLeft: 280,
	},
}));

export const DashboardLayout = (props) => {
	const { children } = props;
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DashboardLayoutRoot>
					<Box
						sx={{
							display: "flex",
							flex: "1 1 auto",
							flexDirection: "column",
							width: "100%",
						}}
					>
					{children}
					</Box>
				</DashboardLayoutRoot>
				<DashboardNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />
				<DashboardSidebar
					onClose={() => setIsSidebarOpen(false)}
					open={isSidebarOpen}
				/>
			</LocalizationProvider>
		</>
	);
};

DashboardLayout.propTypes = {
  	children: PropTypes.node,
};
