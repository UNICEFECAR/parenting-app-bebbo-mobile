import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import {
    FormDateAction,
    FormDateContainer,
    FormDateText,
    FormInputBox,
    FormInputGroup,
    LabelText
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View
} from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { addChild, getAllChildren, getAllConfigData, getNewChild } from '../services/childCRUD';


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
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age,
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
  const AddChild = async () => {
    let insertData: any =await getNewChild( '',"true", plannedTermDate, '',null, '',name, '', '');
    let childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(false, 2, childSet, dispatch, navigation,child_age);
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

        <View style={{ margin: 10 }}>
          <FormDateContainer>
            <FormInputGroup onPress={showdobDatepicker}>
              <LabelText> {t('expectChildDueDateTxt')}</LabelText>
              <FormInputBox>
                <FormDateText>
                  <Text> {plannedTermDate ? plannedTermDate.toDateString() : null}</Text>
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
                value={new Date()}
                mode={'date'}
                display="default"
                onChange={ondobChange}
              />
            )}
          </View>

          <View>
            <LabelText>{t('expectPreferNametxt')}</LabelText>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
              clearButtonMode="always"
              onChangeText={(value) => { setName(value) }}
              value={name}
              // onChangeText={queryText => handleSearch(queryText)}
              placeholder={t('expectPreferNamePlacetxt')}
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 20,
                paddingVertical: 20,
              }}
            />
          </View>
          <View style={{ width: '100%', marginTop: 30 }}>
            <ButtonPrimary
              onPress={() => {
                //navigation.navigate('ChildProfileScreen');
                if(plannedTermDate==null || plannedTermDate==undefined){
                  Alert.alert('Please enter due date');
                }
                else if(name==null || name==undefined || name==""){
                  Alert.alert('Please enter name');
                }
                else{
                AddChild();
                }
              }}>
              <ButtonText>{t('growthScreensaveMeasures')}</ButtonText>
            </ButtonPrimary>
          </View>
        </View>
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
