import React, { useState, useEffect, useRef } from "react";
import { FlatList, View, ActivityIndicator, StyleSheet } from "react-native";
const styles = StyleSheet.create({
    containerView: {
        marginBottom:200
    }
})
const InfiniteScrollList = (props : any):any => {
    const { filteredData , renderArticleItem, receivedLoadingArticle } = props;
    const [isLoading, setIsLoading] = useState(false);
    const limit = 10;
    const totalDataCount = filteredData.length;
    const [page, setPage] = useState(1);
    const [clientData, setClientData] = useState([]);
    const [serverData, serverDataLoaded] = useState([]);
    const [refresh, setRefresh] = useState(false);
    let onEndReachedCalledDuringMomentum = true;
    const flatListRef = useRef(null);
    const requestData = async (thePage: number):Promise<any> => {
        if(totalDataCount > 0)
        {
            setIsLoading(true);
            const data = filteredData.slice((thePage - 1) * limit, thePage * limit);
            serverDataLoaded(data);
            if(data?.length>0){
                setIsLoading(false);
            }else {
                setIsLoading(false);
            }
            
        }else {
            receivedLoadingArticle(false);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        setClientData([]);
        if(page > 1)
        {
            setPage(1);
            requestData(1);
        }else {
            requestData(page);
        }
    },[filteredData])

    const toTop = ():any => {
        // use current
        flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
    }
    useEffect(() => {
            setRefresh(false);
            if(page == 1)
            {
                setClientData(serverData);
                toTop();
            }else {
                setClientData([...clientData, ...serverData]);
            }
            receivedLoadingArticle(false);
    }, [serverData]);
    const handleLoadMore = ():any => {
        if(!onEndReachedCalledDuringMomentum)
        {
            if (clientData.length < totalDataCount) {
                const pagenew=page+1;
                setPage(page + 1);
                requestData(pagenew);
            }
            onEndReachedCalledDuringMomentum = true;
        }
    };
   
    const onRefresh = ():any => {
            setRefresh(true);
            if(page != 1)
            {
                setClientData([]);
                setPage(1);
                requestData(1);
            }else {
                setRefresh(false);
            }
    };
    const renderFooter = ():any => {
         return(
            isLoading ? <ActivityIndicator size="large" /> : null
        )
    };  
    return (
        <View style={styles.containerView}>
            <FlatList
            ref={flatListRef}
            extraData={page}
            data={clientData}
            initialNumToRender={limit}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            onRefresh={():any => onRefresh()}
            refreshing={refresh}
            renderItem={renderArticleItem}
            keyExtractor={(item:any):any => item?.id?.toString()}
            onMomentumScrollBegin={():any => {
              onEndReachedCalledDuringMomentum = false;
            }}
            ListFooterComponent={renderFooter}
            /> 
        </View>
    )
}

export default InfiniteScrollList
