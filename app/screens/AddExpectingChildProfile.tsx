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
    TextAreaBox,TextBox
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatStringDate } from '../services/Utils';
import { Heading2w, ShiftFromTop10 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { addChild, getAllChildren, getAllConfigData, getNewChild } from '../services/childCRUD';
import { DateTime } from 'luxon';
import { dobMax } from '@types/types';


type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildProfileScreen'
>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddExpectingChildProfile = ({ navigation }: Props) => {
  //const [dobDate, setdobDate] = useState();
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
    },[])
  );
  const [showdob, setdobShow] = useState(false);
  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || plannedTermDate;
    setdobShow(Platform.OS === 'ios');
    setPlannedTermDate(currentDate);
  };
  const child_age = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
     );
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const [name, setName] = React.useState("");
  const {t} = useTranslation();
  const [plannedTermDate, setPlannedTermDate] = React.useState<Date>();
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const showdobDatepicker = () => {
    setdobShow(true);
  };
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const AddChild = async () => {
    let insertData: any =await getNewChild( '',"true", null, '',plannedTermDate,name, '', '');
    let childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(languageCode,false, 2, childSet, dispatch, navigation,child_age,null);
  }
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
            <View style={{flex: 1, padding: 15}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#FFF" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 9, padding: 7}}>
              <Heading2w>
                {t('expectChildAddTxt')}
              </Heading2w>
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
                  <Text>  {plannedTermDate ? formatStringDate(plannedTermDate) : t('expectChildDueDateTxt')}</Text>
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
                minimumDate={ new Date(DateTime.local().toISODate())}
                maximumDate={ new Date(dobMax)}  
                value={new Date()}
                mode={'date'}
                display="default"
                onChange={ondobChange}
              />
            )}
          </View>

          <FormContainer>
            <LabelText>{t('expectPreferNametxt')}</LabelText>
            <TextBox>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
              clearButtonMode="always"
              onChangeText={(value) => { setName(value.replace(/\s/g, '')) }}
              value={name.replace(/\s/g, '')}
              // onChangeText={queryText => handleSearch(queryText)}
              placeholder={t('expectPreferNamePlacetxt')}
              
            />
            </TextBox>
          </FormContainer>
          
        </MainContainer>
        <ShiftFromTop10>
        <ButtonContainer>
            <ButtonPrimary
            disabled={plannedTermDate==null || plannedTermDate==undefined || name==null || name==undefined || name=="" ? true :false}
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
              <ButtonText>{t('growthScreensaveMeasures')}</ButtonText>
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
