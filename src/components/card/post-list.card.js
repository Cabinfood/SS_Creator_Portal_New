import { Button, Card, CardContent } from "@mui/material"
import { useEffect, useState } from "react"
import ChannelApiClient from "../../api-clients/channel.api-client"
import { PostInsightComponent } from "../analytics/posts-insight.component"
import cookieLib from "../../lib/cookie.lib"
import { Box } from "@mui/system"
import LoadMoreButton from "../buttons/loadmore.button"
import { MAX_REQUEST_PAGE_SIZE } from "../../constant"
import { ObjectInsightFragment } from "../fragment/objects/insight.fragment"

export default function CardPostList(props) {
    const {channelNotionID} = props
    const token = cookieLib.getCookie("token")
    const [isWorking, setIsWorking] = useState(false)

    const [posts, setPosts] = useState()
    const [hasMore, setHasMore] = useState(false)
    const [startCursor, setStartCursor] = useState()

    useEffect(()=>{
        getAllPostOfChannel()
    },[channelNotionID])
    
    const getAllPostOfChannel = async() => {
        if (isWorking) return;
        setIsWorking(true)

		const res = await ChannelApiClient.getPosts(token, channelNotionID, startCursor ? startCursor : undefined, MAX_REQUEST_PAGE_SIZE.DEFAULT)
        const {data} = res || {}
        const {results, has_more, next_cursor} = data || []		

        setPosts(results)
        setHasMore(has_more)
        setStartCursor(next_cursor)
        setIsWorking(false)
	}

    const loadMoreAction = async() => {
        if (isWorking) return;
        setIsWorking(true)
		
        const dataResponse = await ChannelApiClient.getPosts(token, channelNotionID, startCursor ? startCursor : undefined, MAX_REQUEST_PAGE_SIZE.LOAD_MORE)
        const {data} = dataResponse || {}
        const {results, has_more, next_cursor} = data || []
		setPosts([...posts,...results])

        setStartCursor(next_cursor)
        setHasMore(has_more)
        setIsWorking(false)
    }
    

    return (        
        <Box>
            <Card>
                {posts && posts?.map((post, index) => (
                    <CardContent 
                        key={index} 
                        sx={{
                            borderBottom: "1px solid #ddd",
                            py: 2,
                            '&:last-child td': {
                                border: 0
                            }
                        }}
                    >
                        <ObjectInsightFragment 
                            objectData = {post}
                        />
                        
                    </CardContent>
                ))}                
            </Card>
            <Box my={1}>
                {hasMore && (
                    <LoadMoreButton 
                        handleLoadMore = {loadMoreAction}
                        isWorking = {isWorking}
                    />
                )}							                
            </Box>
        </Box>
    )
}