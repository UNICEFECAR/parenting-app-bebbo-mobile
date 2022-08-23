
import { both_child_gender, regexpEmojiPresentation } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonRow, ButtonText } from '@components/shared/ButtonGlobal';
import { ChildAddTop, FormContainer1, FormInputBox, LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import TextInputML from '@components/shared/TextInputML';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { dobMax } from '@types/types';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { addChild, getNewChild } from '../services/childCRUD';
import { validateForm } from '../services/Utils';
import { Heading1Centerw, ShiftFromTop5, SideSpacing25 } from '../styles/typography';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeDrawerNavigator'
>;

type Props = {
  route: any;
  navigation: ChildSetupNavigationProp;
};

const AddSiblingData = ({ route, navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { headerTitle } = route.params;
  const { childData } = route.params;
  const uuid= childData != null ? childData.uuid:'';
  const createdAt = childData != null ? childData.createdAt:null;
  const relationship= childData != null ? childData.relationship:'';
  const editScreen = childData != null ? true : false;
  const child_age = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
     );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  let genders = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender:[],
  );
  
  genders = genders.map((v) => ({...v, title: v.name})).filter(function (e, i, a) {
    return e.id!=both_child_gender;
  });
  let initialData: any = {};
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected,setIsExpected] = useState<string>('false');
  const [defaultGenderValue, setDefaultGenderValue] = useState<any>(null);
  const sendData = (data: any) => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  const isFutureDate = (date: Date) => {
    return new Date(date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
  };
  const [name, setName] = React.useState('');
  useFocusEffect(
    React.useCallback(() => {
    if(childData!=null && childData.uuid!=''){
      sendData(childData);
      setName(childData.childName);
    }
    setDefaultGenderValue(childData && childData.uuid? genders.find((item) => item.id == childData?.gender): {title: ''})
    }, [])
  );
  const AddChild=async ()=>{
    let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let newNameIndex:any=0;
    let defaultName =name;
    let insertData: any = editScreen ? await getNewChild(uuid,isExpected, plannedTermDate, isPremature,birthDate,name,'',gender,createdAt) : await getNewChild('',isExpected, plannedTermDate, isPremature,birthDate,defaultName,'',gender,createdAt)
    let childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(languageCode,editScreen, 1, childSet, dispatch, navigation,child_age,null,null);
}
const [gender, setGender] = React.useState(
  childData != null ? childData.gender : 0,
);
const getCheckedItem = (checkedItem: typeof genders[0]) => {
  setGender(checkedItem.id);
};
const themeContext = useContext(ThemeContext);
const headerColor = themeContext.colors.PRIMARY_COLOR;
  return <>
    <View style={{flex:1,backgroundColor:headerColor}}>

   <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
   <ScrollView contentContainerStyle={{ padding: 0, paddingTop: 0 }}>
    <OnboardingContainer>
      <View>
        <OnboardingHeading>
          <ChildAddTop>
            <Heading1Centerw>{headerTitle}</Heading1Centerw>
            <ShiftFromTop5>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="ic_close" size={20} color="#FFF" />
              </Pressable>
            </ShiftFromTop5>
          </ChildAddTop>
        </OnboardingHeading>
        <ChildDate sendData={sendData} childData={childData} dobMax={dobMax} prevScreen="Onboarding"/>
        <ShiftFromTop5>
                <LabelText>{t('childNameTxt')}</LabelText>
                <FormInputBox>
                  <TextInputML
                    style={{ width: '100%' }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={30}
                    clearButtonMode="always"
                    onChangeText={(value) => {
                      if (value.replace(/\s/g, "") == "") {
                        setName(value.replace(/\s/g, ''));
                      } else {
                        setName(value.replace(regexpEmojiPresentation, ''));
                      }
                    }}
                    value={name}
                    placeholder={t('childNamePlaceTxt')}
                    placeholderTextColor={"gray"}
                    allowFontScaling={false}
                  />
                </FormInputBox>
              </ShiftFromTop5>
        {
        birthDate!=null && birthDate!=undefined && !isFutureDate(birthDate)?
        <FormContainer1>
        <LabelText>{t('genderLabel')}</LabelText>
              <ToggleRadios
                options={genders}
                defaultValue={defaultGenderValue}
                tickbgColor={headerColor}
                tickColor={'#FFF'}
                getCheckedItem={getCheckedItem}
              />
       </FormContainer1>
       :null}
      </View>

    
    </OnboardingContainer>
    </ScrollView>
    <SideSpacing25>
    <ButtonRow>
        <ButtonPrimary
         disabled={birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ? !validateForm(2, birthDate, isPremature, relationship, plannedTermDate, name, gender) : !validateForm(4, birthDate, isPremature, relationship, plannedTermDate, name, gender)}
          onPress={() => {
            let validated:any=false;
            if(birthDate != null && birthDate != undefined && !isFutureDate(birthDate)){
              validated=validateForm(2,birthDate,isPremature,relationship,plannedTermDate,name,gender);
            }
            else if(birthDate != null && birthDate != undefined && isFutureDate(birthDate)){
              validated=validateForm(4,birthDate,isPremature,relationship,plannedTermDate,name,gender);
            }
            if(validated==true){
             AddChild();
            }
            else{
              //Alert.alert(validated);
            }
            
          
          }}>
          <ButtonText numberOfLines={2}>{t('childSetupListsaveBtnText')}</ButtonText>
        </ButtonPrimary>
      </ButtonRow>
      </SideSpacing25>
  </View>
  </>;
};

export default AddSiblingData;
