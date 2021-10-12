
import { both_child_gender } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonRow, ButtonText } from '@components/shared/ButtonGlobal';
import { ChildAddTop, FormContainer, FormContainerFlex, LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { dobMax } from '@types/types';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { addChild, getNewChild } from '../services/childCRUD';
import { validateForm } from '../services/Utils';
import { Heading1Centerw, ShiftFromTop5 } from '../styles/typography';
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
  const name= childData != null ? childData.childName:'';
  const relationship= childData != null ? childData.relationship:'';
  const editScreen = childData != null ? true : false;
  const child_age = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
     );
  // console.log(childData,"..childData..");
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
  console.log(genders,"..genders..");
  let initialData: any = {};
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected,setIsExpected] = useState<string>('false');
  const sendData = (data: any) => { // the callback. Use a better name
    //console.log(data,"..data..")
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  const isFutureDate = (date: Date) => {
    return new Date(date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
  };
  useFocusEffect(
    React.useCallback(() => {
    if(childData!=null && childData.uuid!=''){
      sendData(childData);
    }
    }, [])
  );
  const AddChild=async ()=>{
    let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let newNameIndex:any=0;
    let defaultName:any="";
    if(allJsonDatanew.length>0){
      console.log(allJsonDatanew[allJsonDatanew.length-1].childName,"..allJsonDatanew[allJsonDatanew.length-1].childName")
       newNameIndex=allJsonDatanew[allJsonDatanew.length-1].childName.split(t('defaultChildPrefix')).pop();
       defaultName=t('defaultChildPrefix')+(parseInt(newNameIndex)+1);
    }
    console.log(defaultName,"..defaultName",editScreen);
    let insertData: any = editScreen ? await getNewChild(uuid,isExpected, plannedTermDate, isPremature,birthDate,name,'',gender,createdAt) : await getNewChild('',isExpected, plannedTermDate, isPremature,birthDate,defaultName,'',gender,createdAt)
    let childSet: Array<any> = [];
    childSet.push(insertData);
    console.log(insertData,"..insertData");
    addChild(languageCode,editScreen, 1, childSet, dispatch, navigation,child_age,null,null);
}
const [gender, setGender] = React.useState(
  childData != null ? childData.gender : 0,
);
const getDefaultgenderValue = () => {
  return childData?.uuid != ''
    ? genders.find((item) => item.id == childData?.gender)
    : {title: ''};
};
const getCheckedItem = (checkedItem: typeof genders[0]) => {
  setGender(checkedItem.id);
};
const themeContext = useContext(ThemeContext);
const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
      <SafeAreaView style={{flex:1}}>
  
     <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
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
          {
          birthDate!=null && birthDate!=undefined && !isFutureDate(birthDate)?
          <FormContainer>
          <LabelText>{t('genderLabel')}</LabelText>
          <FormContainerFlex>
                <ToggleRadios
                  options={genders}
                  defaultValue={getDefaultgenderValue()}
                  tickbgColor={headerColor}
                  tickColor={'#FFF'}
                  getCheckedItem={getCheckedItem}
                />
         </FormContainerFlex>
         </FormContainer>
         :null}
        </View>

        <ButtonRow>
          <ButtonPrimary
           disabled={birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ? !validateForm(2, birthDate, isPremature, relationship, plannedTermDate, null, gender) : !validateForm(4, birthDate, isPremature, relationship, plannedTermDate, null, gender)}
             
            // disabled={!validateForm(2,birthDate,isPremature,relationship,plannedTermDate,null,gender)}
            onPress={() => {
              // navigation.reset({
              //   index: 0,
              //   routes: [{name: 'HomeDrawerNavigator'}],
              // })
              // console.log(birthDate,"..birthDate..");
              // console.log(isPremature,"..isPremature..");
              // console.log(plannedTermDate,"..plannedTermDate..");
              // console.log(isExpected,"..isExpected..");
              let validated:any=false;
              if(birthDate != null && birthDate != undefined && !isFutureDate(birthDate)){
                validated=validateForm(2,birthDate,isPremature,relationship,plannedTermDate,null,gender);
              }
              else if(birthDate != null && birthDate != undefined && isFutureDate(birthDate)){
                validated=validateForm(4,birthDate,isPremature,relationship,plannedTermDate,null,gender);
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
      </OnboardingContainer>
    </SafeAreaView>
    </>
  );
};

export default AddSiblingData;
