import Icon from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading4Bold, Heading4Regular, Heading5Bold, Heading6, ShiftFromTop10, ShiftFromTop5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Text, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { useDispatch } from 'react-redux';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { toggleNotificationRead } from '../redux/reducers/notificationSlice';
import { ButtonTextSmLineL } from './shared/ButtonGlobal';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FormOuterCheckbox } from './shared/ChildSetupStyle';
import { MainContainer } from './shared/Container';
import Divider, { DividerContainer } from './shared/Divider';
import { FDirRow, FDirRowStart, FlexDirRowStart, } from './shared/FlexBoxStyle';
import { NotifAction, NotificationListContainer, NotifIcon, NotifiContent } from './shared/NotificationStyle';


const NotificationItem = (props: any) => {
  const { item, itemIndex,onItemReadMarked,onItemDeleteMarked } = props;
  // console.log(item,itemIndex);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const isDeleteEnabled = props.isDeleteEnabled;
  const themeContext = useContext(ThemeContext);
  const hcheaderColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const navigation = useNavigation();
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const geticonname = (type: string) => {
    // console.log(type)
    return type == 'gw'
      ? 'ic_growth'
      : type == 'cd'
        ? 'ic_milestone'
        : type == 'vc'
          ? 'ic_vaccination'
          : type == 'hc'
            ? 'ic_doctor_chk_up'
            : 'ic_growth';
  };
  const getButtonname = (type: string) => {
    return type == 'gw'
      ? 'Add New Measurement'
      : type == 'cd'
        ? 'Track your milestones'
        : type == 'vc'
          ? 'View Vaccination details'
          : type == 'hc'
            ? 'View HealthCheck-up Details'
            : '';
  };
  const gotoPage = (type: string) => {
    //console.log(type);
    type == 'gw'
      ? navigation.navigate('AddNewChildgrowth', {
        headerTitle: t('growthScreenaddNewBtntxt'),
      })
      : type == 'cd'
        ? navigation.navigate('Home', { screen: 'ChildDevelopment' })
        : type == 'vc'
          ? navigation.navigate('Home', {
            screen: 'Tools',
            params: {
              screen: 'VaccinationTab',
            },
          })
          : type == 'hc'
            ? navigation.navigate('AddReminder', {
              reminderType: 'healthCheckup', // from remiderType
              headerTitle: t('vcReminderHeading'),
              buttonTitle: t('hcReminderAddBtn'),
              titleTxt: t('hcReminderText'),
              warningTxt: t('hcReminderDeleteWarning'),
              headerColor: hcheaderColor,
            })
            : '';
  };
  const markAsRead = (item)=>{
    onItemReadMarked(item);
  }
  const markAsDelete = (item)=>{
    onItemDeleteMarked(item);
  }
  const growthColor = themeContext.colors.CHILDGROWTH_COLOR;
  const vaccinationColor = themeContext.colors.VACCINATION_COLOR;
  const hkColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const cdColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const { t } = useTranslation();
  const [toggleCheckBox, setToggleCheckBox] = useState(item.isChecked);
  const renderGrowthNotifcation = () => {
    return (
      item.isDeleted? null :(<>
      <NotificationListContainer>
        <FlexDirRowStart>
          <NotifIcon style={{
            backgroundColor: growthColor
          }}>

            <Icon
              name={geticonname(item.type)}
              size={20}
              color="#000"

            />
          </NotifIcon>
          <NotifiContent>
            {item.isRead ==true ?
             <Heading4Regular>{t(item.title)}</Heading4Regular> :
             <Heading4Bold>{t(item.title)}</Heading4Bold>
             }
           
            
            <ShiftFromTop5>
              <Heading6>{item.days_from},{item.days_to}</Heading6>
            </ShiftFromTop5>
            <ShiftFromTop10>
              <Pressable onPress={() => gotoPage(item.type)}>
                <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
              </Pressable></ShiftFromTop10>
          </NotifiContent>

          <NotifAction>
            {(isDeleteEnabled === true) ? (
              <FormOuterCheckbox
                onPress={() => {
                  //  console.log(item);
                  setToggleCheckBox(!toggleCheckBox);
                  props.onItemChecked(itemIndex, !toggleCheckBox)
                }}>
                <CheckboxItem>
                  <View>
                    {toggleCheckBox ? (
                      <CheckboxActive>
                        <Icon name="ic_tick" size={12} color="#000" />
                      </CheckboxActive>
                    ) : (
                      <Checkbox style={{ borderWidth: 1 }}></Checkbox>
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
                    <MenuOption value={1} onSelect={() => markAsDelete(item)}>
                      <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                    </MenuOption>
                    <MenuOption value={2} onSelect={() => markAsRead(item)}>
                      <Heading5Bold> { item.isRead ==true ?t('notiOption3') :t('notiOption2')}</Heading5Bold>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </>
            )}
          </NotifAction>

        </FlexDirRowStart>

      </NotificationListContainer>
      <DividerContainer><Divider></Divider></DividerContainer>
    </>))
  }
  const renderHCNotifcation = () => {
    //At the beginning of the period
    return ( item.isDeleted? null :<>
      <NotificationListContainer>
        <FlexDirRowStart>
          <NotifIcon style={{
            backgroundColor: hkColor
          }}>

            <Icon
              name={geticonname(item.type)}
              size={20}
              color="#000"

            />
          </NotifIcon>
          <NotifiContent>
          {item.isRead ==true ?
             <Heading4Regular>{t(item.title)}</Heading4Regular> :
             <Heading4Bold>{t(item.title)}</Heading4Bold>
             }
            <ShiftFromTop5>
              <Heading6>{item.days_from},{item.days_to}</Heading6>
            </ShiftFromTop5>
            <ShiftFromTop10>
              <Pressable onPress={() => gotoPage(item.type)}>
                <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
              </Pressable></ShiftFromTop10>
          </NotifiContent>

          <NotifAction>
            {(isDeleteEnabled === true) ? (
              <FormOuterCheckbox
                onPress={() => {
                  //  console.log(item);
                  setToggleCheckBox(!toggleCheckBox);
                  props.onItemChecked(itemIndex, !toggleCheckBox)
                }}>
                <CheckboxItem>
                  <View>
                    {toggleCheckBox ? (
                      <CheckboxActive>
                        <Icon name="ic_tick" size={12} color="#000" />
                      </CheckboxActive>
                    ) : (
                      <Checkbox style={{ borderWidth: 1 }}></Checkbox>
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
                    <MenuOption value={1} onSelect={() => markAsDelete(item)}>
                      <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                    </MenuOption>
                    <MenuOption value={2} onSelect={() => markAsRead(item)}>
                    <Heading5Bold> { item.isRead ==true ?t('notiOption3') :t('notiOption2')}</Heading5Bold>             
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </>
            )}
          </NotifAction>

        </FlexDirRowStart>

      </NotificationListContainer>
      <DividerContainer><Divider></Divider></DividerContainer>
    </>)
  }
  const renderVCNotifcation = () => {
    //A the beginning of the period
    return ( item.isDeleted? null :<>
      <NotificationListContainer>
        <FlexDirRowStart>
          <NotifIcon style={{
            backgroundColor:  vaccinationColor
          }}>

            <Icon
              name={geticonname(item.type)}
              size={20}
              color="#000"

            />
          </NotifIcon>
          <NotifiContent>
            <Heading4Regular>{t(item.title,{
                            childName:
                              activeChild.childName != null &&
                                activeChild.childName != '' &&
                                activeChild.childName != undefined
                                ? activeChild.childName
                                : ''})}</Heading4Regular>
            <ShiftFromTop5>
              <Heading6>{item.days_from},{item.days_to}</Heading6>
            </ShiftFromTop5>
            <ShiftFromTop10>
              <Pressable onPress={() => gotoPage(item.type)}>
                <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
              </Pressable></ShiftFromTop10>
          </NotifiContent>

          <NotifAction>
            {(isDeleteEnabled === true) ? (
              <FormOuterCheckbox
                onPress={() => {
                  //  console.log(item);
                  setToggleCheckBox(!toggleCheckBox);
                  props.onItemChecked(itemIndex, !toggleCheckBox)
                }}>
                <CheckboxItem>
                  <View>
                    {toggleCheckBox ? (
                      <CheckboxActive>
                        <Icon name="ic_tick" size={12} color="#000" />
                      </CheckboxActive>
                    ) : (
                      <Checkbox style={{ borderWidth: 1 }}></Checkbox>
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
                    <MenuOption value={1} onSelect={() => markAsDelete(item)}>
                      <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                    </MenuOption>
                    <MenuOption value={2} onSelect={() => markAsRead(item)}>
                    <Heading5Bold> { item.isRead ==true ?t('notiOption3') :t('notiOption2')}</Heading5Bold>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </>
            )}
          </NotifAction>

        </FlexDirRowStart>

      </NotificationListContainer>
      <DividerContainer><Divider></Divider></DividerContainer>
    </>)
  }
  const renderCDNotifcation = () => {
    //At the beginning of the period =>cd1
    //5 days before the end of the period =>cd2
    return ( item.isDeleted? null :<>
      <NotificationListContainer>
        <FlexDirRowStart>
          <NotifIcon style={{
            backgroundColor: cdColor 
          }}>

            <Icon
              name={geticonname(item.type)}
              size={20}
              color="#000"

            />
          </NotifIcon>
          <NotifiContent>
          {item.isRead ==true ?
             <Heading4Regular>{t(item.title)}</Heading4Regular> :
             <Heading4Bold>{t(item.title)}</Heading4Bold>
             }
            <ShiftFromTop5>
              <Heading6>{item.days_from},{item.days_to}</Heading6>
            </ShiftFromTop5>
            <ShiftFromTop10>
              <Pressable onPress={() => gotoPage(item.type)}>
                <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
              </Pressable></ShiftFromTop10>
          </NotifiContent>

          <NotifAction>
            {(isDeleteEnabled === true) ? (
              <FormOuterCheckbox
                onPress={() => {
                  //  console.log(item);
                  setToggleCheckBox(!toggleCheckBox);
                  props.onItemChecked(itemIndex, !toggleCheckBox)
                }}>
                <CheckboxItem>
                  <View>
                    {toggleCheckBox ? (
                      <CheckboxActive>
                        <Icon name="ic_tick" size={12} color="#000" />
                      </CheckboxActive>
                    ) : (
                      <Checkbox style={{ borderWidth: 1 }}></Checkbox>
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
                    <MenuOption value={1} onSelect={() => markAsDelete(item)}>
                      <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                    </MenuOption>
                    <MenuOption value={2} onSelect={() => markAsRead(item)}>
                    <Heading5Bold> { item.isRead ==true ?t('notiOption3') :t('notiOption2')}</Heading5Bold>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </>
            )}
          </NotifAction>

        </FlexDirRowStart>

      </NotificationListContainer>
      <DividerContainer><Divider></Divider></DividerContainer>
    </>)
  }

  return (
    item.type == 'gw' ? renderGrowthNotifcation() : item.type == 'cd' ? renderCDNotifcation() : item.type == 'vc' ? renderVCNotifcation() : item.type == 'hc' ? renderHCNotifcation() : null
  );
};
export default NotificationItem;

