import React from 'react';
import { useAppSelector } from '../../App';
import ScrollingButtonMenu from '../services/ScrollingButtonMenu';
const AgeBrackets = (props: any):any => {
  const {currentSelectedChildId, showSelectedBracketData, activatedItemColor, itemColor, ItemTintColor,isCurrentChildSelected} = props;
  const childAge = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
     );

     // Function to handle item selection
  const handleAgeBracketPress = (item: any): any => {
    console.log('currentchild id',item)
    console.log('isCurrentChildSelected id',isCurrentChildSelected)
    console.log('currentSelectedChildId id',currentSelectedChildId)
   
    if (!isCurrentChildSelected && currentSelectedChildId == item.id) {
      // If the same item is selected again (deselected), reset data and change bracket color
      showSelectedBracketData(null); // Reset data
      isCurrentChildSelected == true;
    } else {
      // If a different item is selected, update the selected item and its data
      showSelectedBracketData(item);
      isCurrentChildSelected == false;
      
    }
  };
  return (
    <>
    <ScrollingButtonMenu
                items={childAge}
                onPress={(item: any):any => {
                    showSelectedBracketData(item)
                   // handleAgeBracketPress(item)
                }}
                selected={currentSelectedChildId}
                activeBackgroundColor={activatedItemColor}
                activeColor={itemColor}
                //isCurrentChildSelected={isCurrentChildSelected}
                buttonStyle={{backgroundColor:ItemTintColor}}
            />
    </>
  );
};
export default AgeBrackets;
