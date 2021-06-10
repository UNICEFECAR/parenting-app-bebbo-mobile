import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Icon from '@components/shared/Icon';
import React, {useContext} from 'react';
import {
  View,
  Text,
  Button,
  Share,
  Alert,
  Pressable,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemeContext} from 'styled-components';
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

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        {/* <FocusAwareStatusBar
          animated={true}
          // barStyle="dark-content"
          backgroundColor={headerColor}
         /> */}
        <View>
          <Pressable
            onPress={() => navigation.navigate('ChildProfileScreen')}
            style={{
              padding: 25,
              flexDirection: 'row',
              backgroundColor: headerColor,
            }}>
            <Icon name="ic_baby" size={25} color="#000" />
            <Text>Child 1 Born on 19july 2020</Text>
            <Icon name="ic_angle_right" size={15} color="#000" />
          </Pressable>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.item}>
          <Icon name="ic_sb_home" size={25} color="#000" />
          <Text>Home</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('NotificationsScreen')}
          style={styles.item}>
          <Icon name="ic_sb_notification" size={25} color="#000" />
          <Text>Notifications</Text>
        </Pressable>
        <Pressable
          onPress={() => onChangeaccordvalue(!accordvalue)}
          style={styles.item}>
          <Icon name="ic_sb_tools" size={25} color="#000" />
          <Text>Tools</Text>
          <Icon name="ic_angle_down" size={15} color="#000" />
        </Pressable>

        {accordvalue ? (
          <>
            <Pressable
              onPress={() => navigation.navigate('ChildgrowthScreen')}
              style={styles.item}>
              <Icon name="ic_growth" size={25} color="#000" />
              <Text>ChildGrowth</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('ChildDevelopmentScreen')}
              style={styles.item}>
              <Icon name="ic_growth" size={25} color="#000" />
              <Text>ChildDevelopment</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('VaccinationScreen')}
              style={styles.item}>
              <Icon name="ic_growth" size={25} color="#000" />
              <Text>Vaccination</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('HealthCheckupsScreen')}
              style={styles.item}>
              <Icon name="ic_growth" size={25} color="#000" />
              <Text>HealthCheckups</Text>
            </Pressable>
          </>
        ) : null}
        <Pressable
          onPress={() => navigation.navigate('Favourites')}
          style={styles.item}>
          <Icon name="ic_sb_favorites" size={25} color="#000" />
          <Text>Favourites</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('AboutusScreen')}
          style={styles.item}>
          <Icon name="ic_sb_about" size={25} color="#000" />
          <Text>About us</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('UserGuide')}
          style={styles.item}>
          <Icon name="ic_sb_userguide" size={25} color="#000" />
          <Text>UserGuide</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('SettingsScreen')}
          style={styles.item}>
          <Icon name="ic_sb_settings" size={25} color="#000" />
          <Text>Settings</Text>
        </Pressable>

        <Pressable onPress={() => onShare} style={styles.item}>
          <Icon name="ic_sb_shareapp" size={25} color="#000" />
          <Text>Settings</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.item}>
          <Icon name="ic_sb_feedback" size={25} color="#000" />
          <Text>Feedback</Text>
        </Pressable>
        <Pressable onPress={() => {}} style={styles.item}>
          <Icon name="ic_sb_loveapp" size={25} color="#000" />
          <Text>Love the App? Rate it</Text>
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
