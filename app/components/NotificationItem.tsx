import Icon from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading5Bold } from '@styles/typography';
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
import { ThemeContext } from 'styled-components';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FormOuterCheckbox } from './shared/ChildSetupStyle';


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
    console.log(type);
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
      <View
        style={{
          flexDirection: 'row',
          // paddingVertical: 10,
          marginVertical: 10,
        }}
       >
        <View
          style={{
            flex: 1,
            marginVertical: 10,
          }}>
          <Icon
            name={geticonname(item.type)}
            size={20}
            color="#000"
            style={{
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 50,
              backgroundColor: item.bgColor,
            }}
          />
        </View>

        <View style={{flexDirection: 'column', flex: 5}}>
          <View>
            <Text>{item.title}</Text>
            <Text>{item.timeStamp}</Text>
            <Pressable onPress={() => gotoPage(item.type)}>
              <Text>{getButtonname(item.type)}</Text>
            </Pressable>
          </View>
          
        </View>
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
                width: 50,
                height: 50,
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
      </View>
    </>
  );
};
export default NotificationItem;
