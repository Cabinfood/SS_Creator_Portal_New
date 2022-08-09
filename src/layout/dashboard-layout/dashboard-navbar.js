import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  ButtonBase,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Menu as MenuIcon } from "../../icons/menu";
import { AccountPopover } from "../../components/dashboard/account-popover";
import { ContentSearchDialog } from "../../components/dashboard/content-search-dialog";
import { NotificationsPopover } from "../../components/dashboard/notifications-popover";
import { Bell as BellIcon } from "../../icons/bell";
import { UserCircle as UserCircleIcon } from "../../icons/user-circle";
import { Search as SearchIcon } from "../../icons/search";
import { Users as UsersIcon } from "../../icons/users";
import {useAuth} from "../../hooks/use-auth"
import { SearchDialog } from "../../components/dialog/search.dialog";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...(theme.palette.mode === "light"
    ? {
        boxShadow: theme.shadows[3],
      }
    : {
        backgroundColor: theme.palette.background.paper,
        borderBottomColor: theme.palette.divider,
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        boxShadow: "none",
      }),
}));

const ContentSearchButton = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenSearchDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Tooltip title="Search">
        <IconButton onClick={handleOpenSearchDialog} sx={{ ml: 1 }}>
          <SearchIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <SearchDialog
        onClose={handleCloseSearchDialog}
        open={openDialog}
      />
    </>
  );
};

const NotificationsButton = () => {
  const anchorRef = useRef(null);
  const [unread, setUnread] = useState(0);
  const [openPopover, setOpenPopover] = useState(false);
  // Unread notifications should come from a context and be shared with both this component and
  // notifications popover. To simplify the demo, we get it from the popover

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };

  const handleClosePopover = () => {
    setOpenPopover(false);
  };

  const handleUpdateUnread = (value) => {
    setUnread(value);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton ref={anchorRef} sx={{ ml: 1 }} onClick={handleOpenPopover}>
          <Badge color="error" badgeContent={unread}>
            <BellIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        onUpdateUnread={handleUpdateUnread}
        open={openPopover}
      />
    </>
  );
};

const AccountButton = () => {
	const anchorRef = useRef(null);
	const [openPopover, setOpenPopover] = useState(false);
	
	// To get the user from the authContext, you can use
	const { user } = useAuth();
	// const user = {
	// 	avatar: "/static/mock-images/avatars/avatar-anika_visser.png",
	// 	name: "Anika Visser",
	// };

	const handleOpenPopover = () => {
		setOpenPopover(true);
	};

	const handleClosePopover = () => {
		setOpenPopover(false);
	};

	return (
		<>
			<Box
				component={ButtonBase}
				onClick={handleOpenPopover}
				ref={anchorRef}
				sx={{
					alignItems: "center",
					display: "flex",
					ml: 2,
					"&:hover": {
						cursor: "pointer"
					}
				}}
			>
				<Avatar
					sx={{
						height: 40,
						width: 40,
					}}
					src={user?.avatar}
				>
					<UserCircleIcon fontSize="small" />
				</Avatar>
			</Box>
			<AccountPopover
				anchorEl={anchorRef.current}
				onClose={handleClosePopover}
				open={openPopover}
			/>
		</>
	);
};

export const DashboardNavbar = (props) => {
	const { onOpenSidebar, ...other } = props;

	return (
		<>
			<DashboardNavbarRoot
				sx={{
					left: {lg: 280,},
					width: {lg: "calc(100% - 280px)",},
				}}
				{...other}
			>
				<Toolbar
					disableGutters
					sx={{
						minHeight: 64,
						left: 0,
						px: 2,
					}}
				>
					<IconButton
						onClick={onOpenSidebar}
						sx={{
							display: {
								xs: "inline-flex",
								lg: "none",
							},
						}}
					>
						<MenuIcon fontSize="small" />
					</IconButton>
					<Box sx={{ flexGrow: 1 }} />
					<ContentSearchButton />
					<NotificationsButton />
					<AccountButton />
				</Toolbar>
			</DashboardNavbarRoot>
		</>
	);
};

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};
