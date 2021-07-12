import {
  Heading2w
} from '@styles/typography';
import React from 'react';
import HeaderBabyMenu from './HeaderBabyMenu';
import BurgerIcon from './shared/BurgerIcon';
import {
  HeaderRowView,
  HeaderTitleView
} from './shared/HeaderContainerStyle';
const headerHeight = 50;
const TabScreenHeader = (props: any) => {
  const headerColor = props.headerColor;
  const textColor = props.textColor;
 
  return (
    <>
      
      <HeaderRowView
        style={{
          backgroundColor: headerColor,
          maxHeight: headerHeight,
        }}>
        <BurgerIcon color={textColor}/>
        <HeaderTitleView>
          <Heading2w style={{color:textColor}}> {props.title}</Heading2w>
        </HeaderTitleView>
        <HeaderBabyMenu color={textColor}/>
      </HeaderRowView>
    </>
  );
};
export default TabScreenHeader;

