import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components';

type VaccinationNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: VaccinationNavigationProp;
};
const Vaccination = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext.colors.VACCINATION_TINTCOLOR;
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
          <TabScreenHeader title="Vaccination" headerColor={headerColor} textColor='#FFF'/>
          <ScrollView style={{flex: 4, backgroundColor: backgroundColor}}>
            <View>
            <ButtonPrimary
                    onPress={() => navigation.navigate('AddChildVaccination',{headerTitle:'Add Vaccination Data'})}>
                    <ButtonText>AddChildVaccination</ButtonText>
                  </ButtonPrimary>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Vaccination;
