import { Avatar, Box, Button, Card, CardActions, Divider, Grid, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { ArrowRight as ArrowRightIcon } from '../../icons/arrow-right';
import { ChevronDown as ChevronDownIcon } from '../../icons/chevron-down';
import { ChevronUp as ChevronUpIcon } from '../../icons/chevron-up';
import { Chart } from '../chart';
import { SummaryWidget } from '../widgets/card/summary.widget';
import cookieLib from "../../lib/cookie.lib";
import { round } from 'lodash';
import { useEffect, useState } from 'react';

export const AnalyticsOverview = (props) =>{
    const {totalContents, totalPosts, isWorking, revenue, impression,adImpression, ...others} = props
	const [cpmAverage, setCPMAverage] = useState(0)

	useEffect(() => {
		const temp = round((revenue || 0)/adImpression*1000,2)
		setCPMAverage(temp)
	},[revenue, adImpression])

    return (
        <Grid container spacing={1}>
            <Grid item md={4} sm={6} xs={12}>                
                <SummaryWidget 
                    title = "Contents"
                    value = {totalContents}
                    description = "see all contents"
                    href = "https://google.com"
                    chartType = "line-chart"
					isWorking = {isWorking}
                />
            </Grid>

            <Grid item md={4} sm={6} xs={12}>
                <SummaryWidget 
                    title = "Post"
                    value = {totalPosts}
                    description = "30% less then last month"
                    chartType = "line-chart"
					isWorking = {isWorking}
                />
            </Grid>
            
            <Grid item md={4} sm={6} xs={12}>
                <SummaryWidget 
                    title = "Impression"
                    value = {impression.toLocaleString("vi-VN")}
                    description = "30% less then last month"
                    chartType = "line-chart"
					isWorking = {isWorking}
                />
            </Grid>
            
            <Grid item md={4} sm={4} xs={12}>
				<SummaryWidget 
                    title = "Ad Impression"
                    value = {adImpression.toLocaleString("vi-VN")}
                    description = "30% less then last month"
                    chartType = "line-chart"
					isWorking = {isWorking}
                />                
            </Grid>

			<Grid item md={4} sm={4} xs={12}>
				<SummaryWidget 
                    title = "Revenue"
                    value = {revenue.toLocaleString("vi-VN")}
                    description = "30% less then last month"
                    chartType = "line-chart"
					isWorking = {isWorking}
                />                
            </Grid>

			<Grid item md={4} sm={4} xs={12}>
				<SummaryWidget 
                    title = "CPM average"
                    value = {cpmAverage.toLocaleString("vi-VN")}
                    description = "30% less then last month"
                    chartType = "line-chart"
					isWorking = {isWorking}
                />                
            </Grid>
        </Grid>
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