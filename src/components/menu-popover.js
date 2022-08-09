import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography
} from '@mui/material';
import slugify from 'slugify';

export const MenuPopover = (props) => {
    const { anchorEl, onClose, open, menus, ...other } = props;
    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}
            keepMounted
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: 300 } }}
            transitionDuration={0}
            {...other}
        >            
            <Box sx={{ p:2 }}>
                {menus && Object.keys(menus).map((type, index) => (                     
                    <div key={index}>
                        {type !== `undefined`
                        ? <Typography sx={{ my: 2 }} variant="h6"> {type} </Typography>
                        : null
                        }
                        

                        {menus[type].map((result, index) => (
                            <NextLink
                                key={result?.id}
                                href={
                                    result?.properties?.type?.select?.name === "page"
                                    ? `/${slugify(result?.properties?.title?.title?.[0]?.plain_text).toLowerCase()}-${result?.properties?.page?.relation?.[0]?.id.replace(/-/g,"")}`
                                    : `${slugify(result?.properties?.href?.url)}`
                                }
                                passHref
                            >
                                {result?.properties?.type?.select?.name === "button"
                                ? 
                                <Button fullWidth component='a' variant='contained' href={slugify(result?.properties?.href?.url)}>{result?.properties?.title?.title?.[0]?.plain_text}</Button>                                
                                :
                                <MenuItem component="a">
                                    <ListItemIcon>
                                        { result?.icon?.type === 'file'
                                        ? <img src={result?.icon?.file?.url} height={18}/>
                                        : result?.icon?.emoji                                            
                                        }                                        
                                    </ListItemIcon>
                                    
                                    <ListItemText
                                        primary={(
                                            <Typography variant="body2">
                                                {result?.properties?.title?.title?.[0]?.plain_text}
                                            </Typography>
                                        )}
                                    />
                                </MenuItem>     
                                }                                                           
                            </NextLink>    
                        ))}
                        {(index !== Object.keys(menus)?.length - 1) && <Divider />}
                    </div>
                ))}                           
            </Box>
        </Popover>
    );
};

MenuPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
