import Icon from '@components/shared/Icon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Share, StyleSheet, Text, View } from 'react-native';
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
      <SafeAreaView style={{flex: 1}}>
        <View>
          <Pressable
            onPress={() => navigation.navigate('ChildProfileScreen')}
            style={{
              padding: 25,
              flexDirection: 'row',
              backgroundColor: headerColor,
            }}>
            <Icon name="ic_baby" size={25} color="#000" />
            <Text>{t('drawerMenu.childInfo',{childName:"Alice",childdob: '19 Jul 2020 02:32pm'})}</Text>
            <Icon name="ic_angle_right" size={15} color="#000" />
          </Pressable>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.item}>
          <Icon name="ic_sb_home" size={25} color="#000" />
          <Text>{t('drawerMenu.homeTxt')}</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('NotificationsScreen')}
          style={styles.item}>
          <Icon name="ic_sb_notification" size={25} color="#000" />
          <Text>{t('drawerMenu.notiTxt')}</Text>
        </Pressable>
        <Pressable
          onPress={() => onChangeaccordvalue(!accordvalue)}
          style={styles.item}>
          <Icon name="ic_sb_tools" size={25} color="#000" />
          <Text>{t('drawerMenu.toolsTxt')}</Text>
          <Icon name="ic_angle_down" size={15} color="#000" />
        </Pressable>

        {accordvalue ? (
          <>
            <Pressable
              onPress={() =>
                navigation.navigate('Home', {screen: 'ChildDevelopment'})
              }
              style={styles.item}>
              <Icon name="ic_milestone" size={25} color="#000" />
              <Text>{t('drawerMenu.cdTxt')}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate('Tools', {screen: 'VaccinationTab'})
              }
              style={styles.item}>
              <Icon name="ic_vaccination" size={25} color="#000" />
              <Text>{t('drawerMenu.vcTxt')}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate('Tools', {screen: 'HealthCheckupsTab'})
              }
              style={styles.item}>
              <Icon name="ic_doctor_chk_up" size={25} color="#000" />
              <Text>{t('drawerMenu.hcTxt')}</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.navigate('Tools', {screen: 'ChildgrowthTab'})
              }
              style={styles.item}>
              <Icon name="ic_growth" size={25} color="#000" />
              <Text>{t('drawerMenu.cgTxt')}</Text>
            </Pressable>
          </>
        ) : null}
        <Pressable
          onPress={() => navigation.navigate('SupportChat')}
          style={styles.item}>
          <Icon name="ic_chat" size={25} color="#000" />
          <Text>{t('drawerMenu.chatTxt')}</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Favourites')}
          style={styles.item}>
          <Icon name="ic_sb_favorites" size={25} color="#000" />
          <Text>{t('drawerMenu.favTxt')}</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('AboutusScreen')}
          style={styles.item}>
          <Icon name="ic_sb_about" size={25} color="#000" />
          <Text>{t('drawerMenu.abtTxt')}</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('UserGuide')}
          style={styles.item}>
          <Icon name="ic_sb_userguide" size={25} color="#000" />
          <Text>{t('drawerMenu.ugTxt')}</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('SettingsScreen')}
          style={styles.item}>
          <Icon name="ic_sb_settings" size={25} color="#000" />
          <Text>{t('drawerMenu.setTxt')}</Text>
        </Pressable>

        <Pressable onPress={() => onShare} style={styles.item}>
          <Icon name="ic_sb_shareapp" size={25} color="#000" />
          <Text>{t('drawerMenu.shareTxt')}</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.item}>
          <Icon name="ic_sb_feedback" size={25} color="#000" />
          <Text>{t('drawerMenu.feedbackTxt')}</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.item}>
          <Icon name="ic_sb_loveapp" size={25} color="#000" />
          <Text>{t('drawerMenu.rateTxt')}</Text>
        </Pressable>
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
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    // flex: 1
  },
});
