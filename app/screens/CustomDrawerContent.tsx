import { APP_SHARE, FEEDBACK_SUBMIT } from '@assets/data/firebaseEvents';
import { buildFor, buildForBebbo, shareText } from '@assets/translations/appOfflineData/apiConstants';
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
  Flex1, FlexDirRow
} from '@components/shared/FlexBoxStyle';
import {
  HeaderActionView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon, { IconML, OuterIconLeft15, OuterIconRow } from '@components/shared/Icon';
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
import { bgcolorWhite2, lightShadeColor, secondaryColor } from '@styles/style';
import {
  Heading1Centerr,
  Heading3, Heading4, Heading4Center, Heading5
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import { DateTime } from 'luxon';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import { isFutureDate } from '../services/childCRUD';
import { formatDate,addSpaceToHtml } from '../services/Utils';

const styles = StyleSheet.create({
  containerView: {
    backgroundColor:secondaryColor,
    flex:1
  },
  headingFlexShrink: { 
    flexShrink: 1
  },
  iconStyle: { 
    alignSelf: 'center',
    flex: 1,
    textAlign: 'right' 
  },
  scrollViewStyle: {
    backgroundColor:bgcolorWhite2,
    flex:1
  },
  textStyle: { 
    fontSize: 12,
    fontWeight: 'normal'
  },
  touchableLeft: { 
    marginLeft: 2,
    padding: 8 
  },
  touchableRight: { 
    marginRight: 2,
    padding: 8 
  }
})
const CustomDrawerContent = ({ navigation }: any):any => {
  const { t } = useTranslation();
  const [accordvalue, onChangeaccordvalue] = React.useState(false);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const allnotis = useAppSelector((state: any) => state.notificationData.notifications);
  const [notifications, setNotifications] = useState<any[]>([]);
  const surveryData = useAppSelector((state: any) =>
    state.utilsData.surveryData != ''
      ? JSON.parse(state.utilsData.surveryData)
      : state.utilsData.surveryData,
  );
  const feedbackItem = surveryData.find((item:any) => item.type == "feedback")
  const userGuideItem = surveryData.find((item:any) => item.type == "user_guide")
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const favoriteadvices = useAppSelector((state: any) =>
    state.childData.childDataSet.favoriteadvices ? state.childData.childDataSet.favoriteadvices : []
  );
  const favoritegames = useAppSelector((state: any) =>
    state.childData.childDataSet.favoritegames ? state.childData.childDataSet.favoritegames : []
  );
  const [favoritescount, setfavoritescount] = useState(0);
  const isOpen: boolean = useIsDrawerOpen();
  useFocusEffect(
    React.useCallback(() => {
    if (isOpen) {
      let favadvices,favgames;
      if(favoriteadvices && favoriteadvices.length > 0) {
        favadvices = favoriteadvices.length;
      }else {
        favadvices = 0;
      }
      if(favoritegames && favoritegames.length > 0) {
        favgames = favoritegames.length;
      }else {
        favgames = 0;
      }
      setfavoritescount(favadvices + favgames);
    }
  }, [isOpen, activeChild.uuid, favoriteadvices,favoritegames]),
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  useFocusEffect(
    React.useCallback(() => {
    if (isOpen) {
      // Your dismiss logic here 

      if (allnotis.length > 0) {
        const currentChildNotis = allnotis?.find((item:any) => item.childuuid == activeChild.uuid)
        if (!isFutureDate(activeChild?.birthDate)) {
        if (currentChildNotis) {
          const currentChildallnoti: any = [];
          if (currentChildNotis.gwcdnotis) {
            currentChildNotis.gwcdnotis.forEach((item:any) => {
              currentChildallnoti.push(item)
            })
          }
          if (currentChildNotis.hcnotis) {
            currentChildNotis.hcnotis.forEach((item:any) => {
              currentChildallnoti.push(item)
            })
          }
          if (currentChildNotis.vcnotis) {
            currentChildNotis.vcnotis.forEach((item:any) => {
              currentChildallnoti.push(item)
            })
          }
          if (currentChildNotis.reminderNotis) {
            currentChildNotis.reminderNotis.forEach((item:any) => {
              currentChildallnoti.push(item)
            })
          }
          const childBirthDate = DateTime.fromJSDate(new Date(activeChild.birthDate)).toMillis();
          const toDay = DateTime.fromJSDate(new Date()).toMillis();


          const combinedNotis = currentChildallnoti.sort(
            (a: any, b: any) => new Date(a.notificationDate) - new Date(b.notificationDate),
          ).filter((item:any) => { return item.isRead == false && item.isDeleted == false && (toDay >= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis() && childBirthDate <= DateTime.fromJSDate(new Date(item.notificationDate)).toMillis()) });
          setNotifications(currentChildallnoti.length>0?combinedNotis:[])
        }
      }else{
        setNotifications([]);
      }
      }
    }
  }, [isOpen, activeChild.uuid, allnotis]),
  );
  const onShare = async ():Promise<any> => {
    const localeData=(String(buildFor) != buildForBebbo)?languageCode:"";
    const messageData=t('appShareText')+shareText+localeData;
    console.log(messageData,"..messageData..");
    try {
      const result = await Share.share({
        // message: t('appShareText')+'\nhttps://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en', 
        message:messageData , 
        //message:'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
      });
      if (result.action === Share.sharedAction) {
        analytics().logEvent(APP_SHARE);
      }
    } catch (error: any) {
      Alert.alert(t('generalError'));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
    }, [isOpen, activeChild.uuid, allnotis]),
  );

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  return (
    <>
     <FocusAwareStatusBar animated={true} backgroundColor={Platform.OS=='ios' ?headerColor:null}/>
      <View style={styles.containerView}>
        <ScrollView style={styles.scrollViewStyle}>
          <Flex1>
            <Pressable
              onPress={():any => navigation.navigate('ChildProfileScreen')}
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
                              source={{ uri: 'file://' + CHILDREN_PATH + activeChild.photoUri }}></ImageIcon>
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
                                  ? formatDate(activeChild.birthDate)
                                  : '',
                            }) : t('expectedChildDobLabel')}
                        </Heading5>
                      </FDirCol>
                    </FlexDirRow>
                  </HeaderTitleView>
                  <HeaderActionView>
                    <IconML name="ic_angle_right" size={16} color="#000" />
                  </HeaderActionView>
                </HeaderRowView>
              </DrawerHeadContainer>
            </Pressable>
          </Flex1>
         
          <DrawerLinkView
            onPress={():any => navigation.navigate('Home', { screen: 'Home' })}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_home" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenuhomeTxt')}</Heading4>
          </DrawerLinkView>


          <DrawerLinkView
            onPress={():any => navigation.navigate('NotificationsScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_notification" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenunotiTxt')}</Heading4>
            {notifications.length > 0 ? <BubbleContainer>
              <BubbleView>
                <Heading5>{notifications.length}</Heading5>
              </BubbleView>
            </BubbleContainer>
              : null}
          </DrawerLinkView>

          <DrawerLinkView style={{ backgroundColor: accordvalue ? lightShadeColor : bgcolorWhite2 }} onPress={():any => onChangeaccordvalue(!accordvalue)}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_tools" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenutoolsTxt')}</Heading4>
            <Icon
              style={styles.iconStyle}
              name={accordvalue ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            />
          </DrawerLinkView>

          {accordvalue ? (
            <>
              <SubDrawerLinkView 
                onPress={():any =>
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
                    <Heading4 style={styles.headingFlexShrink}>{t('drawerMenucdTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={():any => {
                  navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'VaccinationTab',
                    },
                  });
                }
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
                    <Heading4 style={styles.headingFlexShrink}>{t('drawerMenuvcTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={():any => {
                  navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'HealthCheckupsTab',
                    },
                  });
                }
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
                    <Heading4 style={styles.headingFlexShrink}>{t('drawerMenuhcTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={():any => {
                  navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'ChildgrowthTab',
                    },
                  });
                }
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
                    <Heading4 style={styles.headingFlexShrink}>{t('drawerMenucgTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
            </>
          ) : null}
          <DrawerLinkView onPress={():any => navigation.navigate('SupportChat')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_chat" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenuchatTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={():any => navigation.navigate('Favourites',{tabIndex: 0,backClicked:'no'})}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_favorites" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenufavTxt')}</Heading4>
            { favoritescount > 0 ?
              <BubbleContainer>
                <BubbleView>
                  <Heading5>{favoritescount}</Heading5>
                </BubbleView>
              </BubbleContainer>
              : null
            }
          </DrawerLinkView>
          <DrawerLinkView onPress={():any => navigation.navigate('AboutusScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_about" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenuabtTxt')}</Heading4>
          </DrawerLinkView>
          {userGuideItem && userGuideItem != {} && userGuideItem != '' && userGuideItem?.survey_feedback_link && userGuideItem?.survey_feedback_link != '' && userGuideItem?.survey_feedback_link != null ? 
            <DrawerLinkView onPress={():any => 
              {
                Linking.openURL(userGuideItem?.survey_feedback_link);
                // navigation.navigate('UserGuide')
              }}>
              <OuterIconRow>
                <OuterIconLeft15>
                  <Icon name="ic_sb_userguide" size={25} color="#000" />
                </OuterIconLeft15>
              </OuterIconRow>

              <Heading4 style={styles.headingFlexShrink}>{t('drawerMenuugTxt')}</Heading4>
            </DrawerLinkView>
            : null}
          <DrawerLinkView onPress={():any => navigation.navigate('SettingsScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_settings" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenusetTxt')}</Heading4>
          </DrawerLinkView>

          <DrawerLinkView onPress={():any => onShare()}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_shareapp" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenushareTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={():any => { setModalVisible(true); }}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_feedback" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenufeedbackTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={():any => {
            if(Platform.OS === 'android') {
              if(String(buildFor) == buildForBebbo) { 
                Linking.openURL('https://play.google.com/store/apps/details?id=org.unicef.ecar.bebbo') 
              }
              else { 
                Linking.openURL('https://play.google.com/store/apps/details?id=org.unicef.kosovo.foleja') 
              }
            }else {
              if(String(buildFor) == buildForBebbo) {
                Linking.openURL('itms://itunes.apple.com/in/app/apple-store/id1588918146?action=write-review') 
              }
              else {
                Linking.openURL('itms://itunes.apple.com/xk/app/apple-store/id1607980150?action=write-review');
              }
            }
            
           }}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_loveapp" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenurateTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView
            onPress={():any => {
              navigation.navigate('PrivacyPolicy');
            }}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_privacy" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={styles.headingFlexShrink}>{t('drawerMenuPrivacyTxt')}</Heading4>
          </DrawerLinkView>
        
        </ScrollView>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible === true}
        onRequestClose={():any => {
          setModalVisible(false);
        }}
        onDismiss={():any => {
          setModalVisible(false);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={():any => {
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
                    source={{ html: addSpaceToHtml(feedbackItem?.body)}}
                    ignoredStyles={['color', 'font-size', 'font-family']}
                  />
                  : null
                }

              </ModalPopupContent>
                <FDirRow>
                  <ButtonModal
                    onPress={():any => {
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