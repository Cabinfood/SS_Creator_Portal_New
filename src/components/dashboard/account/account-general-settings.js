import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	Switch,
	TextField,
	Typography
} from '@mui/material';
import { useAuth } from '../../../hooks/use-auth';
import { UserCircle as UserCircleIcon } from '../../../icons/user-circle';
import { AccountInformationBasic } from './account-info-basic';
import { AccountKYC } from './account-kyc';

export const AccountGeneralSettings = (props) => {
	// To get the user from the authContext, you can use
	const { user } = useAuth();	
	
	const handleSelectedFile = async(file) => {
        console.log(file)
        setSelectedFile(file)        
    }

	return (
		<Box
			sx={{ my: 4 }}
			{...props}>
			<Card>
				<CardContent>
					<div>
						<div style={{
							display: "flex"
						}}>
							<Typography variant="h6">Xin chào, </Typography>
							<Typography variant="h6" color={"primary.main"} ml={1}> {user?.fullname}</Typography>							
						</div>
						
						<Typography
							color="textSecondary"
							sx={{ mt: 1 }}
							variant="body2"
						>
							Các thông tin cơ bản về tài khoản của bạn trên hệ thống <b>sand.so</b>
						</Typography>
					</div>

					<Box sx={{ mt: 3 }}>
						<Grid
							container
							spacing={3}
						>
							<Grid
								item
								sm={4}
								xs={12}
							>
								<Card
									elevation={0}
									variant="outlined"
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
												{user?.tier}
											</Typography>
										</Box>
										<Box
											sx={{
												alignItems: 'center',
												display: 'flex',
												justifyContent: 'space-between'
											}}
										>
											<Typography variant="overline">access tier</Typography>											
										</Box>
									</CardContent>
								</Card>
							</Grid>

							<Grid
								item
								sm={4}
								xs={12}
							>
								<Card
									elevation={0}
									variant="outlined"
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
												0
											</Typography>
											<Typography
												color="textSecondary"
												sx={{
													mt: 'auto',
													ml: '4px'
												}}
												variant="body2"
											>
												score
											</Typography>
										</Box>
										<Box
											sx={{
												alignItems: 'center',
												display: 'flex',
												justifyContent: 'space-between'
											}}
										>
											<Typography variant="overline">CONTRIBUTE SCORE</Typography>											
										</Box>
									</CardContent>
								</Card>
							</Grid>

							<Grid
								item
								sm={4}
								xs={12}
							>
								<Card
									elevation={0}
									variant="outlined"
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
												0
											</Typography>
											<Typography
												color="textSecondary"
												sx={{
													mt: 'auto',
													ml: '4px'
												}}
												variant="body2"
											>
												vnđ
											</Typography>
										</Box>
										<Box
											sx={{
												alignItems: 'center',
												display: 'flex',
												justifyContent: 'space-between'
											}}
										>
											<Typography variant="overline">WALLET AVAILABLE</Typography>											
										</Box>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Box>
				</CardContent>
			</Card>
			
			<Card sx={{ mt: 4 }}>
				<CardContent>					
					<Grid
						container
						spacing={3}
					>
						<Grid item md={4} xs={12}>
							<Typography variant="caption">Thông tin cá nhân</Typography>
							<Typography variant="h6" color={'primary.main'}>CabinID verifired</Typography>
							<Typography variant="caption" color={'textSecondary'}>Toàn bộ thông tin được bảo vệ và cập nhật bởi <b>CabinID</b></Typography>
						</Grid>
						<Grid item md={8} xs={12}>
							<AccountInformationBasic />
						</Grid>
					</Grid>
				</CardContent>
			</Card>			

			<Card sx={{ mt: 4 }}>
				<CardContent>
					<div>
						<Typography variant="h6">KYC Account</Typography>
						<Typography
							color="textSecondary"
							sx={{ mt: 1 }}
							variant="body2"
						>
							Xác thực tài khoản là hoạt động bắt buộc và ảnh hưởng đến quá trình đánh giá mức độ an toàn của tài khoản trên các giao dịch nhận thanh toán từ <b>sand.so</b>
						</Typography>
					</div>
					
					<Divider
						sx={{
							mb: 3,
							mt: 3
						}}
					/>

					<AccountKYC />
				</CardContent>
			</Card>
		</Box>
	);
};
