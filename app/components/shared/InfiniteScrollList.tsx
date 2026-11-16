import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
const styles = StyleSheet.create({containerView: {marginBottom: 200}});
const limit = 10;
const InfiniteScrollList = (props: any): any => {
  const {filteredData, renderArticleItem, receivedLoadingArticle} = props;
  const [pagination, setPagination] = useState({source: filteredData, page: 1});
  // A new filter result starts at page one in the same render, including an empty result.
  const page = pagination.source === filteredData ? pagination.page : 1;
  const clientData = useMemo(() => filteredData.slice(0, page * limit), [filteredData, page]);
  const momentumUsed = useRef(true);
  const flatListRef = useRef<FlatList<unknown> | null>(null);
  useEffect(() => {
    momentumUsed.current = true;
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  }, [filteredData]);
  useEffect(() => {receivedLoadingArticle(false);}, [receivedLoadingArticle, filteredData, page]);
  const handleLoadMore = (): void => {
    if (momentumUsed.current || clientData.length >= filteredData.length) return;
    momentumUsed.current = true;
    setPagination({source: filteredData, page: page + 1});
  };
  const onRefresh = (): void => {
    momentumUsed.current = true;
    setPagination({source: filteredData, page: 1});
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };
  return (
    <View style={styles.containerView}>
      <FlatList ref={flatListRef} extraData={page} data={clientData}
        initialNumToRender={limit} onEndReached={handleLoadMore} onEndReachedThreshold={0.3}
        onRefresh={onRefresh} refreshing={false} renderItem={renderArticleItem}
        keyExtractor={(item: any): any => item?.id?.toString()}
        onMomentumScrollBegin={() => {momentumUsed.current = false;}} />
    </View>
  );
};
export default InfiniteScrollList;
