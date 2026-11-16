import { Heading2w } from "@styles/typography";
import React from "react";
import {StyleSheet} from 'react-native';
import HeaderBabyMenu from "./HeaderBabyMenu";
import HeaderNotiIcon from "./HeaderNotiIcon";
import BurgerIcon from "./shared/BurgerIcon";
import {
  HeaderRowView,
  HomeHeaderTitleView,
} from './shared/HeaderContainerStyle';


const headerHeight = 50;
const styles = StyleSheet.create({
  row: {
    // HeaderRowView's flex: 1 is useful to legacy capped rows, but a
    // content-sized tab header must not share the screen's free height.
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    minHeight: headerHeight,
  },
});
const TabScreenHeader = (props: any): any => {
  const headerColor = props.headerColor;
  const textColor = props.textColor;
  return (
    <>
      <HeaderRowView
        style={[styles.row, {backgroundColor: headerColor}]}
      >
        <BurgerIcon color={textColor} />
        <HomeHeaderTitleView>
          <Heading2w numberOfLines={2} ellipsizeMode="tail" style={{ color: textColor }}> {props.title}</Heading2w>
        </HomeHeaderTitleView>
        <HeaderNotiIcon color={textColor} isVisibleIcon={true} />
        <HeaderBabyMenu
          color={textColor}
          setProfileLoading={props.setProfileLoading}
        />
      </HeaderRowView>
    </>
  );
};
export default TabScreenHeader;
