import React from "react";
import { useAppSelector } from "../../App";
import ScrollingButtonMenu from "../services/ScrollingButtonMenu";
import { appConfig } from "../instances";
import { useNavigation } from "@react-navigation/native";
import { selectChildAge } from "../services/selectors";

const AgeBrackets = ({
  currentSelectedChildId,
  showSelectedBracketData,
  activatedItemColor,
  itemColor,
  ItemTintColor,
  isActivity,
}: any) => {
  const navigation = useNavigation();
  const childAge = useAppSelector(selectChildAge);

  let filteredAge = isActivity
    ? childAge.filter(
        (item: { name: string }) => item.id != appConfig.pregnancyId
      )
    : [...childAge].sort((a, b) =>
        a.name === "Pregnancy" ? -1 : b.name === "Pregnancy" ? 1 : 0
      );

  return (
    <ScrollingButtonMenu
      items={filteredAge}
      onPress={showSelectedBracketData}
      selected={currentSelectedChildId}
      activeBackgroundColor={activatedItemColor}
      activeColor={itemColor}
      buttonStyle={{ backgroundColor: ItemTintColor }}
      navigation={navigation}
    />
  );
};

export default React.memo(AgeBrackets); // Memoize to prevent unnecessary re-renders
