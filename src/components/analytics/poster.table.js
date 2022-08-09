import { Avatar, Box, Button, Card, Tooltip, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Link, TableContainer } from '@mui/material';
import { Scrollbar } from '../scrollbar';
import { InformationCircleOutlined as InformationCircleOutlinedIcon } from '../../icons/information-circle-outlined';

export const PosterTable = (props) =>{
    const {title, tooltipMsg, tableHeader, data, ...others} = props

    return (
        <Card>
			<CardHeader 
				title= {title}
				action={(
					<Tooltip title={tooltipMsg}>
						<InformationCircleOutlinedIcon sx={{ color: 'action.active' }} />
					</Tooltip>
				)}
			/>
			<Scrollbar>
				<TableContainer sx={{ maxHeight: 440 }}>
					<Table sx={{ minWidth: 600 }}>
						<TableHead>
							<TableRow>
								<TableCell>Poster</TableCell>
								<TableCell>No. Posts</TableCell>
							</TableRow>
						</TableHead>
						{data && (
							<TableBody>
								{data && data?.map((post, index) => (
									<TableRow key={index} 
										sx={{
											'&:last-child td': {
												border: 0
											}
										}}
									>
										<TableCell>
											<Typography 
												variant="body2"
												sx={{ 
													ml: 2 ,
													// display: "inline-block",												
												}}
											>
												{post?.posterName}													
											</Typography>																				
										</TableCell>
										<TableCell>
											{post?.posts?.length}
										</TableCell>									
									</TableRow>
								))}						
							</TableBody>					
						)}				
					</Table>	
				</TableContainer>
			</Scrollbar>
		</Card>
    )
}