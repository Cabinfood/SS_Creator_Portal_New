import { Table, TableBody, TableCell, TableRow, Box, Typography } from "@mui/material"
import numeral from 'numeral';
import { format } from 'date-fns';

const IPListTable = (props) => {
    const {
        onOpenDrawer,
        onPageChange,
        onRowsPerPageChange,
        ips,
        ipsCount,
        page,
        rowsPerPage,
        ...other
    } = props;

    return (
        <div {...other}>
            <Table>
                <TableBody>
                {ips.map((ip) => (
                    <TableRow
                        hover
                        key={ip.id}
                        onClick={() => onOpenDrawer?.(ip.id)}
                        sx={{ cursor: 'pointer' }}
                        >
                        <TableCell
                            sx={{
                            alignItems: 'center',
                            display: 'flex'
                            }}
                        >
                            {ip?.authorizeFrom && (
                                <Box
                                    sx={{
                                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                                        ? 'neutral.800'
                                        : 'neutral.200',
                                        borderRadius: 2,
                                        maxWidth: 'fit-content',
                                        ml: 3,
                                        p: 1
                                    }}
                                >
                                    
                                    <Typography
                                        align="center"
                                        variant="subtitle2"
                                    >
                                        {format(new Date(ip?.authorizeFrom), 'LLL').toUpperCase()}
                                    </Typography>
                                    <Typography
                                        align="center"
                                        variant="h6"
                                    >
                                        {format(new Date(ip?.authorizeFrom), 'd')}
                                    </Typography>
                                </Box>
                            )}
                            
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="subtitle2">
                                    {ip?.title}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    variant="body2"
                                >
                                    Bao gồm
                                    {' '}
                                    {ip?.reference?.length.toLocaleString("VN-vi")} {` tham chiếu`}
                                </Typography>
                            </Box>
                        </TableCell>
                        <TableCell align="right">
                            {/* <SeverityPill color={severityMap[ip.status] || 'warning'}>
                            {ip.status}
                            </SeverityPill> */}
                        </TableCell>
                    </TableRow>                    
                ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default IPListTable