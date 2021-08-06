import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonContainer, ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
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
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { addChild, deleteChild, getAllChildren, getAllConfigData, getNewChild } from '../services/childCRUD';
import { DateTime } from 'luxon';
import { dobMax } from '@types/types';
import { HeaderActionView, HeaderRowView } from '@components/shared/HeaderContainerStyle';


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
  //console.log(childData, "..childData..")
  const editScreen = childData?.uuid != '' ? true : false;
  console.log(editScreen, "..editScreen..")
  //const [dobDate, setdobDate] = useState();

  const [showdob, setdobShow] = useState(false);
  const ondobChange = (event: any, selectedDate: any) => {
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
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const showdobDatepicker = () => {
    setdobShow(true);
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
  useFocusEffect(
    React.useCallback(() => {
      //getAllChildren(dispatch);
      getAllConfigData(dispatch);
      if (childData?.uuid != '') {
        setName(childData?.childName?childData?.childName:'');
        setPlannedTermDate(childData?.birthDate != null ? new Date(childData?.birthDate) : null);
      }
    }, [])
  );
  const AddChild = async () => {
    let insertData: any = editScreen ? await getNewChild(childData?.uuid, "true", null, '', plannedTermDate, name, '', '') : await getNewChild('', "true", null, '', plannedTermDate, name, '', '');
    let childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(languageCode, editScreen, 2, childSet, dispatch, navigation, child_age, null);
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
        <View
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
              <Heading4Regularw
                onPress={() =>
                  deleteRecord(childData?.index, dispatch, childData?.uuid)
                }>
                {t('growthScreendeletebtnText')}
              </Heading4Regularw>
            ) : null}
          </HeaderActionView>
        </HeaderRowView>
          </View>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
            borderBottomColor: 'gray',
            borderBottomWidth: 2,
          }}>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Text>Back</Text>
            </Pressable>
          </View>
          <View style={{ flex: 3 }}>
            <Text> {'Add Expecting Child Details'}</Text>
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
              <DateTimePicker
                testID="dobdatePicker"
                minimumDate={new Date(DateTime.local().plus({ days: 1 }).toISODate())}
                maximumDate={new Date(dobMax)}
                value={plannedTermDate!=null ? plannedTermDate : new Date()}
                mode={'date'}
                display="default"
                onChange={ondobChange}
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
                onChangeText={(value) => { setName(value.replace(/\s/g, '')) }}
                value={name.replace(/\s/g, '')}
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
              <ButtonText>{childData && childData?.uuid != '' ? t('editProfileBtn') : t('growthScreensaveMeasures')}</ButtonText>
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