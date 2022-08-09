import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Drawer, Link, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

const MainSidebarLink = styled(Link)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  display: 'block',
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));

export const MainSidebar = (props) => {
  const { onClose, open, data } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const handlePathChange = () => {
    if (open) {
      onClose?.();
    }
  };

  useEffect(handlePathChange,[router.asPath]);

  return (
    <Drawer
		anchor="right"
		onClose={onClose}
		open={!lgUp && open}
		PaperProps={{ sx: { width: 256 } }}
		sx={{
			zIndex: (theme) => theme.zIndex.appBar + 100
		}}
		variant="temporary"
    >
		<Box sx={{ p: 2 }}>
			{data && data?.map((item, index)=>(
				<NextLink href={`/${item?.slug}`} passHref key={index}>
					<MainSidebarLink
						color="textSecondary"
						underline="none"
						variant="caption"
					>
						<Typography variant="caption" sx={{textTransform:"uppercase"}}>{item?.title}</Typography>
					</MainSidebarLink>
				</NextLink>
			))

			}
			<Button
				component="a"
				fullWidth
				href='https://my.cabineat.vn/sign-up?utm_source="cabineat.vn"'
				sx={{ mt: 1.5 }}
				target="_blank"
				variant="contained"
			>
			Truy cập
			</Button>
		</Box>
    </Drawer>
  );
};

MainSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
