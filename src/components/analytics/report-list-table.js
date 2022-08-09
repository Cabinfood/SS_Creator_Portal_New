import { Fragment } from 'react';
import NextLink from 'next/link';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {Avatar,Box,IconButton,Link,Table,TableBody,TableCell,TablePagination,TableRow,Typography} from '@mui/material';
import { ArrowRight as ArrowRightIcon } from '../../icons/arrow-right';
import { getInitials } from '../../utils/get-initials';
import { Scrollbar } from '../scrollbar';
import { keys } from "lodash";

const groupObjectByChannel = (data) => {
	let results = {}

	data.forEach(post => {
		const channelName = post?.channel_name
		if (!results[channelName]) {
			results[channelName] = [];
		}
		results[channelName].push(post)
	});
	
	return (keys(results).map(name => ({
		name,
		objects: results[name]
	})))		
	
}	

const ReportListTable = (props) => {
	const {group,invoices,invoicesCount,onPageChange,onRowsPerPageChange,page,rowsPerPage,...other} = props;
	const objectsByChannel = group && groupObjectByChannel(invoices)
	
	return (
		<div>
			<Scrollbar>
				<Table
				sx={{
					borderCollapse: 'separate',
					borderSpacing: (theme) => `0 ${theme.spacing(3)}`,
					minWidth: 600,
					marginTop: (theme) => `-${theme.spacing(3)}`,
					p: '1px'
				}}
				>
					{group 
					?					
					<TableBody>
						{Object.keys(objectsByChannel).map((key) => (
							<Fragment key={key}>
								<TableRow>
									<TableCell
										colSpan={5}
										sx={{ px: 0 }}
									>
									<Typography
										color="textSecondary"
										variant="h6"
									>
										{objectsByChannel[key]?.name}
										{' '}
										({objectsByChannel[key]?.objects?.length})
									</Typography>
									</TableCell>
								</TableRow>
								{objectsByChannel[key]?.objects.map((invoice) => (
									<ReportRow
										invoice={invoice}
										key={invoice.id}
									/>
								))}
							</Fragment>
						))}
					</TableBody>
					:
					<TableBody>
						{invoices.map((invoice) => (
							<ReportRow
								invoice={invoice}
								key={invoice.id}
							/>
						))}
					</TableBody>
					}
					

				</Table>
			</Scrollbar>
		</div>
	)
}

const ReportRow = (props) => {
	const { invoice } = props;

	return (
		<TableRow
			key={invoice.id}
			sx={{
					boxShadow: 1,
					transition: (theme) => theme.transitions.create('box-shadow', {
					easing: theme.transitions.easing.easeOut
				}),
				'&:hover': {
					boxShadow: 8
				},
				'& > td': {
					backgroundColor: 'background.paper',
					borderBottom: 0
				}
			}}
		>
			<TableCell width="25%">
				<NextLink
					href="/dashboard/invoices/1"
					passHref
				>
					<Box
						component="a"
						sx={{
							alignItems: 'center',
							display: 'inline-flex',
							textDecoration: 'none',
							whiteSpace: 'nowrap'
						}}
					>
						<Avatar
							sx={{
								height: 42,
								width: 42
							}}
						>
							{getInitials(invoice?.channel_name)}
						</Avatar>
						<Box sx={{ ml: 2 }}>
							<Typography
								color="textPrimary"
								variant="subtitle2"
								maxWidth="25vw"
								textOverflow= "ellipsis"
								overflow= "hidden"
							>
								{invoice?.object_id}
							</Typography>
							<Typography
								color="textSecondary"
								variant="body2"
								maxWidth="25vw"
								textOverflow= "ellipsis"
								overflow= "hidden"
							>
								{invoice?.title}
							</Typography>					
						</Box>
					</Box>
				</NextLink>
			</TableCell>
			<TableCell>
				<Typography variant="body2">
					{invoice?.moneitize_lifetime?.earning?.toLocaleString("VN-vi")}
					{/* {numeral(invoice?.moneitize_lifetime?.earning || 0).format('0,0.00')} */}
				</Typography>
			</TableCell>
			
			<TableCell>
				<Box
				sx={{
					display: 'flex',
					flexDirection: 'column'
				}}
				>
				<Typography variant="subtitle2">
					Issued
				</Typography>
				<Typography
					color="textSecondary"
					variant="body2"
				>
					{invoice?.issueDate && format(invoice?.issueDate, 'dd/MM/yyyy')}
				</Typography>
				</Box>
			</TableCell>
			<TableCell>
				<Box
				sx={{
					display: 'flex',
					flexDirection: 'column'
				}}
				>
				<Typography variant="subtitle2">
					Due
				</Typography>
				<Typography
					color="textSecondary"
					variant="body2"
				>
					{invoice?.dueDate && format(invoice?.dueDate, 'dd/MM/yyyy')}
				</Typography>
				</Box>
			</TableCell>
			<TableCell align="right">
				<NextLink
					href="/dashboard/invoices/1"
					passHref
				>
					<IconButton component="a">
						<ArrowRightIcon fontSize="small" />
					</IconButton>
				</NextLink>
			</TableCell>
		</TableRow>
	);
};

export default ReportListTable