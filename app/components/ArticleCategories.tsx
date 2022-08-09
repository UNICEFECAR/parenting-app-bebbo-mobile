import { articleCategoryobj } from '@assets/translations/appOfflineData/apiConstants';
import { ArticleCategoriesProps } from '@screens/home/bottomTabs/Articles';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../App';
import { ArticleFilter, FilterBox, FilterText } from './shared/FilterStyle';
import { FlexDirRow } from './shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from './shared/Icon';
import { ADVICE_CATEGORY_SELECTED } from '@assets/data/firebaseEvents';
import analytics from '@react-native-firebase/analytics';
const ArticleCategories = (props: ArticleCategoriesProps) => {
  const categoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const getFilterArray = (itemId: any,filterArray: any[]) => {
    if (!filterArray.includes(itemId)) {
      filterArray.push(itemId);
       analytics().logEvent(ADVICE_CATEGORY_SELECTED+"_"+itemId);

    } else {
      filterArray.splice(filterArray.indexOf(itemId), 1);
    }
    props.onFilterArrayChange(filterArray);
    return filterArray;
  };
  const chunk = (arr:any, size:any) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v:any, i:any) =>
    arr.slice(i * size, i * size + size)
  );
const articleBrackets = chunk(articleCategoryobj, 2)
  return (
    <>
      <ArticleFilter key={props.filterArray.length}>
        <FlexDirRow>
          {articleBrackets.map((articleCategoryInner:any[], i:number) => {
            return (<View key={i} style={styles.innerView}>
                {
                 articleCategoryInner.map((item) => {
                    return (<Pressable style={styles.pressableView} key={item.id} onPress={()=>{
                      props.filterOnCategory(getFilterArray(item.id,props.filterArray))}}>
                    <FilterBox style={props.filterArray.includes(item.id) ? styles.filterBoxbg1 : styles.filterBoxbg2}  >
                       <OuterIconRow>
                         <OuterIconLeft>
                              <Icon 
                              style={styles.iconStyle} name={item.image} size={20} color="#000" />
                         </OuterIconLeft>
                         </OuterIconRow>
                       <FilterText numberOfLines={2}>{categoryData.filter((x: any) => x.id==item.id)[0].name }</FilterText>
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
const styles = StyleSheet.create({
  iconStyle: {
    marginLeft: 10
  },
  innerView:{flex: 1, flexDirection: 'column'},
  pressableView:{flex:1},
  filterBoxbg1:{
    backgroundColor:"#FF8D6B"
    },
    filterBoxbg2:{
        backgroundColor:"#fff"
    }
});