import { Avatar, Box, Button, Card, Tooltip, CardHeader, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, Link, TableContainer } from '@mui/material';
import { Scrollbar } from '../scrollbar';
import { InformationCircleOutlined as InformationCircleOutlinedIcon } from '../../icons/information-circle-outlined';

export const CreatorTable = (props) =>{
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
				<TableContainer sx={{ maxHeight: 440}}>
					<Table sx={{ minWidth: 600 }}>
						<TableHead>
							<TableRow>
								<TableCell>Creator</TableCell>
								<TableCell>No. Contents</TableCell>
							</TableRow>
						</TableHead>
						{data && (
							<TableBody>
								{data && data?.map((content, index) => (
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
												{content?.creatorName}
											</Typography>																				
										</TableCell>
										<TableCell>
											{content?.contents?.length}
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