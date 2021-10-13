import { APP_SHARE, FEEDBACK_SUBMIT } from '@assets/data/firebaseEvents';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  BgDevelopment,
  BgGrowth,
  BgHealth,
  BgVaccination
} from '@components/shared/BackgroundColors';
import {
  ButtonModal, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  FDirCol,
  FDirRow,
  Flex1,
  FlexCol,
  FlexDirRow
} from '@components/shared/FlexBoxStyle';
import {
  HeaderActionView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon, { OuterIconLeft15, OuterIconRow } from '@components/shared/Icon';
import { ImageIcon } from '@components/shared/Image';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import {
  BubbleContainer,
  BubbleView,
  DrawerHeadContainer,
  DrawerLinkView,
  NavIconSpacing,
  SubDrawerHead,
  SubDrawerLinkView
} from '@components/shared/NavigationDrawer';
import analytics from '@react-native-firebase/analytics';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import {
  Heading1Centerr,
  Heading3, Heading4, Heading4Center, Heading5
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Modal, Platform, Pressable, ScrollView, Share, View } from 'react-native';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { setAllNotificationData } from '../redux/reducers/notificationSlice';
import { setInfoModalOpened } from '../redux/reducers/utilsSlice';
import { getCurrentChildAgeInDays, isFutureDate } from '../services/childCRUD';
import { getChildNotification, getChildReminderNotifications, getNextChildNotification, isPeriodsMovedAhead } from '../services/notificationService';
import { formatDate } from '../services/Utils';
const CustomDrawerContent = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [accordvalue, onChangeaccordvalue] = React.useState(false);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const generateNotificationsFlag = useAppSelector((state: any) =>
    (state.utilsData.generateNotifications),
  );
  let allnotis = useAppSelector((state: any) => state.notificationData.notifications);
  const [notifications, setNotifications] = useState<any[]>([]);
  // console.log(activeChild, "..draweractiveChild")
  const surveryData = useAppSelector((state: any) =>
    state.utilsData.surveryData != ''
      ? JSON.parse(state.utilsData.surveryData)
      : state.utilsData.surveryData,
  );
  const feedbackItem = surveryData.find(item => item.type == "feedback")
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  let childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  let allHealthCheckupsData = useAppSelector(
    (state: any) =>
      state.utilsData.healthCheckupsData != '' ? JSON.parse(state.utilsData.healthCheckupsData) : [],
  );
  const taxonomy = useAppSelector(
    (state: any) =>
      (state.utilsData.taxonomy?.allTaxonomyData != "" ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData) : {}),
  );
  let allGrowthPeriods = taxonomy?.growth_period;
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      state.utilsData.vaccineData != '' ? JSON.parse(state.utilsData.vaccineData) : [],
  );
  const growthEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.growthEnabled),
  );
  const developmentEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.developmentEnabled),
  );
  const vchcEnabledFlag = useAppSelector((state: any) =>
    (state.notificationData.vchcEnabled),
  );
  const dispatch = useAppDispatch();
  // useEffect(() => {

  // }, [])

  // React.useCallback(() => {

  // );
  const childAgeInDays = getCurrentChildAgeInDays(
    DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis(),
  );
  const isOpen: boolean = useIsDrawerOpen();
  useEffect(() => {
    if (isOpen) {
      // Your dismiss logic here 

      if (allnotis.length > 0) {
        const currentChildNotis = allnotis.find((item) => item.childuuid == activeChild.uuid)
        console.log(currentChildNotis, "allfilteredNotis")
        //notiExist.gwcdnotis, notiExist.vcnotis, notiExist.hcnotis
        if (currentChildNotis) {
          let currentChildallnoti: any = [];
          if (currentChildNotis.gwcdnotis) {
            currentChildNotis.gwcdnotis.forEach((item) => {
              currentChildallnoti.push(item)
            })
          }
          // // notiExist.gwcdnotis?.forEach((item)=>{
          // //   allgwnoti.push(item)
          // // })
          if (currentChildNotis.hcnotis) {
            currentChildNotis.hcnotis.forEach((item) => {
              currentChildallnoti.push(item)
            })
          }
          // // notiExist.vcnotis?.forEach((item)=>{
          // //   allvcnotis.push(item)
          // // })
          if (currentChildNotis.vcnotis) {
            currentChildNotis.vcnotis.forEach((item) => {
              currentChildallnoti.push(item)
            })
          }
          if (currentChildNotis.reminderNotis) {
            currentChildNotis.reminderNotis.forEach((item) => {
              currentChildallnoti.push(item)
            })
          }
          // console.log(allnotis)

          // let fromDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).plus({ days: item.days_from });
          // let childCrateDate = DateTime.fromJSDate(new Date(activeChild.createdAt)).toMillis();
          let childBirthDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis();
          //  (item.days_from < childAgeInDays && childCrateDate <= fromDate)
          let toDay = DateTime.fromJSDate(new Date()).toMillis();


          let combinedNotis = currentChildallnoti.sort(
            (a: any, b: any) => a.days_from - b.days_from,
          ).filter((item) => { return item.isRead == false && item.isDeleted == false && (toDay >= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis() && childBirthDate <= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis()) });
          // console.log(combinedNotis, "combinedNotis")
          // const toRemove = combinedNotis.filter(item => item.title == "cdNoti2" && item.days_to >= childAgeInDays)
          // console.log(toRemove, "findcdNoti")
          // combinedNotis = combinedNotis.filter(function (el) {
          //   return !toRemove.includes(el);
          // });
          // delete item from combinedNotis item => { item.title == 'cdNoti2' && childAgeInDays >= item.days_to })
          setNotifications(combinedNotis)
        }
      }
    }
  }, [isOpen, activeChild.uuid, allnotis]);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: t('appShareText'),
      });
      if (result.action === Share.sharedAction) {
        analytics().logEvent(APP_SHARE);
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(t('generalError'));
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
      if (generateNotificationsFlag == true) {
        let allchildNotis: any[] = [];
        // childList.map((child: any) => {
        const notiExist = allnotis.find((item) => String(item.childuuid) == String(activeChild.uuid))
        console.log("notiExist", notiExist);
        if (notiExist != undefined) {
          // notiExist.gwcdnotis?.forEach((item) => {
          //   allgwcdnotis.push(item)
          // })
          //remove reminder notis
          // dispatch(setAllNotificationData(notiExist))
          if (isFutureDate(activeChild?.birthDate)) {
            // do not calculate for expecting child
            //empty childNotis // find and remove child from notification slice
            console.log("CHILD_ISEXPECTING_REMOVEALLNOTIREQUIRED")
          } else {
            const checkIfNewCalcRequired = isPeriodsMovedAhead(childAge, notiExist, activeChild, allVaccinePeriods, allGrowthPeriods, allHealthCheckupsData)
            if (checkIfNewCalcRequired) {
              console.log("NEWCALCREQUIRED")
              console.log(notiExist.gwcdnotis, notiExist.vcnotis, notiExist.hcnotis, "EXISTINGNOTI");
              const { lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis } = getNextChildNotification(notiExist.lastgwperiodid, notiExist.lastvcperiodid, notiExist.lasthcperiodid, activeChild, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods,growthEnabledFlag,developmentEnabledFlag,vchcEnabledFlag);

              // console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "NEWNOTI2");

              ////  append new notifications for child 
              let allgwcdnotis: any = [];
              let allvcnotis: any = [];
              let allhcnotis: any = [];
              gwcdnotis.reverse().forEach((item) => {
                allgwcdnotis.push(item)
              })
              if (notiExist.gwcdnotis) {
                notiExist.gwcdnotis?.forEach((item) => {
                  allgwcdnotis.push(item)
                })
              }
              vcnotis.reverse().forEach((item) => {
                allvcnotis.push(item)
              })
              if (notiExist.vcnotis) {
                notiExist.vcnotis?.forEach((item) => {
                  allvcnotis.push(item)
                })
              }
              hcnotis.reverse().forEach((item) => {
                allhcnotis.push(item)
              })
              if (notiExist.hcnotis) {
                notiExist.hcnotis?.forEach((item) => {
                  allhcnotis.push(item)
                })
              }
              let allreminderNotis: any = []
              let reminderNotis = getChildReminderNotifications(activeChild, notiExist.reminderNotis,vchcEnabledFlag);
              // if (notiExist.reminderNotis) {
              //   notiExist.reminderNotis?.forEach((item) => {
              //     allreminderNotis.push(item)
              //   })
              // }
              reminderNotis.reverse().forEach((item) => {
                allreminderNotis.push(item)
              })
              console.log(allhcnotis, allvcnotis, allgwcdnotis, reminderNotis, "ONLYnewnoti");
              allchildNotis.push({ childuuid: notiExist.childuuid, lastgwperiodid: lastgwperiodid, lastvcperiodid: lastvcperiodid, lasthcperiodid: lasthcperiodid, gwcdnotis: allgwcdnotis, vcnotis: allvcnotis, hcnotis: allhcnotis, reminderNotis: allreminderNotis })

            } else {
              //for child dob taken from 2years to 3 months, calculate new notifications from 3 months onwards
              //find and remove child from notification slice
              //clear notification which are already generated, 
              //generate for new notifications // append reminders
              let allreminderNotis: any = []
              let reminderNotis = getChildReminderNotifications(activeChild, notiExist.reminderNotis,vchcEnabledFlag);
              // if (notiExist.reminderNotis) {
              //   notiExist.reminderNotis?.forEach((item) => {
              //     allreminderNotis.push(item)
              //   })
              // }
              reminderNotis.reverse().forEach((item) => {
                allreminderNotis.push(item)
              })
              allchildNotis.push({ childuuid: notiExist.childuuid, lastgwperiodid: notiExist.lastgwperiodid, lastvcperiodid: notiExist.lastvcperiodid, lasthcperiodid: notiExist.lasthcperiodid, gwcdnotis: notiExist.gwcdnotis, vcnotis: notiExist.vcnotis, hcnotis: notiExist.hcnotis, reminderNotis: allreminderNotis })
            }
          }
        } else {
          console.log("noti does not exist for child");
          // create notification for that child first time
          if (!isFutureDate(activeChild?.birthDate)) {
            const { lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis } = getChildNotification(activeChild, childAge, allHealthCheckupsData, allVaccinePeriods, allGrowthPeriods,growthEnabledFlag,developmentEnabledFlag,vchcEnabledFlag);
            console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, "childNotis")
            let reminderNotis = getChildReminderNotifications(activeChild,[],vchcEnabledFlag);
            console.log(reminderNotis, "new reminderNotis")
            console.log(lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis, vcnotis, hcnotis, reminderNotis, "childNotis")
            allchildNotis.push({ childuuid: activeChild.uuid, lastgwperiodid, lastvcperiodid, lasthcperiodid, gwcdnotis: gwcdnotis, vcnotis: vcnotis, hcnotis: hcnotis, reminderNotis: reminderNotis })
          } else {
            //for expecting child no notifications
          }
        }

        const exceptActiveChildNotis =   [...allnotis].filter(item => String(item.childuuid) != String(activeChild.uuid));
        // allnotis.filter((item) => String(item.childuuid) != String(activeChild.uuid))
        exceptActiveChildNotis.forEach(element => {
          allchildNotis.push(element)
        });
        // [...allchildNotis].filter(item => String(item.childuuid) != String(activeChild[0].uuid));
        // })
        console.log(allchildNotis,"allchildNotis=Drawer")
        dispatch(setAllNotificationData(allchildNotis))
        //generate notifications for all childs 
        //get all notifications for all childfrom slice, if [],then generate as per their DOB/createdate,
        //if already exist, then for each module get last period, and generate afterwards period's notifications
        //after generating notifications make it false
        let notiFlagObj = { key: 'generateNotifications', value: false };
        dispatch(setInfoModalOpened(notiFlagObj));
      }
    }, [isOpen, activeChild.uuid, allnotis]),
  );

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  return (
    <>
     <FocusAwareStatusBar animated={true} />
      <View style={{flex:1,backgroundColor:headerColor}}>
        <ScrollView style={{flex:1,backgroundColor:"#FFF"}}>
          <Flex1>
            <Pressable
              onPress={() => navigation.navigate('ChildProfileScreen')}
              style={{
                backgroundColor: headerColor,
              }}>
              <DrawerHeadContainer>
                <HeaderRowView>
                  <HeaderTitleView>
                    <FlexDirRow>
                      <OuterIconRow>
                        <OuterIconLeft15>
                          {activeChild.photoUri != '' ? (
                            <ImageIcon
                              source={{ uri: 'file://' + CHILDREN_PATH + activeChild.photoUri }}
                            // style={{borderRadius: 20, width: 40, height: 40}}
                            ></ImageIcon>
                          ) : (
                            <Icon name="ic_baby" size={25} color='#000' />
                          )}
                        </OuterIconLeft15>
                      </OuterIconRow>
                      <FDirCol>
                        <Heading3>
                          {activeChild.childName != ''
                            ? activeChild.childName
                            : ''}
                        </Heading3>
                        <Heading5>
                          {(activeChild.birthDate != '' &&
                            activeChild.birthDate != null &&
                            activeChild.birthDate != undefined && !isFutureDate(activeChild.birthDate)) ? t('drawerMenuchildInfo', {
                              childdob:
                                activeChild.birthDate != '' &&
                                  activeChild.birthDate != null &&
                                  activeChild.birthDate != undefined
                                  ? formatDate(activeChild.birthDate, luxonLocale)
                                  : '',
                            }) : t('expectedChildDobLabel')}
                        </Heading5>
                      </FDirCol>
                    </FlexDirRow>
                  </HeaderTitleView>
                  <HeaderActionView>
                    <Icon name="ic_angle_right" size={16} color="#000" />
                  </HeaderActionView>
                </HeaderRowView>
              </DrawerHeadContainer>
            </Pressable>
          </Flex1>
         
          <DrawerLinkView
            // onPress={() => navigation.navigate('Home')}
            onPress={() => navigation.navigate('Home', { screen: 'Home' })}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_home" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenuhomeTxt')}</Heading4>
          </DrawerLinkView>


          <DrawerLinkView
            onPress={() => navigation.navigate('NotificationsScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_notification" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenunotiTxt')}</Heading4>
            {notifications.length > 0 ? <BubbleContainer>
              <BubbleView>
                <Heading5>{notifications.length}</Heading5>
              </BubbleView>
            </BubbleContainer>
              : null}
          </DrawerLinkView>





          <DrawerLinkView style={{ backgroundColor: accordvalue ? "#F7F6F4" : "#FFF" }} onPress={() => onChangeaccordvalue(!accordvalue)}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_tools" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenutoolsTxt')}</Heading4>
            <Icon
              style={{ flex: 1, textAlign: 'right', alignSelf: 'center' }}
              name={accordvalue ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            />
          </DrawerLinkView>

          {accordvalue ? (
            <>
              <SubDrawerLinkView 
                onPress={() =>
                  navigation.navigate('Home', { screen: 'ChildDevelopment' })
                }>
                <FDirRow>
                  <BgDevelopment>
                    <NavIconSpacing>
                      <Icon name="ic_milestone" size={25} color="#000" />
                    </NavIconSpacing>
                  </BgDevelopment>
                </FDirRow>
                <FDirRow>
                  <SubDrawerHead>
                    <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenucdTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={() => {
                  navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'VaccinationTab',
                    },
                  });
                }
                  // navigation.navigate('Home', { screen: 'VaccinationTab' })
                }>
                <FDirRow>
                  <BgVaccination>
                    <NavIconSpacing>
                      <Icon name="ic_vaccination" size={25} color="#000" />
                    </NavIconSpacing>
                  </BgVaccination>
                </FDirRow>
                <FDirRow>
                  <SubDrawerHead>
                    <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenuvcTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={() => {
                  navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'HealthCheckupsTab',
                    },
                  });
                }
                  // navigation.navigate('Home', { screen: 'HealthCheckupsTab' })
                }>
                <FDirRow>
                  <BgHealth>
                    <NavIconSpacing>
                      <Icon name="ic_doctor_chk_up" size={25} color="#000" />
                    </NavIconSpacing>
                  </BgHealth>
                </FDirRow>
                <FDirRow>
                  <SubDrawerHead>
                    <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenuhcTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={() => {
                  navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'ChildgrowthTab',
                    },
                  });
                }
                  // navigation.navigate('Home', { screen: 'ChildgrowthTab' })
                }>
                <FDirRow>
                  <BgGrowth>
                    <NavIconSpacing>
                      <Icon name="ic_growth" size={25} color="#000" />
                    </NavIconSpacing>
                  </BgGrowth>
                </FDirRow>
                <FDirRow>
                  <SubDrawerHead>
                    <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenucgTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
            </>
          ) : null}
          <DrawerLinkView onPress={() => navigation.navigate('SupportChat')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_chat" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenuchatTxt')}</Heading4>
          </DrawerLinkView>
          {/* <DrawerLinkView onPress={() => navigation.navigate('Favourites')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_favorites" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenufavTxt')}</Heading4>
            <BubbleContainer>
              <BubbleView>
                <Heading5>10</Heading5>
              </BubbleView>
            </BubbleContainer>
          </DrawerLinkView> */}
          <DrawerLinkView onPress={() => navigation.navigate('AboutusScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_about" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenuabtTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => navigation.navigate('UserGuide')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_userguide" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenuugTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => navigation.navigate('SettingsScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_settings" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenusetTxt')}</Heading4>
          </DrawerLinkView>

          <DrawerLinkView onPress={() => onShare()}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_shareapp" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenushareTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => { setModalVisible(true); }}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_feedback" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenufeedbackTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => { }}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_loveapp" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenurateTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView
            onPress={() => {
              navigation.navigate('PrivacyPolicy');
            }}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_privacy" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{ flexShrink: 1 }}>{t('drawerMenuPrivacyTxt')}</Heading4>
          </DrawerLinkView>
        
        </ScrollView>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible === true}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(false);
        }}
        onDismiss={() => {
          setModalVisible(false);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            {feedbackItem ?
              <><ModalPopupContent>

                <Heading1Centerr>{feedbackItem?.title}</Heading1Centerr>

                {feedbackItem && feedbackItem?.body ?
                  <HTML
                    source={{ html: feedbackItem?.body }}
                    ignoredStyles={['color', 'font-size', 'font-family']}
                  />
                  : null
                }

              </ModalPopupContent>
                <FDirRow>
                  <ButtonModal
                    onPress={() => {
                      setModalVisible(false);
                      analytics().logEvent(FEEDBACK_SUBMIT)
                      Linking.openURL(feedbackItem?.survey_feedback_link)
                    }}>
                    <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                  </ButtonModal>
                </FDirRow>
              </>
              : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
    </>
  );
};

export default CustomDrawerContent;