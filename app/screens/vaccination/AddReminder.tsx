import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import {
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { ButtonTertiary2 } from '@components/shared/WalkthroughStyle';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2w,
  Heading3,
  Paragraph
} from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal, Pressable,
  SafeAreaView,
  Text, View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddReminder = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle,buttonTitle,titleTxt,warningTxt,headerColor,reminderType} = route.params;
  const [measureDate, setmeasureDate] = useState<Date>();
  const [showmeasure, setmeasureShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [measureTime, setmeasureTime] = useState<any>();
  const [showmeasureTime, setmeasureShowTime] = useState<Boolean>(false);
const defaultDatePickerValue =new Date(2021, 10, 20);
const defaulttimePickerValue =new Date();


  const onmeasureChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || measureDate;
    setmeasureShow(false);
    setmeasureDate(currentDate);
  };
  const showmeasureDatepicker = () => {
    setmeasureShow(true);
  };

  const onmeasureTimeChange = (event: any, selectedTime: any) => {
   // console.log(selectedTime);
    const currentTime = selectedTime.getHours()+":"+selectedTime.getMinutes() || measureTime;
    setmeasureShowTime(false);
    setmeasureTime(currentTime);
  };
  const showmeasureTimepicker = () => {
    setmeasureShowTime(true);
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
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
            <Pressable
              style={{flex: 1, padding: 15}}
              onPress={() => {
                setModalVisible(true)
              }}>
              <Text>{t('growthScreendeletebtnText')}</Text>
            </Pressable>
          </View>
        </View>
        <ScrollView style={{padding:15,flex:7}}>
          <Paragraph>{titleTxt}</Paragraph>
        <FormInputGroup onPress={showmeasureDatepicker}>
          <FormInputBox>
            <FormDateText>
              <Text>
                {measureDate
                  ? measureDate.toDateString()
                  : t('vcReminderDate')}
              </Text>
            </FormDateText>
            <FormDateAction>
              <Icon name="ic_calendar" size={20} color="#000" />
            </FormDateAction>
          </FormInputBox>
        </FormInputGroup>

        <FormInputGroup onPress={showmeasureTimepicker}>
          <FormInputBox>
            <FormDateText>
              <Text>
                {measureTime
                  ? (measureTime)
                  : t('vcReminderTime')}
              </Text>
            </FormDateText>
            <FormDateAction>
              <Icon name="ic_time" size={20} color="#000" style={{borderWidth: 1, borderRadius: 50}} />
            </FormDateAction>
          </FormInputBox>
        </FormInputGroup>
        
        <View>
          {showmeasure && (
            <DateTimePicker
              testID="measuredatePicker"
              value={defaultDatePickerValue}
              mode={'date'}
              display="default"
              minimumDate={new Date()}
              // maximumDate => childDOB +72 weeks
              onChange={onmeasureChange}
            />
          )}
        </View>

        <View>
          {showmeasureTime && (
            <DateTimePicker
              testID="measuretimePicker"
              value={defaulttimePickerValue}
              mode={'time'}
              display="default"
              is24Hour={false}
              onChange={onmeasureTimeChange}
            />
          )}
        </View>
        
       
        <View style={{width: '100%', marginTop: 30}}>
          <ButtonPrimary
          style={{backgroundColor:"#FFF"}}
            onPress={() => {
              navigation.goBack();
            }}>
            <ButtonText>{buttonTitle}</ButtonText>
          </ButtonPrimary>
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
          onDismiss={() => {
            setModalVisible(!modalVisible);
          }}>
          <PopupOverlay>
            <ModalPopupContainer>
              <PopupCloseContainer>
                <PopupClose
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
              </PopupCloseContainer>
              <Heading3>
                {warningTxt}
              </Heading3>
              <View style={{flexDirection:'row',justifyContent:'space-between',padding:10}}>
              <ButtonTertiary2 style={{marginRight:5}}>
                <ButtonText>{t('growthDeleteOption1')}</ButtonText>
              </ButtonTertiary2>
              <ButtonTertiary2>
                <ButtonText>{t('growthDeleteOption2')}</ButtonText>
              </ButtonTertiary2>
              </View>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
        </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddReminder;
