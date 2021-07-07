import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonColTwo, ButtonContainerTwo, ButtonPrimary, ButtonSecondary, ButtonSecondaryTint, ButtonTertiary, ButtonText } from '@components/shared/ButtonGlobal';
import {
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup
} from '@components/shared/ChildSetupStyle';
import { HeaderActionView, HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
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
  Heading2,
  Heading2w,
  Heading3Center,
  Paragraph,
  ShiftFromTop30,ShiftFromTop20,ShiftFromTopBottom10
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
        <HeaderRowView
        style={{
          backgroundColor: headerColor,
          maxHeight: 50,
        }}>
          
              <HeaderIconView>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
              </HeaderIconView>
              <HeaderTitleView>
              <Heading2>{headerTitle}</Heading2>
              </HeaderTitleView>
              <HeaderActionView>
              <Pressable
              onPress={() => {
                setModalVisible(true)
              }}>
                <Text>{t('growthScreendeletebtnText')}</Text>
              </Pressable>
              </HeaderActionView>
              </HeaderRowView>
        
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
<ShiftFromTop20>
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
        </ShiftFromTop20>
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
        
       
        <ShiftFromTop30>
          <ButtonTertiary
          
            onPress={() => {
              navigation.goBack();
            }}>
            <ButtonText>{buttonTitle}</ButtonText>
          </ButtonTertiary>
          </ShiftFromTop30>
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
              <ShiftFromTopBottom10>
              <Heading3Center>
                {warningTxt}
              </Heading3Center>
              </ShiftFromTopBottom10>
              <ButtonContainerTwo>
                <ButtonColTwo>
                  <ButtonSecondaryTint>
                  <ButtonText>{t('growthDeleteOption1')}</ButtonText>
                  </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                  <ButtonSecondary>
                  <ButtonText>{t('growthDeleteOption2')}</ButtonText>
                    </ButtonSecondary>
                    </ButtonColTwo>
                
              </ButtonContainerTwo>
              
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
        </ScrollView>
        
      </SafeAreaView>
    </>
  );
};

export default AddReminder;
