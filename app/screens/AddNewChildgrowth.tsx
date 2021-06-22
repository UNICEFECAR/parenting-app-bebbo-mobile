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
import { Heading2w, Heading3, Heading4Regular } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View
} from 'react-native';
import { ThemeContext } from 'styled-components';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildgrowth = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const [dobDate, setdobDate] = useState<Date>();
  const [showdob, setdobShow] = useState<Boolean>(false);
  const measurementPlaces = [
    t('growthScreen.doctorMeasurePlace'),
    t('growthScreen.homeMeasurePlace'),
  ];
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
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1, padding: 15}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 8, padding: 7}}>
              <Heading2w style={{color: '#000'}}>{headerTitle}</Heading2w>
            </View>
            <Pressable style={{flex: 1, padding: 15}}>
              <Text>{t('growthScreen.deletebtnText')}</Text>
            </Pressable>
          </View>
        </View>
        <FormInputGroup onPress={showdobDatepicker}>
          <Header3Text>{t('growthScreen.dateMeasurementText')}</Header3Text>
          <FormInputBox>
            <FormDateText>
              <Text>
                {' '}
                {dobDate
                  ? dobDate.toDateString()
                  : t('growthScreen.enterDateMeasurementText')}
              </Text>
            </FormDateText>
            <FormDateAction>
              <Icon name="ic_calendar" size={20} color="#000" />
            </FormDateAction>
          </FormInputBox>
        </FormInputGroup>
        <Header3Text>{t('growthScreen.whereMeasured')}</Header3Text>
        <View style={{flexDirection: 'row'}}>
          {measurementPlaces.map((item, index) => {
            return (
              <View
                key={index}
                style={{padding: 10, backgroundColor: '#FFF', margin: 3}}>
                <Pressable
                  onPress={() => {
                    console.log(item);
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
          <Header3Text>{t('growthScreen.enterMeasuresText')}</Header3Text>
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
              <Heading3>{t('growthScreen.wText')}</Heading3>
              <Heading4Regular>{t('growthScreen.kgText')}</Heading4Regular>
            </Pressable>
            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: '#FFF',
                padding: 20,
                flex: 1,
                flexDirection: 'row',
              }}>
              <Heading3>{t('growthScreen.hText')}</Heading3>
              <Heading4Regular>{t('growthScreen.cmText')}</Heading4Regular>
            </Pressable>
          </View>
        </View>
        <View>
          <Header3Text>{t('growthScreen.enterDoctorRemarkText')}</Header3Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            value={''}
            // onChangeText={queryText => handleSearch(queryText)}
            placeholder={t('growthScreen.enterDoctorRemarkTextPlaceHolder')}
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          />
        </View>
        <View>
          <Text>{t('growthScreen.newGrowthBottomText')}</Text>
        </View>
        <View style={{width: '100%', marginTop: 30}}>
          <ButtonPrimary
            onPress={() => {
              navigation.goBack();
            }}>
            <ButtonText>{t('growthScreen.saveMeasures')}</ButtonText>
          </ButtonPrimary>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildgrowth;
