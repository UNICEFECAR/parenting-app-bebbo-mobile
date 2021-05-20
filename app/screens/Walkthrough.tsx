import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {View, Text, Button} from 'react-native';
import {RootStackParamList} from '../navigation/types';

type Walkthrough1NavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: Walkthrough1NavigationProp;
};
const Walkthrough = ({navigation}: Props) => {
  const { t, i18n } = useTranslation();
  // console.log(t('Walkthroughscreen'),"--wlkthru screen ",i18n.language);
  return (
    <View>
      <Text>{t('Walkthroughscreen')}</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          navigation.navigate('ChildSetup');
        }}
      />
    </View>
  );
};

export default Walkthrough;
