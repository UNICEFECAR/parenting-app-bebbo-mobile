import React from 'react';
import { View, Text, Button, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomDrawerContent = ({ navigation }: any) => {
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
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <Text>CustomDrawerContent screen</Text>
          <Button
            title="Go to ChildProfile"
            onPress={() => navigation.navigate('ChildProfileScreen')}
          />
          <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
          <Button
            title="Go to NotificationsScreen"
            onPress={() => navigation.navigate('NotificationsScreen')}
          />
          <Button
            title="Open Tools"
            onPress={() => onChangeaccordvalue(!accordvalue)}
          />
          {accordvalue ? (
            <>
              <Button
                title="Go to ChildGrowth"
                onPress={() => navigation.navigate('ChildgrowthScreen')}
              />
              <Button
                title="Go to ChildDevelopment"
                onPress={() => navigation.navigate('ChildDevelopmentScreen')}
              />
              <Button
                title="Go to Vaccination"
                onPress={() => navigation.navigate('VaccinationScreen')}
              />
              <Button
                title="Go to HealthCheckups"
                onPress={() => navigation.navigate('HealthCheckupsScreen')}
              />
            </>
          ) : null}

          <Text>Favourites</Text>
          <Button
            title="Go to About us"
            onPress={() => navigation.navigate('AboutusScreen')}
          />
          <Text>User Guide</Text>
          <Button
            title="Go to Settings"
            onPress={() => navigation.navigate('SettingsScreen')}
          />
          <Button title="Share The App" onPress={() => onShare}/>
          <Text>Feedback</Text>
          <Text>Love the App? Rate it</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CustomDrawerContent;
