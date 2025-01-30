import {
  Heading2w
} from '@styles/typography';
import React from 'react';
import HeaderBabyMenu from './HeaderBabyMenu';
import HeaderNotiIcon from './HeaderNotiIcon';
import BurgerIcon from './shared/BurgerIcon';
import {
  HeaderRowView,
  HeaderTitleView,
  HomeHeaderTitleView
} from './shared/HeaderContainerStyle';
const headerHeight = 50;
const TabScreenHeader = (props: any): any => {
  const headerColor = props.headerColor;
  const textColor = props.textColor;
  return (
    <>
      <HeaderRowView
        style={{
          backgroundColor: headerColor,
          maxHeight: headerHeight,
        }}>
        <BurgerIcon color={textColor} />
        <HomeHeaderTitleView>
          <Heading2w style={{ color: textColor }}> {props.title}</Heading2w>
        </HomeHeaderTitleView>
        <HeaderNotiIcon color={textColor} isVisibleIcon={true} />
        <HeaderBabyMenu color={textColor} setProfileLoading={props.setProfileLoading} />
      </HeaderRowView>
    </>
  );
};
export default TabScreenHeader;

