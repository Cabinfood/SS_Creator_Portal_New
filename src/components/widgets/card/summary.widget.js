import { Avatar, Box, Button, Card, CardActions, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import { ChevronDown as ChevronDownIcon } from '../../../icons/chevron-down';
import { ChevronUp as ChevronUpIcon } from '../../../icons/chevron-up';
import NextLink from 'next/link'

import { Chart } from '../../chart';

export const SummaryWidget = (props) => {
	const {title, value,href, description, chartData, chartType, isWorking, ...others} = props

    return (
        <Card {...others}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2
                }}
            >
                <div>
                    <Typography color="textSecondary" variant="body2"> {title}</Typography>
					{isWorking
					? <CircularProgress size={"15px"} />
					: <Typography sx={{ mt: 1 }} variant="h5">{value}</Typography>
					}
                    
                </div>
				{chartType === "line-chart"
				? <LineChart />
				: <BarChart />
				}
            </Box>

			{href
			?
				<div>
					<Divider />			
					<CardActions>
						<Button endIcon={<ArrowRightIcon fontSize="small" />}> {description}</Button>
					</CardActions>
				</div>
			: 
				<div>
					<Divider />		
					<CardActions
						sx={{
							alignItems: 'center',
							display: 'flex'
						}}
					>
						<Avatar
							sx={{
								backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08),
								color: 'success.main',
								height: 36,
								width: 36
							}}
						>
							<ChevronUpIcon fontSize="small" />
						</Avatar>
						<Typography
							color="textSecondary"
							sx={{ ml: 1 }}
							variant="caption"
						>
							{description}
							
						</Typography>
					</CardActions>
				</div>
			}								
        </Card>
    )
}

const LineChart = () => {
	const theme = useTheme();

	const chartOptions = {
		chart: {
			background: 'transparent',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		colors: ['#2F3EB1'],
		dataLabels: {
			enabled: false
		},
		fill: {
			opacity: 1
		},
		grid: {
			show: false
		},
		stroke: { 
			width: 3
		},
		theme: {
			mode: theme.palette.mode
		},
		tooltip: {
			enabled: false
		},
		xaxis: {
			labels: {
				show: false
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			}
			},
			yaxis: {
			show: false
		}
	};

	const chartSeries = [{ data: [0, 60, 30, 60, 0, 30, 10, 30, 0] }];

	return (
		<Chart
			options={chartOptions}
			series={chartSeries}
			type="line"
			width={120}
		/>
	);
};

const BarChart = () => {
	const theme = useTheme();

	const chartOptions = {
		chart: {
		background: 'transparent',
		toolbar: {
			show: false
		},
		zoom: {
			enabled: false
		}
		},
		colors: ['#2F3EB1'],
		dataLabels: {
		enabled: false
		},
		fill: {
		opacity: 1
		},
		grid: {
		show: false
		},
		states: {
		normal: {
			filter: {
			type: 'none',
			value: 0
			}
		}
		},
		stroke: {
		width: 0
		},
		theme: {
		mode: theme.palette.mode
		},
		tooltip: {
		enabled: false
		},
		xaxis: {
		axisBorder: {
			show: false
		},
		axisTicks: {
			show: false
		},
		labels: {
			show: false
		}
		},
		yaxis: {
		show: false
		}
	};

	const chartSeries = [{ data: [10, 20, 30, 40, 50, 60, 5] }];

	return (
		<Chart
			options={chartOptions}
			series={chartSeries}
			type="bar"
			width={120}
		/>
	);
};