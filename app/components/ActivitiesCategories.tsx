import { activityCategoryobj } from '@assets/translations/appOfflineData/apiConstants';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAppSelector } from '../../App';
import { ActivityFilter, FilterBox, FilterText } from './shared/FilterStyle';
import { FlexDirRow } from './shared/FlexBoxStyle';
import analytics from '@react-native-firebase/analytics';
import { GAME_CATEGORY_SELECTED } from '@assets/data/firebaseEvents';
type ActivityCategoriesProps = {
    borderColor?: any,
    filterOnCategory?: Function,
    filterArray?: any,
    fromPage?: any,
    onFilterArrayChange?: Function
}
const ActivitiesCategories = (props: ActivityCategoriesProps) => {
    const activityCategoryData = useAppSelector(
        (state: any) =>
            JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
    );
    const getFilterArray = (itemId: any, filterArray: any[]) => {
        // filterArray.push("78");
        // console.log(filterArray,"includes(itemId)--",itemId);
        if (!filterArray.includes(itemId)) {
            filterArray.push(itemId);
               analytics().logEvent(GAME_CATEGORY_SELECTED, {game_category_id:itemId});
                                      
        } else {
            filterArray.splice(filterArray.indexOf(itemId), 1);
        }
        // console.log("after update",filterArray);
        // filterArraycurr=[...filterArray];
        // filterArray = [...filterArray];
        props.onFilterArrayChange(filterArray);
        return filterArray;
    };
    const chunk = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    const activityBrackets = chunk(activityCategoryobj, 2)
    // const buttonData = [
    //     { iconName: 'ic_act_emotional', displayName: 'Emotional' },
    //     { iconName: 'ic_act_language', displayName: 'Language' },
    //     { iconName: 'ic_act_cognitive', displayName: 'Cognitive' },
    //     { iconName: 'ic_act_movement', displayName: 'Movement' }
    // ];
    return (
        <>


            {/* <View style={{maxWidth:280,width:'100%',marginLeft:'auto',marginRight:'auto', padding: 10,backgroundColor:props.backgroundColor, minHeight: 120, }}> */}
            <ActivityFilter key={props.filterArray.length}>
            <View style={{
          padding: 10,
          minHeight: 120,
          maxWidth:280,
          width:'100%',
          marginLeft:'auto'
          ,marginRight:'auto',
         
        }}>
                <FlexDirRow>
                    {activityBrackets.map((activityCategoryInner: any[], i: number) => {
                        return (<View key={i} style={{ flex: 1, flexDirection: 'column' }} >
                            {
                                activityCategoryInner.map((item) => {
                                    return (<Pressable style={{ flex: 1, }} key={item.id} onPress={async() => {
                                        props.filterOnCategory(getFilterArray(item.id, props.filterArray)) }}>
                                        <FilterBox style={[{backgroundColor:(props.filterArray.includes(item.id) ? "#0FD87E" : "#fff")}]}>
                                            <OuterIconRow>
                                                <OuterIconLeft>
                                                    <Icon style={styles.iconStyle} name={item.image} size={20} color="#000" />
                                                </OuterIconLeft>
                                            </OuterIconRow>

                                            <FilterText>{activityCategoryData.filter((x: any) => x.id==item.id)[0].name }</FilterText>
                                        </FilterBox>
                                    </Pressable>)
                                })
                            }
                        </View>)
                    })}
                </FlexDirRow>
                </View>
                {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.item} >
                <FilterBox>
                <OuterIconRow>
                         <OuterIconLeft>
                         <Icon style={styles.iconStyle} name={buttonData[2].iconName} size={20} color="#000" />
                         </OuterIconLeft>
                         </OuterIconRow>
                        
                         <FilterText>{buttonData[2].displayName}</FilterText>
                    </FilterBox>
                    </View>
                    <View style={styles.item} >
                    <FilterBox>
                    <OuterIconRow>
                         <OuterIconLeft>
                         <Icon style={styles.iconStyle} name={buttonData[3].iconName} size={20} color="#000" />
                         </OuterIconLeft>
                         </OuterIconRow>
                        
                        <FilterText>{buttonData[3].displayName}</FilterText>
                    </FilterBox>
                    </View>
                </View> */}
            </ActivityFilter>
        </>
    );
};
export default ActivitiesCategories;
const styles = StyleSheet.create({
    iconStyle: {
        marginLeft: 10,
    },
    item: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        margin: 5,
        // padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    // title: {
    //     fontSize: 10,
    //     // padding: 5,
    //     margin: 0,
    //     flex: 2,
    //     width: 120,
    //     fontWeight: 'bold',
    //     justifyContent: 'flex-start'
    // },
})