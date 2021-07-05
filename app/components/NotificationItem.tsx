import Icon from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading4Regular, Heading5Bold, Heading6, ShiftFromTop10, ShiftFromTop5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';
import { ThemeContext } from 'styled-components/native';
import { ButtonTextSmLineL } from './shared/ButtonGlobal';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FormOuterCheckbox } from './shared/ChildSetupStyle';
import { MainContainer } from './shared/Container';
import Divider, { DividerContainer } from './shared/Divider';
import { FDirRow, FDirRowStart, FlexDirRowStart, } from './shared/FlexBoxStyle';
import { NotifAction, NotificationListContainer, NotifIcon, NotifiContent } from './shared/NotificationStyle';


const NotificationItem = (props:any) => {
  const {item, itemIndex} = props;
  // console.log(item,itemIndex);
  const isDeleteEnabled = props.isDeleteEnabled;  
  const themeContext = useContext(ThemeContext);
  const navigation = useNavigation();
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const geticonname = (type: string) => {
    return type == 'growth'
      ? 'ic_growth'
      : type == 'development'
      ? 'ic_milestone'
      : type == 'vaccination'
      ? 'ic_vaccination'
      : type == 'healthchkp'
      ? 'ic_doctor_chk_up'
      : 'ic_growth';
  };
  const getButtonname = (type: string) => {
    return type == 'growth'
      ? 'Add New Measurement'
      : type == 'development'
      ? 'Track your milestones'
      : type == 'vaccination'
      ? 'View Vaccination details'
      : type == 'healthchkp'
      ? 'View HealthCheck-up Details'
      : '';
  };
  const gotoPage = (type: string) => {
    //console.log(type);
    type == 'growth'
      ? navigation.navigate('AddNewChildgrowth', {
          headerTitle: t('growthScreenaddNewBtntxt'),
        })
      : type == 'development'
      ? navigation.navigate('Home', {screen: 'ChildDevelopment'})
      : type == 'vaccination'
      ? navigation.navigate('AddChildVaccination', {
          headerTitle: t('growthScreeneditNewBtntxt'),
        })
      : type == 'healthchkp'
      ? navigation.navigate('AddChildHealthCheckup', {
          headerTitle: t('growthScreeneditNewBtntxt'),
        })
      : '';
  };
  const {t} = useTranslation();
  const [toggleCheckBox, setToggleCheckBox] = useState(item.isChecked);
  return (
    <>
  <NotificationListContainer>
    <FlexDirRowStart>
        <NotifIcon style={{
              backgroundColor: item.bgColor,
            }}>
          
          <Icon
            name={geticonname(item.type)}
            size={20}
            color="#000"
            
          />
        </NotifIcon>
        <NotifiContent>
        <Heading4Regular>{item.title}</Heading4Regular>
        <ShiftFromTop5>
        <Heading6>{item.timeStamp}</Heading6>
        </ShiftFromTop5>
        <ShiftFromTop10>
        <Pressable onPress={() => gotoPage(item.type)}>
              <ButtonTextSmLineL>{getButtonname(item.type)}</ButtonTextSmLineL>
            </Pressable></ShiftFromTop10>
        </NotifiContent>

        <NotifAction>
        {(isDeleteEnabled===true) ? (
          <FormOuterCheckbox
            onPress={() => {
              //  console.log(item);
              setToggleCheckBox(!toggleCheckBox);
              props.onItemChecked(itemIndex,!toggleCheckBox)
            }}>
            <CheckboxItem>
              <View>
                {toggleCheckBox ? (
                  <CheckboxActive>
                    <Icon name="ic_tick" size={12} color="#000" />
                  </CheckboxActive>
                ) : (
                  <Checkbox style={{borderWidth:1}}></Checkbox>
                )}
              </View>
            </CheckboxItem>
          </FormOuterCheckbox>
        ) : (
          <>
            <Menu
              renderer={renderers.ContextMenu}
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onSelect={(value) =>
                console.log(`Selected number: ${value} ${item}`)
              }>
              <MenuTrigger>
                <Icon
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    alignSelf: 'center',
                  }}
                  name={'ic_kebabmenu'}
                  size={25}
                  color="#000"
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    marginTop: 30,
                    borderRadius: 10,
                    backgroundColor: primaryTintColor,
                  },
               
                  optionWrapper: {
                    borderBottomWidth: 1,
                    padding: 15,
                  },
                  
                }}>
                <MenuOption value={1}>
                  <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                </MenuOption>
                <MenuOption value={2}>
                  <Heading5Bold>{t('notiOption2')}</Heading5Bold>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </>
        )}
        </NotifAction>
        
      </FlexDirRowStart>
    
    </NotificationListContainer>
    <DividerContainer><Divider></Divider></DividerContainer>
    </>
  );
};
export default NotificationItem;
