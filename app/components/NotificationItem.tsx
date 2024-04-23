import Icon from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading4Bold, Heading4Regular, Heading5Bold, Heading6, ShiftFromTop10, ShiftFromTop5 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
//import { getNotificationDateInString } from '../services/childCRUD';
import { formatStringDate, formatStringTime } from '../services/Utils';
import { ButtonTextSmLineL } from './shared/ButtonGlobal';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FormOuterCheckbox } from './shared/ChildSetupStyle';
import Divider, { DividerN, DividerContainer } from './shared/Divider';
import { FlexDirRowStart } from './shared/FlexBoxStyle';
import { NotifAction, NotificationListContainer, NotifIcon, NotifiContent } from './shared/NotificationStyle';
const styles = StyleSheet.create({
  checkBoxStyle: { 
    borderWidth: 1 
  },
  menuView: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});

const NotificationItem = (props: any):any => {
  const { item, onItemReadMarked, onItemDeleteMarked, isDeleteEnabled, activeChild } = props;
  const themeContext = useContext(ThemeContext);
  const hcheaderColor = themeContext?.colors.HEALTHCHECKUP_COLOR;
  const navigation = useNavigation<any>();
  const primaryTintColor = themeContext?.colors.PRIMARY_TINTCOLOR;
  const pluralShow = useAppSelector(
    (state: any) => state.selectedCountry.pluralShow,
  );
  const { t } = useTranslation();
  const geticonname = (type: string):any => {
     return type == 'gw'
      ? 'ic_growth'
      : type == 'cd'
        ? 'ic_milestone'
        : type == 'vc' || type == 'vcr'
          ? 'ic_vaccination'
          : type == 'hc' || type == 'hcr'
            ? 'ic_doctor_chk_up'
            : 'ic_growth';
  };
  const markAsRead = (item: any):any => {
    onItemReadMarked(item);
  }
  const markAsDelete = (item: any):any => {
    onItemDeleteMarked(item);
  }
  const getButtonname = (type: string):any => {
    return type == 'gw'
      ? t('growthScreenaddNewBtntxt')
      : type == 'cd'
        ? t('trackMilestoneViewBtn')
        : type == 'vc' || type == 'vcr'
          ? t('vcAddBtn')
          : type == 'hc'
            ? t('hcReminderbtn')
            : type == 'hcr' ? t('hcNewBtn') : '';
  };
  const gotoPage = (item: any):any => {
    if(item.isRead==false){
      markAsRead(item);
    }
    const type = item.type;
    type == 'gw'
      ? navigation.navigate('AddNewChildgrowth', {
        headerTitle: t('growthScreenaddNewBtntxt'),
        fromNotificationScreen: true,
      })
      : type == 'cd'
        ? navigation.navigate('Home', { screen: 'ChildDevelopment' ,params:{
          fromNotificationScreen: true,
        }})
        : type == 'vc' || type == 'vcr'
          ? navigation.navigate('Home', {
            screen: 'Tools',
            params: {
              screen: 'VaccinationTab',
              params:{
                fromNotificationScreen: true,
              }
            },
          })
          : type == 'hc'
            ? navigation.navigate('AddReminder', {
              reminderType: 'healthCheckup', // from remiderType
              headerTitle: t('vcReminderHeading'),
              buttonTitle: t('hcReminderAddBtn'),
              titleTxt: t('hcReminderText'),
              titleTxt2: t('hcDefinedReminderText'),
              warningTxt: t('hcReminderDeleteWarning'),
              headerColor: hcheaderColor,
              fromNotificationScreen: true,
            })
            : type == 'hcr'
              ? navigation.navigate('Home', {
                screen: 'Tools',
                params: {
                  screen: 'HealthCheckupsTab',
                  params:{
                    fromNotificationScreen: true,
                  }
                },
              }) : '';
  };

  const growthColor = themeContext?.colors.CHILDGROWTH_COLOR;
  const vaccinationColor = themeContext?.colors.VACCINATION_COLOR;
  const hkColor = themeContext?.colors.HEALTHCHECKUP_COLOR;
  const cdColor = themeContext?.colors.CHILDDEVELOPMENT_COLOR;
  
  const [toggleCheckBox, setToggleCheckBox] = useState(item.isChecked);
  useEffect(() => {
    setToggleCheckBox(false);
   }, [isDeleteEnabled])
  const allVaccineData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  const getVaccinesForPeriod = (period: string):any => {
    const allvc = allVaccineData.filter((item:any) => item.growth_period == period);
    let vc = ' ';
    const vcArray:any=[];
    allvc.map((item: any, index: number) => {
        if(item.old_calendar!=1){
        vcArray.push(item.title);
      }
    })
    if(vcArray && vcArray.length>0){
      vc+=vcArray.join(", ");
      vc+='.';
    }
    else{
      vc='';
    }
    return vc;
    // const allvc = allVaccineData.filter((item:any) => item.growth_period == period);
    // let vc = ' ';
    // const vcArray:any=[];
    // allvc.map((item: any, index: number) => {
    //   console.log(item,"..allvcitem11")
    //   if (index == allvc.length - 1) {
    //    if(item.old_calendar!=1){
    //     vc += `${item.title}.`
    //    }
    //    else{
    //     vc='';
    //    }
    //   } else {
    //     if(item.old_calendar!=1){
    //       //vc += `${item.title}, `
    //       vcArray.push(item.title);
    //     }
    //     if(vcArray && vcArray.length>0){
    //     vc=vcArray.join(",");
    //     }
    //     else{
    //       vc='';
    //     }
    //   }
    // })
    // return vc;
  }
  const toDay = DateTime.fromJSDate(new Date()).toMillis();
  const childBirthDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis();
  const notiDate = DateTime.fromJSDate(new Date(item.notificationDate)).toMillis();
  const renderGrowthNotifcation = ():any => {
    return (
      //
      (toDay >= notiDate && childBirthDate <= notiDate) ? item.isDeleted ? null :
        //if childageInDays is between days_from and days_to then only display notis which have days_from == chilAgeInDays
        (<>
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
                {item.isRead == true ?
                  <Heading4Regular>{t(item.title, { childName:
                    activeChild.childName != null &&
                      activeChild.childName != '' &&
                      activeChild.childName != undefined
                      ? activeChild.childName
                      : '',periodName: item.periodName })}</Heading4Regular> :
                  <Heading4Bold>{t(item.title, { childName:
                    activeChild.childName != null &&
                      activeChild.childName != '' &&
                      activeChild.childName != undefined
                      ? activeChild.childName
                      : '',periodName: item.periodName })}</Heading4Bold>
                }


                <ShiftFromTop5>
                  <Heading6>  {formatStringDate(item.notificationDate)}</Heading6>
                </ShiftFromTop5>
                <ShiftFromTop10>
                  <Pressable onPress={():any => gotoPage(item)}>
                    <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
                  </Pressable></ShiftFromTop10>
              </NotifiContent>

              <NotifAction>
                {(isDeleteEnabled === true) ? (
                  <FormOuterCheckbox
                    onPress={():any => {
                      setToggleCheckBox(!toggleCheckBox);
                      props.onItemChecked(item, !toggleCheckBox)
                    }}>
                    <CheckboxItem>
                      <View>
                        {toggleCheckBox ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={styles.checkBoxStyle}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                ) : (
                  <>
                    <Menu
                      renderer={renderers.ContextMenu}
                      style={styles.menuView}
                      >
                      <MenuTrigger>
                        <Icon
                          
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
                            padding: 15,
                          },

                        }}>
                        <MenuOption value={1} onSelect={():any => markAsDelete(item)}>
                          <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                        </MenuOption>
                        <DividerN></DividerN>
                        <MenuOption value={2} onSelect={():any => markAsRead(item)}>
                          <Heading5Bold> {item.isRead == true ? t('notiOption3') : t('notiOption2')}</Heading5Bold>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  </>
                )}
              </NotifAction>

            </FlexDirRowStart>

          </NotificationListContainer>
          <DividerContainer><Divider></Divider></DividerContainer>
        </>) : null)
  }
  const renderHCNotifcation = ():any => {
    return (
      (toDay >= notiDate && childBirthDate <= notiDate) ? (item.isDeleted ? null :
        <>
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
                {item.isRead == true ?
                  <Heading4Regular>{t(item.title, { childName:
                    activeChild.childName != null &&
                      activeChild.childName != '' &&
                      activeChild.childName != undefined
                      ? activeChild.childName
                      : '',periodName: item.periodName })}</Heading4Regular> :
                  <Heading4Bold>{t(item.title, { childName:
                    activeChild.childName != null &&
                      activeChild.childName != '' &&
                      activeChild.childName != undefined
                      ? activeChild.childName
                      : '',periodName: item.periodName })}</Heading4Bold>
                }
                <ShiftFromTop5>
                  <Heading6>  {formatStringDate(item.notificationDate)} </Heading6>
                  {/* <Heading6>{item.days_from},{item.days_to},{String(item.growth_period)}</Heading6> */}
                </ShiftFromTop5>
                <ShiftFromTop10>
                  <Pressable onPress={():any => gotoPage(item)}>
                    <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
                  </Pressable></ShiftFromTop10>
              </NotifiContent>

              <NotifAction>
                {(isDeleteEnabled === true) ? (
                  <FormOuterCheckbox
                    onPress={():any => {
                      setToggleCheckBox(!toggleCheckBox);
                      props.onItemChecked(item, !toggleCheckBox)
                    }}>
                    <CheckboxItem>
                      <View>
                        {toggleCheckBox ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={styles.checkBoxStyle}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                ) : (
                  <>
                    <Menu
                      renderer={renderers.ContextMenu}
                      style={styles.menuView}
                      >
                      <MenuTrigger>
                        <Icon
                          
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
                            // borderBottomWidth: 1,
                            padding: 15,
                          },

                        }}>
                        <MenuOption value={1} onSelect={():any => markAsDelete(item)}>
                          <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                        </MenuOption>
                        <DividerN></DividerN>
                        <MenuOption value={2} onSelect={():any => markAsRead(item)}>
                          <Heading5Bold> {item.isRead == true ? t('notiOption3') : t('notiOption2')}</Heading5Bold>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  </>
                )}
              </NotifAction>

            </FlexDirRowStart>

          </NotificationListContainer>
          <DividerContainer><Divider></Divider></DividerContainer>
        </>) : null)
  }
  const renderVCNotifcation = ():any => {
    return (
      (toDay >= notiDate && childBirthDate <= notiDate) ? (item.isDeleted ? null :
        (getVaccinesForPeriod(item.growth_period)=='' ? null :<>
          <NotificationListContainer>
            <FlexDirRowStart>
              <NotifIcon style={{
                backgroundColor: vaccinationColor
              }}>

                <Icon
                  name={geticonname(item.type)}
                  size={20}
                  color="#000"

                />
              </NotifIcon>
              <NotifiContent>
                {item.isRead == true ?
                  <Heading4Regular>{t(item.title, {
                    childName:
                      activeChild.childName != null &&
                        activeChild.childName != '' &&
                        activeChild.childName != undefined
                        ? activeChild.childName
                        : '', periodName: item.periodName
                  })}{getVaccinesForPeriod(item.growth_period)}</Heading4Regular> :
                  <Heading4Bold>{t(item.title, {
                    childName:
                      activeChild.childName != null &&
                        activeChild.childName != '' &&
                        activeChild.childName != undefined
                        ? activeChild.childName
                        : '', periodName: item.periodName
                  })}{getVaccinesForPeriod(item.growth_period)}</Heading4Bold>
                }

                <ShiftFromTop5>
                  <Heading6>  {formatStringDate(item.notificationDate)} </Heading6>
                </ShiftFromTop5>
                <ShiftFromTop10>
                  <Pressable onPress={():any => gotoPage(item)}>
                    <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
                  </Pressable></ShiftFromTop10>
              </NotifiContent>

              <NotifAction>
                {(isDeleteEnabled === true) ? (
                  <FormOuterCheckbox
                    onPress={():any => {
                      setToggleCheckBox(!toggleCheckBox);
                      props.onItemChecked(item, !toggleCheckBox)
                    }}>
                    <CheckboxItem>
                      <View>
                        {toggleCheckBox ? (
                          <CheckboxActive>
                            <Icon name="ic_tick" size={12} color="#000" />
                          </CheckboxActive>
                        ) : (
                          <Checkbox style={styles.checkBoxStyle}></Checkbox>
                        )}
                      </View>
                    </CheckboxItem>
                  </FormOuterCheckbox>
                ) : (
                  <>
                    <Menu
                      renderer={renderers.ContextMenu}
                      style={styles.menuView}
                      >
                      <MenuTrigger>
                        <Icon
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
                            padding: 15,
                          },

                        }}>
                        <MenuOption value={1} onSelect={():any => markAsDelete(item)}>
                          <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                        </MenuOption>
                        <DividerN></DividerN>
                        <MenuOption value={2} onSelect={():any => markAsRead(item)}>
                          <Heading5Bold> {item.isRead == true ? t('notiOption3') : t('notiOption2')}</Heading5Bold>
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
        ) : null)
  }

  const renderCDNotifcation = ():any => {
    if (item.title == 'cdNoti1') {
      return (
        (toDay >= notiDate && childBirthDate <= notiDate) ? item.isDeleted ? null :
          (<>
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
                  {item.isRead == true ?
                    <Heading4Regular>{t(item.title, { childName:
                      activeChild.childName != null &&
                        activeChild.childName != '' &&
                        activeChild.childName != undefined
                        ? activeChild.childName
                        : '',periodName: item.periodName })}</Heading4Regular> :
                    <Heading4Bold>{t(item.title, { childName:
                      activeChild.childName != null &&
                        activeChild.childName != '' &&
                        activeChild.childName != undefined
                        ? activeChild.childName
                        : '',periodName: item.periodName })}</Heading4Bold>
                  }
                  <ShiftFromTop5>
                    <Heading6>  {formatStringDate(item.notificationDate)} </Heading6>
                   </ShiftFromTop5>
                  <ShiftFromTop10>
                    <Pressable onPress={():any => gotoPage(item)}>
                      <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
                    </Pressable></ShiftFromTop10>
                </NotifiContent>

                <NotifAction>
                  {(isDeleteEnabled === true) ? (
                    <FormOuterCheckbox
                      onPress={():any => {
                        setToggleCheckBox(!toggleCheckBox);
                        props.onItemChecked(item, !toggleCheckBox)
                      }}>
                      <CheckboxItem>
                        <View>
                          {toggleCheckBox ? (
                            <CheckboxActive>
                              <Icon name="ic_tick" size={12} color="#000" />
                            </CheckboxActive>
                          ) : (
                            <Checkbox style={styles.checkBoxStyle}></Checkbox>
                          )}
                        </View>
                      </CheckboxItem>
                    </FormOuterCheckbox>
                  ) : (
                    <>
                      <Menu
                        renderer={renderers.ContextMenu}
                        style={styles.menuView}
                        >
                        <MenuTrigger>
                          <Icon
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
                              padding: 15,
                            },
                          }}>
                          <MenuOption value={1} onSelect={():any => markAsDelete(item)}>
                            <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                          </MenuOption>
                          <DividerN></DividerN>
                          <MenuOption value={2} onSelect={():any => markAsRead(item)}>
                            <Heading5Bold> {item.isRead == true ? t('notiOption3') : t('notiOption2')}</Heading5Bold>
                          </MenuOption>
                        </MenuOptions>
                      </Menu>
                    </>
                  )}
                </NotifAction>

              </FlexDirRowStart>

            </NotificationListContainer>
            <DividerContainer><Divider></Divider></DividerContainer>
          </>) : null)
    }
    else {
      return (
        (toDay >= notiDate && childBirthDate <= notiDate) ? item.isDeleted ? null :
          (<>
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
                  {item.isRead == true ?
                    <Heading4Regular>{t(item.title, { childName:
                      activeChild.childName != null &&
                        activeChild.childName != '' &&
                        activeChild.childName != undefined
                        ? activeChild.childName
                        : '',periodName: item.periodName })}</Heading4Regular> :
                    <Heading4Bold>{t(item.title, { childName:
                      activeChild.childName != null &&
                        activeChild.childName != '' &&
                        activeChild.childName != undefined
                        ? activeChild.childName
                        : '',periodName: item.periodName })}</Heading4Bold>
                  }
                  <ShiftFromTop5>
                    <Heading6>  {formatStringDate(item.notificationDate)} </Heading6>
                  </ShiftFromTop5>
                  <ShiftFromTop10>
                    <Pressable onPress={():any => gotoPage(item)}>
                      <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
                    </Pressable></ShiftFromTop10>
                </NotifiContent>

                <NotifAction>
                  {(isDeleteEnabled === true) ? (
                    <FormOuterCheckbox
                      onPress={():any => {
                        setToggleCheckBox(!toggleCheckBox);
                        props.onItemChecked(item, !toggleCheckBox)
                      }}>
                      <CheckboxItem>
                        <View>
                          {toggleCheckBox ? (
                            <CheckboxActive>
                              <Icon name="ic_tick" size={12} color="#000" />
                            </CheckboxActive>
                          ) : (
                            <Checkbox style={styles.checkBoxStyle}></Checkbox>
                          )}
                        </View>
                      </CheckboxItem>
                    </FormOuterCheckbox>
                  ) : (
                    <>
                      <Menu
                        renderer={renderers.ContextMenu}
                        style={styles.menuView}
                        >
                        <MenuTrigger>
                          <Icon
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
                              padding: 15,
                            },

                          }}>
                          <MenuOption value={1} onSelect={():any => markAsDelete(item)}>
                            <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                          </MenuOption>
                          <DividerN></DividerN>
                          <MenuOption value={2} onSelect={():any => markAsRead(item)}>
                            <Heading5Bold> {item.isRead == true ? t('notiOption3') : t('notiOption2')}</Heading5Bold>
                          </MenuOption>
                        </MenuOptions>
                      </Menu>
                    </>
                  )}
                </NotifAction>

              </FlexDirRowStart>

            </NotificationListContainer>
            <DividerContainer><Divider></Divider></DividerContainer>
          </>) : null)
    }
  }

  const renderVCReminderNotifcation = ():any => {
     return (toDay >= notiDate ? item.isDeleted ? null : <>
      <NotificationListContainer>
        <FlexDirRowStart>
          <NotifIcon style={{
            backgroundColor: item.type == 'vcr' ? vaccinationColor : hcheaderColor
          }}>

            <Icon
              name={geticonname(item.type)}
              size={20}
              color="#000"

            />
          </NotifIcon>
          <NotifiContent>
            {item.isRead == true ?
              <Heading4Regular>{t(item.title, {
                reminderDateTime: formatStringDate(item.periodName) + "," + formatStringTime(item.growth_period)
              })}</Heading4Regular> :
              <Heading4Bold>{t(item.title, {
                reminderDateTime: formatStringDate(item.periodName) + "," + formatStringTime(item.growth_period)
              })}</Heading4Bold>
            }

            <ShiftFromTop5>
              <Heading6>  {formatStringDate(item.notificationDate)} </Heading6>
            </ShiftFromTop5>
            <ShiftFromTop10>
              <Pressable onPress={():any => gotoPage(item)}>
                <ButtonTextSmLineL numberOfLines={2}>{getButtonname(item.type)}</ButtonTextSmLineL>
              </Pressable></ShiftFromTop10>
          </NotifiContent>

          <NotifAction>
            {(isDeleteEnabled === true) ? (
              <FormOuterCheckbox
                onPress={():any => {
                  setToggleCheckBox(!toggleCheckBox);
                  props.onItemChecked(item, !toggleCheckBox)
                }}>
                <CheckboxItem>
                  <View>
                    {toggleCheckBox ? (
                      <CheckboxActive>
                        <Icon name="ic_tick" size={12} color="#000" />
                      </CheckboxActive>
                    ) : (
                      <Checkbox style={styles.checkBoxStyle}></Checkbox>
                    )}
                  </View>
                </CheckboxItem>
              </FormOuterCheckbox>
            ) : (
              <>
                <Menu
                  renderer={renderers.ContextMenu}
                  style={styles.menuView}
                  >
                  <MenuTrigger>
                    <Icon
                      
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
                        padding: 15,
                      },

                    }}>
                    <MenuOption value={1} onSelect={():any => markAsDelete(item)}>
                      <Heading5Bold>{t('notiOption1')}</Heading5Bold>
                    </MenuOption>
                    <DividerN></DividerN>
                    <MenuOption value={2} onSelect={():any => markAsRead(item)}>
                      <Heading5Bold> {item.isRead == true ? t('notiOption3') : t('notiOption2')}</Heading5Bold>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </>
            )}
          </NotifAction>

        </FlexDirRowStart>

      </NotificationListContainer>
      <DividerContainer><Divider></Divider></DividerContainer>
    </> : null)
  }

  return (
    (item.type == 'gw' ? renderGrowthNotifcation() : item.type == 'cd' ? renderCDNotifcation() : item.type == 'vc' ? renderVCNotifcation() : item.type == 'hc' ? renderHCNotifcation() : (item.type == 'vcr' || item.type == 'hcr') ? renderVCReminderNotifcation() : null)
  );
};
export default NotificationItem;


