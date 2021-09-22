import Icon from '@components/shared/Icon';
import { useNavigation } from '@react-navigation/native';
import { Heading4Bold, Heading4Regular, Heading5Bold, Heading6, ShiftFromTop10, ShiftFromTop5 } from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import { getCurrentChildAgeInMonths } from '../services/childCRUD';
import { formatStringDate, formatStringTime } from '../services/Utils';
import { ButtonTextSmLineL } from './shared/ButtonGlobal';
import Checkbox, { CheckboxActive, CheckboxItem } from './shared/CheckboxStyle';
import { FormOuterCheckbox } from './shared/ChildSetupStyle';
import Divider, { DividerContainer } from './shared/Divider';
import { FlexDirRowStart } from './shared/FlexBoxStyle';
import { NotifAction, NotificationListContainer, NotifIcon, NotifiContent } from './shared/NotificationStyle';


const NotificationItem = (props: any) => {
  const { item, itemIndex, onItemReadMarked, onItemDeleteMarked, isDeleteEnabled, childAgeInDays, activeChild } = props;
  const themeContext = useContext(ThemeContext);
  console.log(childAgeInDays, "childAgeInDays")
  const hcheaderColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const navigation = useNavigation();
  // const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const geticonname = (type: string) => {
    // console.log(type)
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
  const getButtonname = (type: string) => {
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
  const gotoPage = (type: string) => {
    //console.log(type);
    type == 'gw'
      ? navigation.navigate('AddNewChildgrowth', {
        headerTitle: t('growthScreenaddNewBtntxt'),
      })
      : type == 'cd'
        ? navigation.navigate('Home', { screen: 'ChildDevelopment' })
        : type == 'vc' || type == 'vcr'
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
            : type == 'hcr'
              ? navigation.navigate('Home', {
                screen: 'Tools',
                params: {
                  screen: 'HealthCheckupsTab',
                },
              }) : '';
  };
  const markAsRead = (item: any) => {
    onItemReadMarked(item);
  }
  const markAsDelete = (item: any) => {
    onItemDeleteMarked(item);
  }
  const growthColor = themeContext.colors.CHILDGROWTH_COLOR;
  const vaccinationColor = themeContext.colors.VACCINATION_COLOR;
  const hkColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const cdColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const { t } = useTranslation();
  const [toggleCheckBox, setToggleCheckBox] = useState(item.isChecked);
  useEffect(() => {
    setToggleCheckBox(false);
    // console.log(getVaccinesForPeriod("59056"));
  }, [isDeleteEnabled])
  const allVaccineData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  const getVaccinesForPeriod = (period: string) => {
    const allvc = allVaccineData.filter((item) => item.growth_period == period);
    let vc = '';
    allvc.map((item: any, index: number) => {
      if (index == allvc.length - 1) {
        vc += `${item.title}.`
      } else {
        vc += `${item.title}, `
      }
    })
    return vc;
  }
  let toDay = DateTime.fromJSDate(new Date()).toMillis();
  let childCrateDate = DateTime.fromJSDate(new Date(activeChild.createdAt)).toMillis();
  let notiDate = DateTime.fromJSDate(new Date(item.notificationDate)).toMillis();
  const renderGrowthNotifcation = () => {
    return (
      //
      (toDay >= notiDate && childCrateDate <= notiDate) ? item.isDeleted ? null :
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
                  <Heading4Regular>{t(item.title, { periodName: item.periodName })}</Heading4Regular> :
                  <Heading4Bold>{t(item.title, { periodName: item.periodName })}</Heading4Bold>
                }


                <ShiftFromTop5>
                  <Heading6>  {formatStringDate(item.notificationDate, luxonLocale)} - {
                    getCurrentChildAgeInMonths(
                      t,
                      DateTime.fromJSDate(new Date(item.notificationDate))
                    )}</Heading6>
                  {/* <Heading6></Heading6> */}
                  {/* <Heading6>{formatStringDate(childCrateDate, luxonLocale)}</Heading6>
                  <Heading6>{formatStringDate(toDay, luxonLocale)}</Heading6> */}

                  {/* <Heading6>{item.days_from},{item.days_to},{String(item.growth_period)}</Heading6> */}
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
                      props.onItemChecked(item, !toggleCheckBox)
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
  const renderHCNotifcation = () => {
    return (
      (toDay >= notiDate && childCrateDate <= notiDate) ? (item.isDeleted ? null :
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
                  <Heading4Regular>{t(item.title, { periodName: item.periodName })}</Heading4Regular> :
                  <Heading4Bold>{t(item.title, { periodName: item.periodName })}</Heading4Bold>
                }
                <ShiftFromTop5>
                  <Heading6>  {formatStringDate(item.notificationDate, luxonLocale)} - {
                    getCurrentChildAgeInMonths(
                      t,
                      DateTime.fromJSDate(new Date(item.notificationDate))
                    )}</Heading6>
                  {/* <Heading6>{item.days_from},{item.days_to},{String(item.growth_period)}</Heading6> */}
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
                      props.onItemChecked(item, !toggleCheckBox)
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
  const renderVCNotifcation = () => {
    return (
      (toDay >= notiDate && childCrateDate <= notiDate) ? (item.isDeleted ? null :
        <>
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
                  })}</Heading4Regular> :
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
                  <Heading6>  {formatStringDate(item.notificationDate, luxonLocale)} - {
                    getCurrentChildAgeInMonths(
                      t,
                      DateTime.fromJSDate(new Date(item.notificationDate))
                    )}</Heading6>
                  {/* <Heading6></Heading6> */}
                  {/* <Heading6>{item.days_from},{item.days_to},{String(item.growth_period)}</Heading6> */}
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
                      props.onItemChecked(item, !toggleCheckBox)
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

  const renderCDNotifcation = () => {
    if (item.title == 'cdNoti1') {
      return (
        (toDay >= notiDate && childCrateDate <= notiDate) ? item.isDeleted ? null :
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
                    <Heading4Regular>{t(item.title, { periodName: item.periodName })}</Heading4Regular> :
                    <Heading4Bold>{t(item.title, { periodName: item.periodName })}</Heading4Bold>
                  }
                  <ShiftFromTop5>
                    <Heading6>  {formatStringDate(item.notificationDate, luxonLocale)} - {
                      getCurrentChildAgeInMonths(
                        t,
                        DateTime.fromJSDate(new Date(item.notificationDate))
                      )}</Heading6>
                    {/* <Heading6></Heading6> */}
                    {/* <Heading6>{item.days_from},{item.days_to},{String(item.growth_period)}</Heading6> */}
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
                        props.onItemChecked(item, !toggleCheckBox)
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
        (toDay >= notiDate && childCrateDate <= notiDate) ? item.isDeleted ? null :
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
                    <Heading4Regular>{t(item.title, { periodName: item.periodName })}</Heading4Regular> :
                    <Heading4Bold>{t(item.title, { periodName: item.periodName })}</Heading4Bold>
                  }
                  <ShiftFromTop5>
                    <Heading6>  {formatStringDate(item.notificationDate, luxonLocale)} - {
                      getCurrentChildAgeInMonths(
                        t,
                        DateTime.fromJSDate(new Date(item.notificationDate))
                      )}</Heading6>
                    {/* <Heading6></Heading6> */}
                    {/* <Heading6>{item.days_from},{item.days_to},{String(item.growth_period)}</Heading6> */}
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
                        props.onItemChecked(item, !toggleCheckBox)
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

  const renderVCReminderNotifcation = () => {
    // console.log(item, childAgeInDays, "renderVCReminderNotifcation")
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
                reminderDateTime: formatStringDate(item.periodName, luxonLocale) + "," + formatStringTime(item.growth_period, luxonLocale)
              })}</Heading4Regular> :
              <Heading4Bold>{t(item.title, {
                reminderDateTime: formatStringDate(item.periodName, luxonLocale) + "," + formatStringTime(item.growth_period, luxonLocale)
              })}</Heading4Bold>
            }

            <ShiftFromTop5>
              <Heading6>  {formatStringDate(item.notificationDate, luxonLocale)} - {
                getCurrentChildAgeInMonths(
                  t,
                  DateTime.fromJSDate(new Date(item.notificationDate))
                )}</Heading6>
              {/* <Heading6></Heading6> */}
              {/* <Heading6>{item.days_from},{item.days_to}{"VCR reminder"}</Heading6> */}
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
                  props.onItemChecked(item, !toggleCheckBox)
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

