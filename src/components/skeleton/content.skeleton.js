import { Card,Divider, Typography, Link, CardContent, CardActions, Grid, Skeleton, Box} from '@mui/material';
const ContentSkeleton = (props) => {
    const {times} = props
    return (
        <Box>
            {_.times(times || 1, (i)=>(
                <Card key={i} sx={{
                    marginBottom: "10px"
                }}>
                    <Grid container spacing={1.5}>
                        <Grid item xs={3} md={3}>                    
                            <Skeleton variant="rectangular" height="100%" width="100%"/>
                        </Grid>
                        <Grid item xs={9} md={9} rowSpacing={10} sx={{padding: "30px 10px !important"}}>
                            <Skeleton variant="text"/>
                            <Skeleton variant="text"/>
                            <Skeleton variant="text"/>
                            <Box display='flex' flexDirection='row' gap={1} mt={1}>
                                <Skeleton variant="text" width={120}/>
                                <Skeleton variant="text" width={120}/>
                                <Skeleton variant="text" width={120}/>
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            ))}
        </Box>        
    )

}

export default ContentSkeleton;