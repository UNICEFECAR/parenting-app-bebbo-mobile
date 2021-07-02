import Icon from '@components/shared/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { Heading4Centerr, ShiftFromBottom30 } from '@styles/typography';
import { dobMin,minDue,maxDue } from '@types/types';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Checkbox, {
  CheckboxActive,
  CheckboxItem,
  FormOuterCheckbox
} from './shared/CheckboxStyle';
import {
  FormDateAction,
  FormDateContainer,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText
} from './shared/ChildSetupStyle';
import FormPrematureContainer, {
  FormInfoLabel
} from './shared/FormPrematureContainer';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from './shared/ModalPopupStyle';

const ChildDate = (props: any) => {
  let birthDate, isPremature, plannedTermDate=null;
  const {childData}=props;
  const isFutureDate = (date: Date) => {
    return new Date(date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
};
      useFocusEffect(
        React.useCallback(() => {
          if(childData!=null){
            birthDate =childData.birthDate;
            isPremature =childData.isPremature;
            plannedTermDate =childData.plannedTermDate;
            const inFuture=isFutureDate(birthDate);
            setdisablePrematureCheck(inFuture);
            if(inFuture){
              setIsExpected("true");
            }
            else{
              setIsExpected("false");
            }  
            setToggleCheckBox(isPremature!=null ? JSON.parse(isPremature) : false);
            setdoborExpectedDate(birthDate!=null ? new Date(birthDate) : null);
            setdueDate(plannedTermDate!=null ? new Date(plannedTermDate) : null);
            console.log(disablePrematureCheck,"..disablePrematureCheck..");
          }      
        }, [])
      );
  //console.log(birthDate,"..birthDate..");
  const { t } = useTranslation();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isExpected, setIsExpected] = useState("false");
  const [doborExpectedDate, setdoborExpectedDate] = useState<Date|null>(null);
  const [showdob, setdobShow] = useState<Boolean>(false);
  const [disablePrematureCheck, setdisablePrematureCheck] = useState<Boolean>(false);
  
  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || doborExpectedDate;
    setdobShow(Platform.OS === 'ios');
    const inFuture=isFutureDate(currentDate);
    setdisablePrematureCheck(inFuture);
    setdoborExpectedDate(currentDate);
    if(inFuture){
      setIsExpected("true");
      props.sendData({ birthDate: currentDate, dueDate: dueDate, isPremature: false,isExpected:true});
    }
    else{
      setIsExpected("false");
      props.sendData({ birthDate: currentDate, dueDate: dueDate, isPremature: false,isExpected:false});
      
    }  
   
  };
 
  const showdobDatepicker = () => {
    setdobShow(true);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [dueDate, setdueDate] = useState<Date | null>(null);
  const [showdue, setdueShow] = useState<Boolean>(false);
  const ondueDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    //console.log(currentDate,"..currentDate..")
    setdueShow(Platform.OS === 'ios');
    setdueDate(currentDate);
    props.sendData({ birthDate: doborExpectedDate, dueDate: currentDate, isPremature: toggleCheckBox,isExpected:isExpected });
  };
  const showdueDatepicker = () => {
    setdueShow(true);
  };
 
  return (
    <>
      <FormDateContainer>
        <FormInputGroup onPress={showdobDatepicker}>
          <LabelText> {t('childSetupdobLabel')}</LabelText>
          <FormInputBox>
            <FormDateText>
              <Text> {doborExpectedDate ? doborExpectedDate.toDateString() : t('childSetupdobSelector')}</Text>
            </FormDateText>
            <FormDateAction>
              <Icon name="ic_calendar" size={20} color="#000" />
            </FormDateAction>
          </FormInputBox>
        </FormInputGroup>

        <FormPrematureContainer>
          <FormOuterCheckbox
            // disabled={disablePrematureCheck}
            onPress={() => {
             
              //console.log(disablePrematureCheck,"..click disablePrematureCheck...")
              // if(!disablePrematureCheck){
               
              // }
              // else{
              //   console.log(dueDate,"..dueDate..");
              //   // props.sendData({ birthDate: doborExpectedDate, dueDate: dueDate, isPremature: toggleCheckBox });
             
              // }
              if(!disablePrematureCheck){
                props.sendData({ birthDate: doborExpectedDate, dueDate: null, isPremature: !toggleCheckBox ,isExpected:isExpected});    
                setToggleCheckBox(!toggleCheckBox);
                setdueDate(null)
              }
              
            }}>
            <CheckboxItem>
              <View>
                
                {toggleCheckBox ? (
                  <CheckboxActive  style={disablePrematureCheck?styles.disabledCheckBox:null}>
                    <Icon name="ic_tick" size={12} color="#000" />
                  </CheckboxActive>
                ) : (
                  <Checkbox></Checkbox>
                )}
              </View>
            </CheckboxItem>
            <LabelText>{t('childSetupprematureLabel')}</LabelText>
          </FormOuterCheckbox>

          <FormInfoLabel>
            <Pressable onPress={() => setModalVisible(true)}>
              <Icon name="ic_info" size={15} color="#FFF" />
            </Pressable>
          </FormInfoLabel>
        </FormPrematureContainer>

        <View>
          {showdob && (
            <DateTimePicker
              testID="dobdatePicker"
              minimumDate={ new Date(dobMin)}
              value={new Date()}
              mode={'date'}
              display="default"
              onChange={ondobChange}
            />
          )}
        </View>

        {toggleCheckBox && !disablePrematureCheck? (
          <>
            <ShiftFromBottom30>
              <FormInputGroup onPress={showdueDatepicker}>
                <LabelText>{t('childSetupdueLabel')}</LabelText>
                <FormInputBox>
                  <FormDateText>
                    <Text> {dueDate ? dueDate.toDateString() : t('childSetupdueSelector')}</Text>
                  </FormDateText>
                  <FormDateAction>
                    <Icon name="ic_calendar" size={20} color="#000" />
                  </FormDateAction>
                </FormInputBox>
              </FormInputGroup>
            </ShiftFromBottom30>
            <View>
              {showdue && (
                <DateTimePicker
                  testID="duedatePicker"
                  value={new Date()}
                  mode={'date'}
                  display="default"
                  minimumDate={new Date(DateTime.fromJSDate(doborExpectedDate as Date).plus({ weeks: minDue }).toISODate())}
                  maximumDate={new Date(DateTime.fromJSDate(doborExpectedDate as Date).plus({ months: maxDue }).toISODate())}
                  // minimumDate={{}}
                  // maximumDate={{}}
                  onChange={ondueDateChange}
                />
              )}
            </View>
          </>
        ) : null}
      </FormDateContainer>
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
            <Heading4Centerr>
              {t('childSetupprematureMessage')}
            </Heading4Centerr>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
    </>
  );
};
export default ChildDate;
const styles = StyleSheet.create({
  disabledCheckBox: {
    backgroundColor:'#ccc',opacity:0.5
  }
});