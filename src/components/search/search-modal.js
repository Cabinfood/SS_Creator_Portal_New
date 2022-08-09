import { useState,Fragment } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';
import { Divider, Grid, List, ListItem, ListItemText,ListItemAvatar, Avatar, Snackbar, Link, IconButton, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import NotionApiClient from '../../api-clients/notion.api-client';
import slugify from 'slugify';
import { useRouter } from 'next/router';
import ContentsNotionApiClient from '../../api-clients/contents.api-client';
import cookieLib from "../../lib/cookie.lib";

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: "90vw",
	maxWidth: 800,
	minHeight: "60vh",
	bgcolor: 'background.paper',
	border: '0.5px solid #eee',
	boxShadow: 24,
	p: 2,
};

export default function SearchModal() {
	const token = cookieLib.getCookie("token")

	const router = useRouter();
	const [open, setOpen] = useState(false);	
	const [searchResults, setSearchResults] = useState([])
	const [showToast, setShowToast] = useState(false)	
	const [fetching, setFetching] = useState(false)
	const [isTyping, setIsTyping] = useState(false)
	
	var typingTimer;                //timer identifier
	var doneTypingInterval = 1000;  //time in ms, 5 second for example

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const handleChange = (event) => {						
		// const searchKey = event.target.value
		console.log(document.getElementById("search-input")?.value)
		const searchKey = document.getElementById("search-input")?.value
		if (fetching) return
		search(searchKey)		
	};
	
	const search = async(keyword) => {		
		setFetching(true)
		const result = ContentsNotionApiClient.search("honadezi", token, )
		setSearchResults(data)		
		setFetching(false)
	}

	const handleCopyToClipboard = (data) => {		
		navigator.clipboard.writeText(data)		
		handleClose()
		setShowToast(true)
	}
	const handleToastClose = () => {
		setShowToast(false)
	}
	
  	return (
		<div>
			<Button sx={{mx:1}} onClick={handleOpen}>
				<SearchIcon/>
			</Button>			
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Grid container>
						<Grid item xs={12}>
							<Box fullWidth sx={{ m: 1 }} variant="standard">
								<Typography variant='overline' sx={{textTransform: 'uppercase', mb:2}}>Bạn cần tìm gì ?</Typography>
								<Box display='flex'>
									<Input
										id="search-input"
										fullWidth										
										// onChange={handleChange}
										onKeyDown={()=>{clearTimeout(typingTimer)}}
										onKeyUp={()=>{
											clearTimeout(typingTimer);
											typingTimer = setTimeout(handleChange, doneTypingInterval);
										}}			
										startAdornment={<InputAdornment position="start">
															<SearchIcon />
														</InputAdornment>}
									/>
									{fetching
									? <CircularProgress size={20}/>
									: null
									}
									
								</Box>
								
								
									
							</Box>
						</Grid>
						<Divider />
						<Grid item xs={12} 
							sx={{
								maxHeight: "50vh",
								overflow: "scroll"
							}}
						>							
							<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
								{searchResults && searchResults?.map((item, index)=>(									
									<ListItem alignItems="flex-start" key={item?.id}>
										<ListItemAvatar>										
											<Avatar alt="" src={item?.icon?.file?.url} />
										</ListItemAvatar>
										<ListItemText
											// primary={item?.properties?.title?.title?.[0]?.plain_text}												
											secondary = {
												<Fragment>
													{/* <Typography
														sx={{ display: 'inline' }}
														component="span"
														variant="body2"
														color="text.primary"
													>
														{item?.properties?.description?.rich_text?.[0]?.plain_text}
														
													</Typography> */}
													{` — ${item?.properties?.description?.rich_text?.[0]?.plain_text || ""}`}
												</Fragment>
											}												
										>					
											<Link
												href={`/${slugify(item?.properties?.title?.title?.[0]?.plain_text).toLowerCase()}-${item?.id.replace(/-/g,"")}`}
												sx={{
													textDecoration: "none", 
													color: "inherit",
												}}
											>{item?.properties?.title?.title?.[0]?.plain_text}</Link>							
										</ListItemText>
										
										<Button size='small' onClick={()=>{handleCopyToClipboard(`${window.location.href}${slugify(item?.properties?.title?.title?.[0]?.plain_text).toLowerCase()}-${item?.id.replace(/-/g,"")}`)}}>
											Copy link
										</Button>
									</ListItem>
								))}								
							</List>
						</Grid>
						{searchResults?.length === 0
						? 
						<Typography sx={{textAlign: 'center', width: "100%"}} variant="overline" display="block" gutterBottom>
							Vui lòng nhập từ khóa để tìm kiếm kết quả phù hợp !!
						</Typography>
						: null
						}
					</Grid>
				</Box>				
			</Modal>
			<Snackbar
				open={showToast}
				autoHideDuration={6000}
				onClose={handleToastClose}
				message="Đã sao chép vào clipboard"
			/>
		</div>        		
  	);
}