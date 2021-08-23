import {
  BgDevelopment,
  BgGrowth,
  BgHealth,
  BgVaccination
} from '@components/shared/BackgroundColors';
import analytics from '@react-native-firebase/analytics';
import {
  ButtonModal, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  FDirCol,
  FDirRow,
  Flex1,
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
import { useFocusEffect } from '@react-navigation/native';
import {
  Heading1Centerr,
  Heading3, Heading4, Heading5
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Modal, Pressable, ScrollView, Share } from 'react-native';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import { isFutureDate } from '../services/childCRUD';
import { formatDate } from '../services/Utils';
import { APP_SHARE, FEEDBACK_SUBMIT } from '@assets/data/firebaseEvents';
const CustomDrawerContent = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [accordvalue, onChangeaccordvalue] = React.useState(false);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const surveryData = useAppSelector((state: any) =>
    state.utilsData.surveryData != ''
      ? JSON.parse(state.utilsData.surveryData)
      : state.utilsData.surveryData,
  );
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  // console.log(activeChild, '..activeChild..');
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
      Alert.alert(error.message);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
    }, []),
  );

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  return (
    <>
      <SafeAreaView>
        <ScrollView>
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
                          {( activeChild.birthDate != '' &&
                                activeChild.birthDate != null &&
                                activeChild.birthDate != undefined && !isFutureDate(activeChild.birthDate)) ? t('drawerMenuchildInfo', {
                            childdob:
                              activeChild.birthDate != '' &&
                                activeChild.birthDate != null &&
                                activeChild.birthDate != undefined
                                ? formatDate(activeChild.birthDate,luxonLocale)
                                : '',
                          }):t('expectedChildDobLabel')}
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

            <Heading4 style={{flexShrink: 1}}>{t('drawerMenuhomeTxt')}</Heading4>
          </DrawerLinkView>


          <DrawerLinkView
            onPress={() => navigation.navigate('NotificationsScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_notification" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{flexShrink: 1}}>{t('drawerMenunotiTxt')}</Heading4>
            <BubbleContainer>
              <BubbleView>
                <Heading5>10</Heading5>
              </BubbleView>
            </BubbleContainer>
          </DrawerLinkView>





          <DrawerLinkView style={{ backgroundColor: accordvalue ? "#F7F6F4" : "#FFF" }} onPress={() => onChangeaccordvalue(!accordvalue)}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_tools" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{flexShrink: 1}}>{t('drawerMenutoolsTxt')}</Heading4>
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
                    <Heading4 style={{flexShrink: 1}}>{t('drawerMenucdTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={() =>
                  { navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'VaccinationTab',
                    },
                  });}
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
                    <Heading4 style={{flexShrink: 1}}>{t('drawerMenuvcTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={() =>
                 { navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'HealthCheckupsTab',
                    },
                  });}
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
                    <Heading4 style={{flexShrink: 1}}>{t('drawerMenuhcTxt')}</Heading4>
                  </SubDrawerHead>
                </FDirRow>
              </SubDrawerLinkView>
              <SubDrawerLinkView
                onPress={() =>
                  { navigation.navigate('Home', {
                    screen: 'Tools',
                    params: {
                      screen: 'ChildgrowthTab',
                    },
                  });}
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
                    <Heading4 style={{flexShrink: 1}}>{t('drawerMenucgTxt')}</Heading4>
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

            <Heading4 style={{flexShrink: 1}}>{t('drawerMenuchatTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => navigation.navigate('Favourites')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_favorites" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{flexShrink: 1}}>{t('drawerMenufavTxt')}</Heading4>
            <BubbleContainer>
              <BubbleView>
                <Heading5>10</Heading5>
              </BubbleView>
            </BubbleContainer>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => navigation.navigate('AboutusScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_about" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{flexShrink: 1}}>{t('drawerMenuabtTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => navigation.navigate('UserGuide')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_userguide" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{flexShrink: 1}}>{t('drawerMenuugTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => navigation.navigate('SettingsScreen')}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_settings" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>

            <Heading4 style={{flexShrink: 1}}>{t('drawerMenusetTxt')}</Heading4>
          </DrawerLinkView>

          <DrawerLinkView onPress={() => onShare()}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_shareapp" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{flexShrink: 1}}>{t('drawerMenushareTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => {  setModalVisible(true);}}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_feedback" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{flexShrink: 1}}>{t('drawerMenufeedbackTxt')}</Heading4>
          </DrawerLinkView>
          <DrawerLinkView onPress={() => { }}>
            <OuterIconRow>
              <OuterIconLeft15>
                <Icon name="ic_sb_loveapp" size={25} color="#000" />
              </OuterIconLeft15>
            </OuterIconRow>
            <Heading4 style={{flexShrink: 1}}>{t('drawerMenurateTxt')}</Heading4>
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
            <Heading4 style={{flexShrink: 1}}>{t('drawerMenuPrivacyTxt')}</Heading4>
          </DrawerLinkView>
        </ScrollView>
      </SafeAreaView>
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
              <ModalPopupContent>
                <Heading1Centerr>{surveryData[0].title}</Heading1Centerr>
              
                {surveryData[0] && surveryData[0].body ?
                    <HTML
                      source={{html: surveryData[0].body}}
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
                    Linking.openURL(surveryData[0].survey_link)
                  }}>
                  <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                </ButtonModal>
              </FDirRow>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
    </>
  );
};

export default CustomDrawerContent;