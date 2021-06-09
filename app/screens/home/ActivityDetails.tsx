import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { HomeDrawerNavigatorStackParamList } from '../../navigation/types';
import { Header, Container, HeaderText, Header3Text } from '../../styles/style';
type ActivityDetailsNavigationProp = StackNavigationProp<
HomeDrawerNavigatorStackParamList
>;

type Props = {
  navigation: ActivityDetailsNavigationProp;
};

const headerColor = 'red';
const ActivityDetails = ({ navigation }: Props) => {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <FocusAwareStatusBar
          animated={true}
          backgroundColor={headerColor}
        />
        <View style={{
          flexDirection: 'column',
          flex: 1,
        }}>
          <View style={{ flex: 1 }} >
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                backgroundColor: 'green',
                maxHeight: 50,
              }}>
              <View style={{ flex: 1, }} >
                <Pressable onPress={() => {navigation.goBack()}}>
                  <Text>Back</Text>
                </Pressable>
              </View>
              <View style={{ flex: 3 }} >
                <Text> {'Activity Details'}</Text>
              </View>
            </View>
          </View>
          <View>


          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ActivityDetails;
