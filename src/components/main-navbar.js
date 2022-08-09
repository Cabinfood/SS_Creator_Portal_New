import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { AppBar, Box,ButtonBase, Avatar, Button, Container, IconButton, Link, Toolbar, Tooltip, Typography } from '@mui/material';
import { Menu as MenuIcon } from '../icons/menu';
import { Logo } from './logo';
import { Search as SearchIcon } from '../icons/search';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { ContentSearchDialog } from './content-search-dialog';
import { MenuPopover } from './menu-popover';

export const MainNavbar = (props) => {
	const { onOpenSidebar, menuData, logoUrl, menuIconUrl} = props;
	return (
		<AppBar
			elevation={0}
			sx={{
				backgroundColor: 'background.paper',
				borderBottomColor: 'divider',
				borderBottomStyle: 'solid',
				borderBottomWidth: 1,
				color: 'text.secondary'
			}}
		>
			<Container maxWidth="lg">
				<Toolbar
					disableGutters
					sx={{ minHeight: 64 }}
				>
					<NextLink href="/" passHref>
						<a>
							<Logo
								source = {logoUrl}
								sx={{
									display: {
										md: 'inline',
										// xs: 'none'
									},
									height: 40,
									width: 40
								}}
							/>
						</a>
					</NextLink>
					<Box sx={{ flexGrow: 1 }} />														
					<ContentSearchButton />
					<MenuButton data={menuData} menuIcon={menuIconUrl}/>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

MainNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

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
				<IconButton
					onClick={handleOpenSearchDialog}
					sx={{ ml: 1 }}
				>
					<SearchIcon fontSize="small" />
				</IconButton>
			</Tooltip>
			<ContentSearchDialog
				onClose={handleCloseSearchDialog}
				open={openDialog}
			/>
		</>
	);
};

const MenuButton = ({data, menuIcon}) => {
	const anchorRef = useRef(null);
	const [openPopover, setOpenPopover] = useState(false);
	// To get the user from the authContext, you can use
	// `const { user } = useAuth();`
	// const user = {
	// 	avatar: '/static/menu-icon.png',
	// 	name: 'Anika Visser'
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
				alignItems: 'center',
				display: 'flex',
				ml: 2
			}}
		>
			<Avatar
				sx={{
					height: 40,
					width: 40
				}}
				src={menuIcon}
			>
				<UserCircleIcon fontSize="small" />
		  	</Avatar>
		</Box>
		{/* <AccountPopover
			anchorEl={anchorRef.current}
			onClose={handleClosePopover}
			open={openPopover}
		/> */}
		<MenuPopover 
			anchorEl={anchorRef.current}
			onClose={handleClosePopover}
			open={openPopover}
			menus = {data}
		/>
	  </>
	);
};
