import { useFocusEffect } from '@react-navigation/native';
import {
  Heading2w
} from '@styles/typography';
import React from 'react';
import {
  StyleSheet
} from 'react-native';
import { useAppDispatch } from '../../App';
import {
  getAllChildren,
  getAllConfigData
} from '../services/childCRUD';
import HeaderBabyMenu from './HeaderBabyMenu';
import BurgerIcon from './shared/BurgerIcon';
import {
  HeaderRowView,
  HeaderTitleView
} from './shared/HeaderContainerStyle';
const headerHeight = 50;
const TabScreenHeader = (props: any) => {
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
    }, []),
  );
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
        {/* <HeaderActionView>
          <HeaderActionBox
            onPress={() => {
              // console.log(modalVisible);
              if (modalVisible) {
                setModalVisible(false);
              } else {
                setModalVisible(true);
              }
            }}>
            <Icon name="ic_baby" size={25} color="#000" />
          </HeaderActionBox>
        </HeaderActionView> */}
      </HeaderRowView>
    </>
  );
};
export default TabScreenHeader;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    paddingTop: headerHeight,
  },

  modalView: {
    // margin: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 0,

    borderColor: '#000',
    borderBottomWidth: 2,
  },

  modalText: {
    textAlign: 'center',
    borderBottomWidth: 2,
  },
});
