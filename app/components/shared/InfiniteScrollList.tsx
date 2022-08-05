import { destinationFolder } from "@assets/translations/appOfflineData/apiConstants";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";
import downloadImages from "../../downloadImages/ImageStorage";
import RNFS from 'react-native-fs';
const InfiniteScrollList = (props : any) => {
    const { filteredData , renderArticleItem, receivedLoadingArticle } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 10;
    const totalDataCount = filteredData.length;
    const [page, setPage] = useState(1);
    const [clientData, setClientData] = useState([]);
    const [serverData, serverDataLoaded] = useState([]);
    const [loadmore, setLoadmore] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [pending_process, setPending_process] = useState(true);
    let onEndReachedCalledDuringMomentum = true;
    const flatListRef = useRef(null);
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

    const requestData = async (thePage: number) => {
        if(totalDataCount > 0)
        {
            setIsLoading(true);
            let data = filteredData.slice((thePage - 1) * limit, thePage * limit);
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
    const handleLoadMore = () => {
        if(!onEndReachedCalledDuringMomentum)
        {
            // loadmore && !pending_process
            if (clientData.length < totalDataCount) {
                const pagenew=page+1;
                setPage(page + 1);
                requestData(pagenew);
            }
            onEndReachedCalledDuringMomentum = true;
        }
    };
    const toTop = () => {
        // use current
        flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
    }
    const onRefresh = () => {
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
    const renderFooter = () => {
         return(
            isLoading ? <ActivityIndicator size="large" /> : null
        )
    };  
    return (
        <View style={{marginBottom:200}}>
            <FlatList
            ref={flatListRef}
            extraData={page}
            data={clientData}
            initialNumToRender={limit}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            onRefresh={() => onRefresh()}
            refreshing={refresh}
            renderItem={renderArticleItem}
            keyExtractor={(item) => item.id.toString()}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum = false;
            }}
            ListFooterComponent={renderFooter}
            /> 
        </View>
    )
}

export default InfiniteScrollList