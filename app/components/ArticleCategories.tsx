import { activityCategory } from '@types/apiConstants';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../App';
import { ArticleFilter,FilterBox,FilterText } from './shared/FilterStyle';
import { FlexDirRow } from './shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from './shared/Icon';
let filterArray: string[] = [];
const getFilterArray = (itemId: any) => {
  // filterArray.push("78");
  //   console.log(filterArray,"includes(itemId)--",filterArray.includes(itemId));
  if (!filterArray.includes(itemId)) {
    filterArray.push(itemId);
  } else {
    filterArray.splice(filterArray.indexOf(itemId), 1);
  }
  // filterArray=filterArray;
  return filterArray;
};
const ArticleCategories = (props: any) => {
  const categoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );

  //   console.log("filterArray on start ",filterArray)
  const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
const articleBrackets = chunk(activityCategory, 2)
//console.log(chunk(articleBrackets, 2));
//   const articleBrackets = new Array(Math.ceil(activityCategory.length / 3)).fill().map(_ => activityCategory.splice(0, 3))
  
//   activityCategory.splice(0, 3);
 // console.log(articleBrackets);
  return (
    <>
      <ArticleFilter>
        <FlexDirRow>
          {articleBrackets.map((activityCategoryInner:any[], i:number) => {
             // console.log(activityCategoryInner)
            return (<View key={i} style={{flex: 1, flexDirection: 'column'}}>
                {
                 activityCategoryInner.map((item) => {
                    return (<Pressable style={{flex:1,}} key={item.id} onPress={()=>{props.filterOnCategory(getFilterArray(item.id))}}>
                    <FilterBox style={[{backgroundColor:(filterArray.includes(item.id) ? "#FF8D6B" : "#fff")}]}  >
                       <OuterIconRow>
                         <OuterIconLeft>
                              <Icon 
                              style={styles.iconStyle} name={item.image} size={20} color="#000" />
                         </OuterIconLeft>
                         </OuterIconRow>
                       <FilterText>{categoryData.filter((x: any) => x.id==item.id)[0].name }</FilterText>
                   </FilterBox>
                   </Pressable>)
                 })  
                }
            </View>)
          })}

          {/* {activityCategory?.length>0 ? activityCategory.map((item,index) => {
                        return <TouchableOpacity style={{flex:1,}} key={item.id} onPress={()=>{props.filterOnCategory(getFilterArray(item.id))}}>
                         <View style={[styles.item,{backgroundColor:(filterArray.includes(item.id) ? "#000" : "#fff")}]}  >
                            <Icon style={styles.iconStyle} name={item.image} size={20} color="#000" />
                            <Text style={[styles.title,{color:(filterArray.includes(item.id) ? "#fff" : "#000")}]}>{categoryData.filter((x: any) => x.id==item.id)[0].name }</Text>
                        </View>
                        </TouchableOpacity>
                    }) : null} */}
                </FlexDirRow>

        {/* <View style={styles.item} >
                        <Icon style={styles.iconStyle} name="ic_artl_play" size={20} color="#000" />
                        <Text style={styles.title}>{categoryData.filter((x: any) => x.id==activityCategory.playingAndLearning)[0].name }</Text>
                    </View>
                    <View style={styles.item} >
                        <Icon style={styles.iconStyle} name="ic_artl_health" size={20} color="#000" />
                        <Text style={styles.title}>{categoryData.filter((x: any) => x.id==activityCategory.healthAndWellbeing)[0].name }</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_artl_safety" size={20} color="#000" />
                        <Text style={styles.title}>{categoryData.filter((x: any) => x.id==activityCategory.safetyAndProtection)[0].name }</Text>
                    </View> */}

        {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_artl_responsive" size={20} color="#000" />
                        <Text style={styles.title}>{categoryData.filter((x: any) => x.id==activityCategory.responsiveParenting)[0].name }</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_artl_parenting" size={20} color="#000" />
                        <Text style={styles.title}>{categoryData.filter((x: any) => x.id==activityCategory.parentingCorner)[0].name }</Text>
                    </View>
                    <View style={styles.item}>
                        <Icon style={styles.iconStyle} name="ic_artl_nutrition" size={20} color="#000" />
                        <Text style={styles.title}>{categoryData.filter((x: any) => x.id==activityCategory.nutritionAndBreastfeeding)[0].name }</Text>
                    </View>
                </View> */}
      </ArticleFilter>
    </>
  );
};
export default ArticleCategories;
const styles = StyleSheet.create({
  // item: {
  //   backgroundColor: '#FFF',
  //   borderRadius: 5,
  //   margin: 5,
  //   // padding: 10,item
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignitems: 'center',
  //   flexDirection: 'row',
  // },
  iconStyle: {
    flex: 1,
    marginLeft: 10,
  },
  // title: {
  //   fontSize: 10,
  //   // padding: 5,
  //   margin: 0,
  //   flex: 2,
  //   width: 100,
  //   fontWeight: 'bold',
  //   justifyContent: 'flex-start',
  // },
});
