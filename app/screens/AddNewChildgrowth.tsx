import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import {
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header3Text } from '@styles/style';
import { Heading3, Heading4Regular } from '@styles/typography';
import React, { useContext, useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView, Text,
  TextInput,
  View
} from 'react-native';
import { ThemeContext } from 'styled-components';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildgrowth = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const [dobDate, setdobDate] = useState<Date>();
  const [showdob, setdobShow] = useState<Boolean>(false);
  const measurementPlaces = ['At a Doctor', 'At Home'];
  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dobDate;
    setdobShow(Platform.OS === 'ios');
    setdobDate(currentDate);
  };
  const showdobDatepicker = () => {
    setdobShow(true);
  };
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
            borderBottomColor: 'gray',
            borderBottomWidth: 2,
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
            <Text> {'Add New Child Measurement'}</Text>
          </View>
        </View>
        <FormInputGroup onPress={showdobDatepicker}>
          <Header3Text>Date of Measurement</Header3Text>
          <FormInputBox>
            <FormDateText>
              <Text> {dobDate ? dobDate.toDateString() : null}</Text>
            </FormDateText>
            <FormDateAction>
              <Icon name="ic_calendar" size={20} color="#000" />
            </FormDateAction>
          </FormInputBox>
        </FormInputGroup>
        <Header3Text>Where was the child measured</Header3Text>
        <View style={{flexDirection: 'row'}}>
          {measurementPlaces.map((item, index) => {
            return (
              <View
                key={index}
                style={{padding: 10, backgroundColor: '#FFF', margin: 3}}>
                <Pressable
                  onPress={() => {
                   // console.log(item);
                  }}>
                  <Heading3>{item}</Heading3>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View>
          {showdob && (
            <DateTimePicker
              testID="dobdatePicker"
              value={new Date()}
              mode={'date'}
              display="default"
              onChange={ondobChange}
            />
          )}
        </View>
        <View style={{margin: 30}}>
          <Header3Text>Enter Weight and Height</Header3Text>
          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={() => {
                navigation.navigate('AddNewChildWeight');
              }}
              style={{
                backgroundColor: '#FFF',
                padding: 20,
                flex: 1,
                flexDirection: 'row',
              }}>
              <Heading3>Weight</Heading3>
              <Heading4Regular>kg</Heading4Regular>
            </Pressable>
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: '#FFF',
                padding: 20,
                flex: 1,
                flexDirection: 'row',
              }}>
              <Heading3>Height</Heading3>
              <Heading4Regular>cm</Heading4Regular>
            </Pressable>
          </View>
        </View>
        <View>
          <Header3Text>Doctor Remark or Comment</Header3Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            value={''}
            // onChangeText={queryText => handleSearch(queryText)}
            placeholder="Enter your Doctor's Remark or Comment"
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          />
        </View>
        <View style={{width: '100%', marginTop: 30}}>
          <ButtonPrimary
            onPress={() => {
              navigation.goBack();
            }}>
            <ButtonText>Save Data</ButtonText>
          </ButtonPrimary>
        </View>

        
      </SafeAreaView>
    </>
  );
};

export default AddNewChildgrowth;

