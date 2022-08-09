import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment } from "react";

const SummaryWidgetFragment = (props) => {
	const {title, value, isWorking, onClick, children} = props
	return (
		<Fragment>
			<Card
				elevation={0}
				variant="outlined"
				onClick={onClick}
				sx={{
					cursor: 'pointer',										
					borderColor: 'primary.main',
					borderWidth: 2,
					m: '-1px'
				}}
			>
				<CardContent>
					<Box
						sx={{
							display: 'flex',
							mb: 1,
							mt: 1
						}}
					>
						
						<Typography variant="h5">
							{isWorking ? <CircularProgress size={10} /> : value}
						</Typography>
					</Box>
					<Box
						sx={{
							alignItems: 'center',
							display: 'flex',
							justifyContent: 'space-between'
						}}
					>
						<Typography variant="overline">{title}</Typography>											
					</Box>
					{children}
				</CardContent>
			</Card>
		</Fragment>
	)	
}
export default SummaryWidgetFragment;