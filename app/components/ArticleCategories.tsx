// import { articleCategoryobj } from '@assets/translations/appOfflineData/apiConstants';
import { appConfig } from '../instance';
import { ArticleCategoriesProps } from '@screens/home/bottomTabs/Articles';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../App';
import { ArticleFilter, FilterBox, FilterText } from './shared/FilterStyle';
import { FlexDirRow } from './shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from './shared/Icon';
import { ADVICE_CATEGORY_SELECTED } from '@assets/data/firebaseEvents';
import { articleColor, bgcolorWhite2 } from '@styles/style';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import { logEvent } from '../services/EventSyncService';
const styles = StyleSheet.create({
  filterBoxbg1: {
    backgroundColor: articleColor
  },
  filterBoxbg2: {
    backgroundColor: bgcolorWhite2
  },
  iconStyle: {
    marginLeft: 10
  },
  innerView: { flex: 1, flexDirection: 'column' },
  pressableView: { flex: 1 }
});
const ArticleCategories = (props: ArticleCategoriesProps): any => {
  const netInfo = useNetInfoHook();
  const categoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const getFilterArray = (itemId: any, filterArray: any[]): any => {
    if (!filterArray.includes(itemId)) {
      filterArray.push(itemId);
      const eventData = { 'name': ADVICE_CATEGORY_SELECTED + "_" + itemId }
      logEvent(eventData, netInfo.isConnected)

    } else {
      filterArray.splice(filterArray.indexOf(itemId), 1);
    }
    props.onFilterArrayChange(filterArray);
    return filterArray;
  };
  const chunk = (arr: any, size: any): any =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v: any, i: any) =>
      arr.slice(i * size, i * size + size)
    );
  const articleBrackets = chunk(appConfig.articleCategoryobj, 2)
  return (
    <>
      <ArticleFilter key={props.filterArray.length}>
        <FlexDirRow>
          {articleBrackets.map((articleCategoryInner: any[], i: number) => {
            return (<View key={i} style={styles.innerView}>
              {
                articleCategoryInner.map((item) => {
                  return (<Pressable style={styles.pressableView} key={item.id} onPress={(): any => {
                    props.filterOnCategory(getFilterArray(item.id, props.filterArray))
                  }}>
                    <FilterBox style={props.filterArray.includes(item.id) ? styles.filterBoxbg1 : styles.filterBoxbg2}  >
                      <OuterIconRow>
                        <OuterIconLeft>
                          <Icon
                            style={styles.iconStyle} name={item.image} size={20} color="#000" />
                        </OuterIconLeft>
                      </OuterIconRow>
                      <FilterText numberOfLines={2}>{categoryData.filter((x: any) => x.id == item.id)[0].name}</FilterText>
                    </FilterBox>
                  </Pressable>)
                })
              }
            </View>)
          })}

        </FlexDirRow>
      </ArticleFilter>
    </>
  );
};
export default ArticleCategories;
