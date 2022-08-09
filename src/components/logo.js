import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { LOGO_URL } from '../constant';
import { useEffect, useState } from 'react';

export const Logo = styled((props) => {	
	const { variant, source, ...other } = props;
	const color = variant === 'light' ? '#C1C4D6' : '#5048E5';
	
	return (		
		<img src={source} style={{maxHeight: "40px"}}/>
	);
})``;

Logo.defaultProps = {
  variant: 'primary'
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['light', 'primary'])
};
