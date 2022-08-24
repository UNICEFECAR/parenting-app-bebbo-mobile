import React from 'react';
import { useAppSelector } from '../../App';
import ScrollingButtonMenu from '../services/ScrollingButtonMenu';
const AgeBrackets = (props: any):any => {
  const {currentSelectedChildId, showSelectedBracketData, activatedItemColor, itemColor, ItemTintColor} = props;
  const childAge = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
     );
  return (
    <>
    <ScrollingButtonMenu
                items={childAge}
                onPress={(item: any):any => {
                    showSelectedBracketData(item)
                }}
                selected={currentSelectedChildId}
                activeBackgroundColor={activatedItemColor}
                activeColor={itemColor}
                buttonStyle={{backgroundColor:ItemTintColor}}
            />
    </>
  );
};
export default AgeBrackets;
