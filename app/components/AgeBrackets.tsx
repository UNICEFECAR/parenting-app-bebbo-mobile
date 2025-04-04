import React from "react";
import { useAppSelector } from "../../App";
import ScrollingButtonMenu from "../services/ScrollingButtonMenu";
import { appConfig } from "../instance";

const AgeBrackets = ({
  currentSelectedChildId,
  showSelectedBracketData,
  activatedItemColor,
  itemColor,
  ItemTintColor,
  isActivity,
}: any) => {
  const childAge = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : []
  );

  const sortedChildAge = React.useMemo(() => {
    let filteredAge = isActivity
      ? childAge.filter(
          (item: { name: string }) => item.id != appConfig.pregnancyId
        ) // Remove "Pregnancy" if isActivity is true
      : [...childAge].sort((a, b) =>
          a.name === "Pregnancy" ? -1 : b.name === "Pregnancy" ? 1 : 0
        );

    return filteredAge;
  }, [childAge, isActivity]); // Memoize sorting to avoid unnecessary recalculations

  return (
    <ScrollingButtonMenu
      items={sortedChildAge}
      onPress={showSelectedBracketData}
      selected={currentSelectedChildId}
      activeBackgroundColor={activatedItemColor}
      activeColor={itemColor}
      buttonStyle={{ backgroundColor: ItemTintColor }}
    />
  );
};

export default React.memo(AgeBrackets); // Memoize to prevent unnecessary re-renders
