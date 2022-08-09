import { Fragment, useState } from 'react';
import {
Badge,
Box,
CircularProgress,
Dialog,
DialogContent,
Divider,
IconButton,
InputAdornment,
TextField,
Typography,
Link
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { wait } from '../../utils/wait';
import { X as XIcon } from '../../icons/x';
import { Tip } from '../tip';
import PropTypes from 'prop-types';
import GeneralApiClient from '../../api-clients/general.api-client';
import cookieLib from '../../lib/cookie.lib';

export const SearchDialog = (props) => {
	const { onClose, open, ...other } = props;
    const token = cookieLib.getCookie("token")
	const [value, setValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState()

	const handleSubmit = async (event) => {
		event.preventDefault();
        if (value.length === 0){
            alert("Vui lòng nhập nội dung")
            return;
        }

		setShowResults(false);
		setIsLoading(true);
		// Do search here
        searchQuery(value)
        

		await wait(1500);		
	};

    const searchQuery = async(keyword) => {
        const apiRet = await GeneralApiClient.search(token, keyword)
        
        if (apiRet.success) setResults(apiRet.data)
        setIsLoading(false);
		setShowResults(true);
    }

	return (
		<Dialog
			fullWidth
			maxWidth="sm"
			onClose={onClose}
			open={open}
			{...other}>
		<Box
			sx={{
				alignItems: 'center',
				backgroundColor: 'primary.main',
				color: 'primary.contrastText',
				display: 'flex',
				justifyContent: 'space-between',
				px: 3,
				py: 2
			}}
		>
			<Typography variant="h6">Search</Typography>
			<IconButton
				color="inherit"
				onClick={onClose}
			>
				<XIcon fontSize="small" />
			</IconButton>
		</Box>

		<DialogContent>
			<form onSubmit={handleSubmit}>
				<Tip message="Search by entering a keyword and pressing Enter" />
				<TextField
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
							<SearchIcon fontSize="small" />
							</InputAdornment>
						)
					}}
					label="Search"
					onChange={(event) => setValue(event.target.value)}
					placeholder="Search..."
					sx={{ mt: 3 }}
					value={value}
				/>
			</form>

			{isLoading && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 3
                    }}
                >
                    <CircularProgress />
                </Box>
			)}

			{showResults && results && (
			<>
				{Object.keys(results).map((type, index) => {                    
                    if (results[type].length > 0) return (
                        <div key={index}>
                            <Typography
                                sx={{ 
                                    my: 2,                                    
                                }}
                                variant="h6"
                                color="primary.main"
                            >
                                {type} - ({results[type]?.length})
                            </Typography>
                            
                            <Box
                                sx={{
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    borderStyle: 'solid',
                                    borderWidth: 1
                                }}
                            >
                                {type === 'contents' && (<FragmentContent data = {results[type]} />)}
                                {type === 'posts' && (<FragmentPost data = {results[type]} />)}
                            </Box>
                        </div>
                    )
                })}
			</>
			)}
		</DialogContent>
		</Dialog>
	);
};

SearchDialog.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool
};


const FragmentContent = (props) => {
    const {data, ...others} = props
    return (
        <Box>
            {data && data.map((result, index) => (
                <Fragment key={index}>
                    <Box sx={{ p: 2 }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <Badge
                                color="primary"
                                sx={{ ml: 1 }}
                                variant="dot"
                            />
                            <Typography
                                variant="subtitle1"
                                sx={{ 
                                    ml: 2 ,
                                    textTransform: "lowercase"
                                }}
                            >
                                <Link href={`/contents/${result?.id}`}>
                                    {result.properties?.title?.title?.[0]?.plain_text}
                                </Link>
                            </Typography>
                        </Box>

                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >   
                            <Link href={`/account/${result.properties?.created_by?.relation?.[0]?.id}`} color="inherit" mr={1}>
                                {result.properties?.editor_name?.rollup?.array?.[0]?.title?.[0]?.plain_text} -
                            </Link>                         
                            {new Date(result?.created_time).toLocaleString("VN-vi")}
                        </Typography>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                            sx={{ mt: 1 }}
                        >
                            
                        </Typography>
                    </Box>
                    {(index !== data.length - 1) && <Divider />}
                </Fragment>
            ))}
        </Box>        
    )
}

const FragmentPost = (props) => {
    const {data, ...others} = props
    return (
        <Box>
            {data && data.map((result, index) => (
                <Fragment key={index}>
                    <Box sx={{ p: 2 }}>
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <Badge
                                color="primary"
                                sx={{ ml: 1 }}
                                variant="dot"
                            />
                            <Typography
                                variant="subtitle1"
                                sx={{ 
                                    ml: 2,
                                    wordBreak: "break-all",
                                    textTransform: "lowercase"
                                }}
                            >
                                {result.properties?.object_id?.rich_text?.length > 0 && (
                                    <Link href={`https://fb.com/${result.properties?.object_id?.rich_text?.[0]?.plain_text}`} target="_blank">
                                        {result.properties?.object_id?.rich_text?.[0]?.plain_text || "Chưa xác định"}
                                    </Link>
                                )}

                                {result.properties?.object_id?.rich_text?.length === 0 && ("Chưa Xác Định")}
                                
                            </Typography>
                        </Box>

                        <Typography
                            color="textSecondary"
                            variant="body2"
                        >
                            <Link href={`/account/${result.properties?.posted_by?.relation?.[0]?.id}`} color="inherit" mr={1}>
                                {result.properties?.posted_by_name?.rollup?.array?.[0]?.title?.[0]?.plain_text}
                            </Link> -
                            <span style={{marginLeft:2}}>{new Date(result?.created_time).toLocaleString("VI-vn")}</span>
                        </Typography>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                            sx={{ mt: 1 }}
                        >
                            {result.properties?.resources_title?.rollup?.array?.[0]?.title?.[0]?.plain_text}
                        </Typography>
                    </Box>
                    {(index !== data.length - 1) && <Divider />}
                </Fragment>
            ))}
        </Box>        
    )
}