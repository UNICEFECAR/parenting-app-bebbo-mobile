import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import { ButtonPrimary } from '@components/shared/ButtonGlobal';
import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, Button, View, Pressable, SafeAreaView, ScrollView} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import styled, { ThemeContext } from 'styled-components/native';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';
import {ButtonText, Container} from '../../styles/style';
import {Heading1,Heading4, Heading6} from '../../styles/typography';

type SettingScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SettingScreenNavigationProp;
};

const SettingScreen = (props: any) => {
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.PRIMARY_COLOR;
  const {t} = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <>
      <SafeAreaView style={{ flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View style={{flex: 1}}>
            <BurgerIcon />
          </View>
          <View style={{flex: 3}}>
            <Text> {'Settings'}</Text>
          </View>
        </View>
       <ScrollView style={{ flex: 1}}>
        <View style={{padding: 15}}>
        <Heading1>Notifications</Heading1>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'green',
              marginBottom: 10,
            }}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{alignSelf: 'flex-start'}}
            />
            <Text style={{alignSelf: 'flex-end'}}>
              I want to receive Notifications through the application
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'green',
              marginBottom: 10,
            }}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{alignSelf: 'flex-start'}}
            />
            <Text style={{alignSelf: 'flex-end'}}>
              I want to receive Notifications related to child growth monitoring
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'green',
              marginBottom: 10,
            }}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{alignSelf: 'flex-start'}}
            />
            <Text style={{alignSelf: 'flex-end'}}>
              I want to receive Notifications related to monitoring of child
              development
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'green',
              marginBottom: 10,
            }}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{alignSelf: 'flex-start'}}
            />
            <Text style={{alignSelf: 'flex-end'}}>
              I want to receive Notifications related to health check-ups and
              vaccinations
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'green',
              marginBottom: 10,
              padding:10
            }}>
            <Text>
              Notifications are published with different frequency, from daily
              to monthly and are integral part of the app functionality. You can
              decide to hide notifications on your home screen. You can also
              fully disable this function at any point in the app settings what
              will result in limited app functionality.
            </Text>
          </View>
        </View>
        <View style={{padding: 15}}>
        <Heading1>Data Saver Mode</Heading1>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'green',
              marginBottom: 10,
            }}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{alignSelf: 'flex-start'}}
            />
            <Text style={{alignSelf: 'flex-end'}}>
            I don't want to download any images of any articles or updates due to low internet speed.
            </Text>
          </View>
        </View>
        <View style={{padding: 15}}>
        <Heading1>Download Data</Heading1>
        <Heading4>Download latest Data updates</Heading4>
        <Heading6>Data last updated on 17 dec 2020 02:32pm</Heading6>
          <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary
                onPress={() => {              }}>
                <ButtonText>Download Update</ButtonText>
              </ButtonPrimary>
          </View>
          <Heading4>Download all app data</Heading4>
        <Heading6>Download all app Data which optimized for offline use</Heading6>
          <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary
                onPress={() => {              }}>
                <ButtonText>Download All Data</ButtonText>
              </ButtonPrimary>
          </View>
        </View>
        
        <Pressable
          style={{padding: 10}}
          onPress={() => {
            //reset navigation to localization
            props.navigation.navigate('Localization', {
              screen: 'CountrySelection',
            });

            // props.navigation.navigate('CountrySelection')
          }}>
          <ButtonText>{t('editCountryLang')}</ButtonText>
        </Pressable>

        <VectorImage source={require('@assets/svg/ic_gdrive.svg')} />
        <Button
          title="Toggle"
          onPress={() =>
            props.navigation.dispatch(DrawerActions.toggleDrawer())
          }
        />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SettingScreen;
