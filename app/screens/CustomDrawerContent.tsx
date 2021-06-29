import { BgDevelopment, BgGrowth, BgHealth, BgVaccination } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FDirCol, Flex1, FlexDirRow,FDirRow } from '@components/shared/FlexBoxStyle';
import { HeaderActionView, HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon, { OuterIconLeft15,OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import {SubDrawerLinkView,SubDrawerHead, NavIconSpacing,DrawerHeadContainer,DrawerLinkView } from '@components/shared/NavigationDrawer';
import { Heading3, Heading4, Heading5, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components';
const CustomDrawerContent = ({navigation}: any) => {
  const [accordvalue, onChangeaccordvalue] = React.useState(false);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Parenbuddy App | An App for parents to monitor and guide your child growth',
      });
      if (result.action === Share.sharedAction) {
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
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  return (
    <>
      <SafeAreaView>
        <ScrollView>
        <View>
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
                <Icon name="ic_baby" size={25} color="#000" />
                </OuterIconLeft15>
                </OuterIconRow>
                <FDirCol>
            <Heading3>Alice</Heading3>
            <Heading5>{t('drawerMenuchildInfo',{childdob: '19 Jul 2020 02:32pm'})}</Heading5>
            </FDirCol>
           
           
            
            </FlexDirRow>
                </HeaderTitleView>
              <HeaderActionView>
                <Icon name="ic_angle_right" size={16} color="#000" />
              </HeaderActionView>
             
              </HeaderRowView>
              </DrawerHeadContainer>
          </Pressable>
        </View>
        <DrawerLinkView
          onPress={() => navigation.navigate('Home')}
          ><OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_home" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          
          <Heading4>{t('drawerMenuhomeTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView
          onPress={() => navigation.navigate('NotificationsScreen')}>
            <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_notification" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          
          <Heading4>{t('drawerMenunotiTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView
          onPress={() => onChangeaccordvalue(!accordvalue)}>
          
          <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_tools" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          <Heading4>{t('drawerMenutoolsTxt')}</Heading4>
          <Icon  style={{flex: 1, textAlign: 'right', alignSelf: 'center'}} name={accordvalue ? 'ic_angle_up' : 'ic_angle_down'} size={10} color="#000" />

        </DrawerLinkView>

        {accordvalue ? (
          <>
            <SubDrawerLinkView
              onPress={() =>
                navigation.navigate('Home', {screen: 'ChildDevelopment'})
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
              <Heading4>{t('drawerMenucdTxt')}</Heading4>
              </SubDrawerHead>
              </FDirRow>
            </SubDrawerLinkView>
            <SubDrawerLinkView
              onPress={() =>
                navigation.navigate('Tools', {screen: 'VaccinationTab'})
              }
              >
              <FDirRow>
            <BgVaccination>
              <NavIconSpacing>
            <Icon name="ic_vaccination" size={25} color="#000" />
            </NavIconSpacing>
            </BgVaccination>
          </FDirRow>
          <FDirRow>
            <SubDrawerHead>
              <Heading4>{t('drawerMenuvcTxt')}</Heading4>
              </SubDrawerHead>
              </FDirRow>
            </SubDrawerLinkView>
            <SubDrawerLinkView
              onPress={() =>
                navigation.navigate('Tools', {screen: 'HealthCheckupsTab'})}>
               
              <FDirRow>
            <BgHealth>
              <NavIconSpacing>
            <Icon name="ic_doctor_chk_up" size={25} color="#000" />
            </NavIconSpacing>
            </BgHealth>
          </FDirRow>
          <FDirRow>
            <SubDrawerHead>
              <Heading4>{t('drawerMenuhcTxt')}</Heading4>
              </SubDrawerHead>
              </FDirRow>
            </SubDrawerLinkView>
            <SubDrawerLinkView
              onPress={() =>
                navigation.navigate('Tools', {screen: 'ChildgrowthTab'})
              }
             >
            <FDirRow>
            <BgGrowth>
              <NavIconSpacing>
            <Icon name="ic_growth" size={25} color="#000" />
            </NavIconSpacing>
            </BgGrowth>
          </FDirRow>
          <FDirRow>
            <SubDrawerHead>
              <Heading4>{t('drawerMenucgTxt')}</Heading4>
              </SubDrawerHead>
              </FDirRow>
            </SubDrawerLinkView>
          </>
        ) : null}
        <DrawerLinkView
          onPress={() => navigation.navigate('SupportChat')}>
            <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_chat" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
        
          <Heading4>{t('drawerMenuchatTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView
          onPress={() => navigation.navigate('Favourites')}
          >
             <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_favorites" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
       
          <Heading4>{t('drawerMenufavTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView
          onPress={() => navigation.navigate('AboutusScreen')}
          >
            <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_about" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          
          <Heading4>{t('drawerMenuabtTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView
          onPress={() => navigation.navigate('UserGuide')}
          >
            <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_userguide" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          
          <Heading4>{t('drawerMenuugTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView
          onPress={() => navigation.navigate('SettingsScreen')}
          >
            
            <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_settings" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          
          <Heading4>{t('drawerMenusetTxt')}</Heading4>
        </DrawerLinkView>

        <DrawerLinkView onPress={() => onShare}>
        <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_shareapp" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          <Heading4>{t('drawerMenushareTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView onPress={() => {}}>
        <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_feedback" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          <Heading4>{t('drawerMenufeedbackTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView onPress={() => {}} >
        <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_loveapp" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          <Heading4>{t('drawerMenurateTxt')}</Heading4>
        </DrawerLinkView>
        <DrawerLinkView onPress={() => {navigation.navigate('PrivacyPolicy')}}>
        <OuterIconRow>
            <OuterIconLeft15>
            <Icon name="ic_sb_privacy" size={25} color="#000" />
            </OuterIconLeft15>
          </OuterIconRow>
          <Heading4>{t('drawerMenuPrivacyTxt')}</Heading4>
        </DrawerLinkView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CustomDrawerContent;
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    // padding: 20,
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 16,
    borderBottomWidth:1,
    borderBottomColor:'#00000011',
    // flex: 1
  },
});
