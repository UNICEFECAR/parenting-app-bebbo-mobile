import AgeBrackets from '@components/AgeBrackets';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import Icon from '@components/shared/Icon';
import {DrawerActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import {ThemeContext} from 'styled-components';
import {HomeDrawerNavigatorStackParamList} from '../../navigation/types';
import {Heading3, Heading2,Heading5} from '../../styles/typography';

type ChildDevelopmentNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildDevelopmentNavigationProp;
};
const ChildDevelopment = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const backgroundColor = themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
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
              <Text> {'Child Development'}</Text>
            </View>
          </View>
          <ScrollView style={{flex: 4, backgroundColor: '#FFF'}}>
            <View>
              <View style={{flexDirection: 'column'}}></View>
              <AgeBrackets
                itemColor={backgroundColor}
                activatedItemColor={headerColor}
              />
              <View>
                <Image
                  source={require('@assets/trash/card2.jpeg')}
                  style={{width: '100%'}}
                />
              </View>
              <View style={{padding: 10}}>
                <View style={{flexDirection: 'row'}}>
                  <Heading3>3rd and 4th Month </Heading3>
                  <Text style={{backgroundColor: headerColor, padding: 2}}>
                    Premature
                  </Text>
                </View>
                <Heading2>
                  The Period of Diverse Experiences{' '}
                  <Icon name="ic_info" size={15} color="#000" />
                </Heading2>
              </View>
              <View style={{margin: 15,}}>
                <View style={{flexDirection: 'column'}}>
                  <View style={{flexDirection: 'row'}}>
                  <Icon name="ic_info" size={25} color="#FFF" style={{backgroundColor:'red',borderRadius:150}} />
                  <Heading5>  Pending</Heading5>
                  </View>
                  <Heading3 >
                  Milestones from the current period that remain to be achieved
                  </Heading3>
                </View>
                
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChildDevelopment;
