import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonContainer, ButtonDelPress, ButtonPrimary, ButtonText, ButtonTextSmLineW } from '@components/shared/ButtonGlobal';
import {
  FormContainer,
  FormContainerFlex,
  FormDateAction,
  FormDateContainer,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText,
  TextAreaBox, TextBox
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatStringDate } from '../services/Utils';
import { Heading2w, Heading4Regularw, ShiftFromTop10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  BackHandler,
  Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { addChild, deleteChild,getNewChild } from '../services/childCRUD';
import { DateTime } from 'luxon';
import { dobMax } from '@types/types';
import {
  HeaderActionView,
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { regexpEmojiPresentation } from '@assets/translations/appOfflineData/apiConstants';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildProfileScreen'
>;

type Props = {
  route: any,
  navigation: ChildSetupNavigationProp;
};

const AddExpectingChildProfile = ({ route, navigation }: Props) => {
  let childData = route.params.childData;
  console.log(childData, "..childData..")
  const editScreen = childData && childData.uuid != '' ? true : false;
  console.log(editScreen, "..editScreen..")
  //const [dobDate, setdobDate] = useState();

  const [showdob, setdobShow] = useState(false);
  const ondobChange = (event:any,selectedDate: any) => {
    const currentDate = selectedDate || plannedTermDate;
    setdobShow(Platform.OS === 'ios');
    setPlannedTermDate(currentDate);
  };
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const [name, setName] = React.useState("");
  const { t } = useTranslation();
  const [plannedTermDate, setPlannedTermDate] = React.useState<Date | null>(null);
  const [isDobDatePickerVisible, setDobDatePickerVisibility] = useState(false);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const showdobDatepicker = () => {
    setdobShow(true);
    if(Platform.OS == 'ios'){
      setDobDatePickerVisibility(true);
    }
  };
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  const handleDobConfirm = (event:any) => {
    console.log("A date has been picked: ", event);
    const date=event;
    ondobChange(event,date);
    setDobDatePickerVisibility(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      if (childData?.uuid != '') {
        setName(childData?.childName?childData?.childName:'');
        setPlannedTermDate(childData?.birthDate != null ? new Date(childData?.birthDate) : null);
      }
    }, [])
  );
  useEffect(() => {
    const backAction = () => {
      console.log("11")
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
  
    return () => {
      backHandler.remove();
    }
  }, []);
  const AddChild = async () => {
    let insertData: any = editScreen ? await getNewChild(childData?.uuid, "true", null, '', plannedTermDate, name, '', '',childData?.createdAt) : await getNewChild('', "true", null, '', plannedTermDate, name, '', '',null);
    let childSet: Array<any> = [];
    childSet.push(insertData);
    console.log(childData,"..childData")
    addChild(languageCode, editScreen, 2, childSet, dispatch, navigation, child_age, null,null);
  }
  const deleteRecord = (index: number, dispatch: any, uuid: string) => {
    //console.log("..deleted..");
    // deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"');
    return new Promise((resolve, reject) => {
      Alert.alert(t('deleteChildTxt'), t('deleteWarnTxt'), [
        {
          text: t('removeOption1'),
          onPress: () => reject('error'),
          style: 'cancel',
        },
        {
          text: t('removeOption2'),
          onPress: () => {
            deleteChild(
              languageCode,
              index,
              dispatch,
              'ChildEntity',
              uuid,
              'uuid ="' + uuid + '"',
              resolve,
              reject,
              child_age,
              t
            );
            navigation.navigate('ChildProfileScreen');
          },
        },
      ]);
    });
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={{
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <HeaderIconView>
            <HeaderIconPress
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
          <Heading2w numberOfLines={1}>
              {childData && childData?.uuid != '' && childData?.uuid != null && childData?.uuid != undefined  ? t('editExpectChildAddTxt'):t('expectChildAddTxt')}
            </Heading2w>
          </HeaderTitleView>
          <HeaderActionView>
            {childList?.length > 1 && childData && childData?.uuid != '' ? (
              <ButtonDelPress
                onPress={() =>
                  deleteRecord(childData?.index, dispatch, childData?.uuid)
                }>
                <ButtonTextSmLineW>{t('growthScreendeletebtnText')}</ButtonTextSmLineW>
              </ButtonDelPress>
            ) : null}
          </HeaderActionView>
        </HeaderRowView>
        {/* <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View style={{ flex: 1, padding: 15 }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </Pressable>
          </View>
          <View style={{ flex: 9, padding: 7 }}>
          <HeaderRowView>
          <Heading2w numberOfLines={1}>
              {childData && childData?.uuid != '' && childData?.uuid != null && childData?.uuid != undefined  ? t('editExpectChildAddTxt'):t('expectChildAddTxt')}
            </Heading2w>
            <HeaderActionView>
            {childList?.length > 1 && childData && childData?.uuid != '' ? (
              <ButtonDelPress
                onPress={() =>
                  deleteRecord(childData?.index, dispatch, childData?.uuid)
                }>
                <ButtonTextSmLine>{t('growthScreendeletebtnText')}</ButtonTextSmLine>
              </ButtonDelPress>
            ) : null}
          </HeaderActionView>
        </HeaderRowView>
          </View>
        </View> */}
       

        <MainContainer>
          <FormDateContainer>
            <FormInputGroup onPress={showdobDatepicker}>
              <LabelText> {t('expectChildDueDateTxt')}</LabelText>
              <FormInputBox>
                <FormDateText>
                  {/* <Text> {plannedTermDate ? plannedTermDate.toDateString() : null}</Text> */}
                  <Text>  {plannedTermDate ? formatStringDate(plannedTermDate,luxonLocale) : t('expectChildDueDateTxt')}</Text>
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBox>
            </FormInputGroup>
          </FormDateContainer>

          <View>
            {showdob && (
              Platform.OS != 'ios' ? (
              <DateTimePicker
                testID="dobdatePicker"
                minimumDate={new Date(DateTime.local().plus({ days: 1 }).toISODate())}
                maximumDate={new Date(dobMax)}
                value={plannedTermDate!=null ? plannedTermDate : new Date()}
                mode={'date'}
                display="default"
                onChange={ondobChange}
              />
              ):
              <DateTimePickerModal
              isVisible={isDobDatePickerVisible}
              mode="date"
              onConfirm={handleDobConfirm}
              date={plannedTermDate!=null ? plannedTermDate : new Date()}
              onCancel={() => {
                // Alert.alert('Modal has been closed.');
                setDobDatePickerVisibility(false);
              }}
              minimumDate={new Date(DateTime.local().plus({ days: 1 }).toISODate())}
              maximumDate={new Date(dobMax)}
              />
            )}
          </View>

          <FormContainer>
            <LabelText>{t('expectPreferNametxt')}</LabelText>
            <FormInputBox>
              <TextInput
               style={{width:'100%'}}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={30}
                clearButtonMode="always"
                onChangeText={(value) => { 
                  // setName(value.replace(/\s/g, '')) 
                  if (value.replace(/\s/g,"")=="") {
                    console.log("..11value")
                    setName(value.replace(/\s/g, '')); 
                   } else {
                    console.log("..22value")
                    // if (/^[a-zA-Z ]*$/.test(value)) {
                    // setName(value);
                    // }
                    setName(value.replace(regexpEmojiPresentation, ''));
                   }
                }}
                // value={name.replace(/\s/g, '')}
                value={name}
                // onChangeText={queryText => handleSearch(queryText)}
                placeholder={t('expectPreferNamePlacetxt')}
                allowFontScaling={false} 
              />
            </FormInputBox>
          </FormContainer>

        </MainContainer>
        <ShiftFromTop10>
          <ButtonContainer>
            <ButtonPrimary
              disabled={plannedTermDate == null || plannedTermDate == undefined || name == null || name == undefined || name == "" ? true : false}
              onPress={() => {
                //navigation.navigate('ChildProfileScreen');
                // if(plannedTermDate==null || plannedTermDate==undefined){
                //   Alert.alert('Please enter due date');
                // }
                // else if(name==null || name==undefined || name==""){
                //   Alert.alert('Please enter name');
                // }
                //else{
                AddChild();
                // }
              }}>
              <ButtonText numberOfLines={2}>{childData && childData?.uuid != '' ? t('editProfileBtn') : t('growthScreensaveMeasures')}</ButtonText>
            </ButtonPrimary>
          </ButtonContainer>
        </ShiftFromTop10>
      </SafeAreaView>
    </>
  );
};

export default AddExpectingChildProfile;
const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#FFF',
    color: '#20232a',
    textAlign: 'left',
    fontSize: 30,
    fontWeight: 'bold',
  },
});