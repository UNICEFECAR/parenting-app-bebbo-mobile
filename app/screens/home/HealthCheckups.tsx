import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components';

type HealthCheckupsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: HealthCheckupsNavigationProp;
};
const HealthCheckups = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const backgroundColor = themeContext.colors.HEALTHCHECKUP_TINTCOLOR;
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <TabScreenHeader title="Health Checkups" headerColor={headerColor} textColor='#FFF'/>
          <ScrollView style={{flex: 4, backgroundColor: backgroundColor}}>
            <View>
            <ButtonPrimary
                    onPress={() => navigation.navigate('AddChildHealthCheckup',{headerTitle:'Add HealthCheckup Data'})}>
                    <ButtonText>AddChildHealthCheckup</ButtonText>
                  </ButtonPrimary>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default HealthCheckups;
