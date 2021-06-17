import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import Ruler from '@components/Ruler';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { Dimensions, Pressable, SafeAreaView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildWeight = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const tintColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const screenPadding = 10;
  const {height,width} = Dimensions.get('screen');
  const [weight, setweight] = useState<number>(0);
  const [weight1, setweight1] = useState<number>(0.0);
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View style={{flex: 1}}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Text>Back</Text>
            </Pressable>
          </View>
          <View style={{flex: 3}}>
            <Text> {'Add New Child Weight'}</Text>
          </View>
        </View>

        <View style={{padding: screenPadding,backgroundColor:tintColor}}>
          <Heading1 style={{textAlign: 'center'}}>
            {(weight + 0.01 * weight1).toFixed(2)} kg
          </Heading1>
          <Ruler
            style={{elevation: 3}}
            width={width - screenPadding- screenPadding}
            height={100}
            vertical={false}
            onChangeValue={(value) => setweight(value)}
            minimum={0}
            maximum={200}
            segmentWidth={2}
            segmentSpacing={20}
            indicatorColor="#AB8AD5"
            indicatorWidth={100}
            indicatorHeight={100}
            indicatorBottom={0}
            step={10}
            stepPreFix={1}
            stepColor="#333333"
            stepHeight={40}
            normalColor="#999999"
            normalHeight={20}
            backgroundColor={'#FFF'}
          />
          <View style={{marginBottom: 20}}></View>
          <Ruler
            style={{elevation: 3}}
            width={width - screenPadding- screenPadding}
            height={100}
            vertical={false}
            onChangeValue={(value) => setweight1(value)}
            minimum={0}
            maximum={100}
            segmentWidth={2}
            segmentSpacing={20}
            indicatorColor="#AB8AD5"
            indicatorWidth={100}
            indicatorHeight={100}
            indicatorBottom={0}
            step={10}
            stepPreFix={0.01}
            stepColor="#333333"
            stepHeight={40}
            normalColor="#999999"
            normalHeight={20}
            backgroundColor={'#D5C5EA'}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildWeight;
