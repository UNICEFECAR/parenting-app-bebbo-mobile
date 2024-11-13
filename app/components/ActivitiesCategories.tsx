import { activityCategoryobj, activityCategoryUniqueNameObj } from '@assets/translations/appOfflineData/apiConstants';
import React from 'react';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { Pressable, StyleSheet, View } from "react-native";
import { useAppSelector } from '../../App';
import { ActivityFilter, FilterBox, FilterText } from './shared/FilterStyle';
import { FlexDirRow } from './shared/FlexBoxStyle';
import { GAME_CATEGORY_SELECTED } from '@assets/data/firebaseEvents';
import { activitiesColor, bgcolorWhite2 } from '@styles/style';
import { logEvent } from '../services/EventSyncService';
import useNetInfoHook from '../customHooks/useNetInfoHook';
type ActivityCategoriesProps = {
    borderColor?: any;
    filterOnCategory?: any;
    filterArray?: any;
    fromPage?: any;
    onFilterArrayChange?: any;
}
const styles = StyleSheet.create({
    filterBoxbg1: {
        backgroundColor: activitiesColor
    },
    filterBoxbg2: {
        backgroundColor: bgcolorWhite2
    },
    iconStyle: {
        marginLeft: 10,
    },
    innerView: {
        flex: 1,
        flexDirection: 'column'
    },
    pressableView: {
        flex: 1,
    },
    viewStyle: {
        marginLeft: 'auto',
        marginRight: 'auto',
        minHeight: 120,
        padding: 10,
        width: '100%',
    }
})
const ActivitiesCategories = (props: ActivityCategoriesProps): any => {
    const netInfo = useNetInfoHook();
    const activityCategoryData = useAppSelector(
        (state: any) =>
            JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
    );
    const taxonomyIds = useAppSelector(
        (state: any) =>
          state.utilsData.taxonomyIds,
      );
    const getFilterArray = (itemId: any, filterArray: any[]): any => {
        if (!filterArray.includes(itemId)) {
            filterArray.push(itemId);
            const eventData = { 'name': GAME_CATEGORY_SELECTED + "_" + itemId }
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
    const categoryIds = taxonomyIds?.activityCategoryArray;

    activityCategoryUniqueNameObj.forEach((item, index) => {
        if (categoryIds[index] !== undefined) {
            item.id = categoryIds[index];
        }
    });

    console.log('activityCategoryUniqueNameObj data is', activityCategoryUniqueNameObj);
    const activityBrackets = chunk(activityCategoryobj, 2)
    return (
        <>
            <ActivityFilter key={props.filterArray.length}>
                <View style={styles.viewStyle}>
                    <FlexDirRow>
                        {activityBrackets.map((activityCategoryInner: any[], i: number) => {
                            return (<View key={i} style={styles.innerView} >
                                {
                                    activityCategoryInner.map((item) => {
                                        return (<Pressable style={styles.pressableView} key={item.id} onPress={async (): Promise<any> => {
                                            props.filterOnCategory(getFilterArray(item.id, props.filterArray))
                                        }}>
                                            <FilterBox style={props.filterArray.includes(item.id) ? styles.filterBoxbg1 : styles.filterBoxbg2}>
                                                <OuterIconRow>
                                                    <OuterIconLeft>
                                                        <Icon style={styles.iconStyle} name={item.image} size={20} color="#000" />
                                                    </OuterIconLeft>
                                                </OuterIconRow>

                                                <FilterText numberOfLines={2}>{activityCategoryData?.filter((x: any) => x.id == item.id)[0]?.name}</FilterText>
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