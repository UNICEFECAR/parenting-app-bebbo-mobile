import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import {ButtonPrimary, ButtonText} from '@components/shared/ButtonGlobal';
import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, Text, Pressable, SafeAreaView, ScrollView} from 'react-native';
import {ThemeContext} from 'styled-components';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';
import {
  Heading3,
  Heading2,
  Heading4,
  Heading3Regular,
  Paragraph,
  Heading5,
} from '../../styles/typography';
type ChildgrowthNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ChildgrowthNavigationProp;
};
const Childgrowth = ({navigation}: Props) => {
  const [childmeasures, setChildmeasures] = React.useState<any[]>([]);

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
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
              <Pressable
                onPress={() => {
                  setChildmeasures([1]);
                }}>
                <Heading2>{'Child Development'}</Heading2>
              </Pressable>
            </View>
          </View>
          <ScrollView
            style={{flex: 4, backgroundColor: backgroundColor, padding: 15}}>
            {childmeasures.length == 0 ? (
              <View style={{alignItems: 'center'}}>
                <Heading3>Baby is 3 month Old</Heading3>
                <Heading3Regular>
                  your baby's growth data is not measured yet
                </Heading3Regular>
                <Heading4>
                  This will help you to track related to your child's growth
                </Heading4>
                <View style={{width: '100%', marginTop: 30}}>
                  <ButtonPrimary onPress={() => {}}>
                    <ButtonText>Add new measurement</ButtonText>
                  </ButtonPrimary>
                </View>
              </View>
            ) : (
              <View>
                <Paragraph>
                  {
                    'In the second year, the growth is intense, but it slows down slightly compared to the first year, so now children gain an average of ten centimeters (1 cm per month). As a result, appetite decreases, which is a normal occurrence.'
                  }
                </Paragraph>
                <View style={{padding: 10, backgroundColor: '#FFF'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Heading3>Growth Measurement </Heading3>
                    <Text style={{backgroundColor: headerColor, padding: 2}}>
                      Premature
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Heading5>Last measured on 13th Nov,2019</Heading5>
                    <Pressable>
                      <Text style={{padding: 2,textDecorationLine:'underline'}}>All measurements</Text>
                    </Pressable>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                  <View style={{flexDirection: 'column',flex:2}}>
                    <Paragraph>Weight</Paragraph>
                      <Heading2 style={{padding: 2}}>8 kg</Heading2>
                  </View>
                  <View style={{flexDirection: 'column',flex:2}}>
                    <Paragraph>Height</Paragraph>
                      <Heading2 style={{padding: 2}}>73 cm</Heading2>
                  </View>
                  <View style={{flex:2,flexDirection:'row'}}>
                    <Pressable>
                      <Text style={{padding: 2,textDecorationLine:'underline'}}>Edit</Text>
                    </Pressable>
                    <Pressable>
                      <Text style={{padding: 2,textDecorationLine:'underline'}}>Delete</Text>
                    </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Childgrowth;
