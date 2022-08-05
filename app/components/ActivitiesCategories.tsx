import { activityCategoryobj } from '@assets/translations/appOfflineData/apiConstants';
import React from 'react';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { Pressable, StyleSheet, View } from "react-native";
import { useAppSelector } from '../../App';
import { ActivityFilter, FilterBox, FilterText } from './shared/FilterStyle';
import { FlexDirRow } from './shared/FlexBoxStyle';
import analytics from '@react-native-firebase/analytics';
import { GAME_CATEGORY_SELECTED } from '@assets/data/firebaseEvents';
type ActivityCategoriesProps = {
    borderColor?: any,
    filterOnCategory?: any,
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
        if (!filterArray.includes(itemId)) {
            filterArray.push(itemId);
            analytics().logEvent(GAME_CATEGORY_SELECTED+"_"+itemId);                    
        } else {
            filterArray.splice(filterArray.indexOf(itemId), 1);
        }
        props.onFilterArrayChange(filterArray);
        return filterArray;
    };
    const chunk = (arr: any, size: any) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    const activityBrackets = chunk(activityCategoryobj, 2)
    return (
        <>


            <ActivityFilter key={props.filterArray.length}>
            <View style={{
          padding: 10,
          minHeight: 120,
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

                                            <FilterText numberOfLines={2}>{activityCategoryData.filter((x: any) => x.id==item.id)[0].name }</FilterText>
                                        </FilterBox>
                                    </Pressable>)
                                })
                            }
                        </View>)
                    })}
                </FlexDirRow>
                </View>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }
})