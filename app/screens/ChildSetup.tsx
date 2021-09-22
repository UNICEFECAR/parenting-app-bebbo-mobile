import { both_child_gender, both_parent_gender, femaleData, maleData, relationShipFatherId, relationShipMotherId } from '@assets/translations/appOfflineData/apiConstants';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonPrimary, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildContentArea, ChildRelationList, ChildSection, FormContainer,FormContainer1, FormContainerFlex, FormDateAction, FormDateText, FormInputBox, FormInputGroup, LabelText, TextBox
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { dobMax } from '@types/types';
import { Settings } from 'luxon';
import React, { createRef, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View,ScrollView } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { addChild, getNewChild, isFutureDate } from '../services/childCRUD';
import { validateForm } from '../services/Utils';
import {
  Heading1Centerw,
  Heading3,
  ShiftFromTop30,
  ShiftFromTop20,
  SideSpacing25
} from '../styles/typography';
// import { ChildEntity } from '../database/schema/ChildDataSchema';


type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetupList'
>;

type Props = {
  navigation: ChildSetupNavigationProp,
};
const ChildSetup = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [relationship, setRelationship] = useState('');
  const [userRelationToParent, setUserRelationToParent] = useState();
  const [relationshipname, setRelationshipName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected, setIsExpected] = useState<string>('false');
  // const relationshipData = ['Father', 'Mother', 'Other'];
  let relationshipData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).parent_gender,
  );
  const relationship_to_parent = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).relationship_to_parent,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const actionSheetRef = createRef<any>();
  const actionSheetRef1 = createRef<any>();
  const [gender, setGender] = React.useState(0);
  const dispatch = useAppDispatch();
  let initialData: any = {};
  const sendData = (data: any) => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  let genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );

  genders = genders.map((v) => ({ ...v, title: v.name })).filter(function (e, i, a) {
    return e.id!=both_child_gender;
  });
  relationshipData= relationshipData.map((v) => ({ ...v, title: v.name })).filter(function (e, i, a) {
    return e.id!=both_parent_gender;
  });
  console.log(genders, "..genders..");
  //console.log(childData?.gender,"..childData?.gender..");
  useFocusEffect(
    React.useCallback(() => {
    // const fetchData = async () => {  
    // }
    // fetchData();
}, [])
);
  useFocusEffect(
    React.useCallback(() => {
      navigation.dispatch(state => {
        // 
        // Remove the home route from the stack
        const routes = state.routes.filter(r => r.name !== 'LoadingScreen');

        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    }, [])
  );
  const getCheckedItem = (checkedItem: typeof genders[0]) => {
    //console.log(checkedItem);
    // if (
    //   typeof checkedItem.id === 'string' ||
    //   checkedItem.id instanceof String
    // ) {
    //   setGender(checkedItem.id);
    // } else {
    //   setGender(String(checkedItem.id));
    // }
    setGender(checkedItem.id);
  };
  const getCheckedParentItem = (checkedItem:any) => {
    console.log(checkedItem,"..checkedItem");
    if (
      typeof checkedItem.id === 'string' ||
      checkedItem.id instanceof String
    ) {
      setRelationship(checkedItem.id);
    } else {
      setRelationship(String(checkedItem.id));
    }
  };
  const AddChild = async () => {
    let allJsonDatanew = await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    let defaultName = t('defaultChildPrefix') + (allJsonDatanew?.length + 1);
    let insertData: any = await getNewChild('', isExpected, plannedTermDate, isPremature, birthDate, defaultName, '', gender,null);
    let childSet: Array<any> = [];
    childSet.push(insertData);
    console.log(childSet, "..childSet..");
    addChild(languageCode, false, 0, childSet, dispatch, navigation, child_age, relationship,userRelationToParent);
  }

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView contentContainerStyle={{padding:0, paddingTop: 0}}>
        <OnboardingContainer>
          <OnboardingHeading>
            <ChildCenterView>
              <Heading1Centerw>
                {t('childSetupheader')}
              </Heading1Centerw>
            </ChildCenterView>
          </OnboardingHeading>

          <ChildContentArea>
            <ChildSection>
              <ChildDate sendData={sendData} dobMax={dobMax} prevScreen="Onboarding"/>
              {
                birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ?
                  <FormContainer1>
                    <LabelText>{t('genderLabel')}</LabelText>
                      <ToggleRadios
                        options={genders}
                        tickbgColor={headerColor}
                        tickColor={'#FFF'}
                        getCheckedItem={getCheckedItem}
                      />
                  </FormContainer1>
                  : null
              }
              <ShiftFromTop20>
              <FormInputGroup
                onPress={() => {
                  actionSheetRef.current?.setModalVisible();
                }}>
                <LabelText>{t('childSetuprelationSelectTitle')}</LabelText>
                <FormInputBox>
                  <FormDateText>
                    <Text>{relationshipname ? relationshipname : t('childSetuprelationSelectText')}</Text>
                  </FormDateText>
                  <FormDateAction>
                    <Icon name="ic_angle_down" size={10} color="#000" />
                  </FormDateAction>
                </FormInputBox>
              </FormInputGroup>
              </ShiftFromTop20>
              <View>
           {
                userRelationToParent!=null && userRelationToParent!=undefined && userRelationToParent != relationShipMotherId && userRelationToParent != relationShipFatherId ?
                  <FormContainer1>
                    <LabelText>{t('parentGender')}</LabelText>
                      <ToggleRadios
                        options={relationshipData}
                        tickbgColor={headerColor}
                        tickColor={'#FFF'}
                        getCheckedItem={getCheckedParentItem}
                      />
                  </FormContainer1>
                  : null
          }
          </View>
            </ChildSection>
          </ChildContentArea>
          </OnboardingContainer>
          
          </ScrollView>
          <ActionSheet ref={actionSheetRef}>

            <View>
              {/* {relationshipData.map((item, index) => {
                return (
                  <ChildRelationList key={index}>
                    <Pressable
                      onPress={() => {
                        if (typeof item.id === 'string' || item.id instanceof String) {
                          setRelationship(item.id);
                        }
                        else {
                          setRelationship(String(item.id));
                        }
                        setRelationshipName(item.name);
                        actionSheetRef.current?.hide();
                      }}>
                      <Heading3>{item.name}</Heading3>
                    </Pressable>
                  </ChildRelationList>
                );
              })} */}
               {relationship_to_parent.map((item, index) => {
                return (
                  <ChildRelationList key={index}>
                    <Pressable
                      onPress={() => {
                        console.log(item,"..item..");  
                        setUserRelationToParent(item.id);
                        console.log(userRelationToParent,"..userRelationToParent..");  
                        if(item.id == relationShipMotherId){
                          if (typeof femaleData.id === 'string' || femaleData.id instanceof String) {
                            setRelationship(femaleData.id);
                          }
                          else {
                            setRelationship(String(femaleData.id));
                          }
                        }
                        else if(item.id == relationShipFatherId){
                          if (typeof maleData.id === 'string' || maleData.id instanceof String) {
                            setRelationship(maleData.id);
                          }
                          else {
                            setRelationship(String(maleData.id));
                          }
                        }
                        else{
                          setRelationship('');
                        }
                        setRelationshipName(item.name);
                        actionSheetRef.current?.hide();
                      }}>
                      <Heading3>{item.name}</Heading3>
                    </Pressable>
                  </ChildRelationList>
                );
              })}
            
            </View>
          </ActionSheet>
         
          <SideSpacing25>
          <ButtonRow>
            <ButtonPrimary
              disabled={birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ? !validateForm(0, birthDate, isPremature, relationship, plannedTermDate, null, gender) : !validateForm(3, birthDate, isPremature, relationship, plannedTermDate, null, gender)}
              onPress={(e) => {
                e.stopPropagation();
                // console.log(birthDate,"..birthDate..");
                // console.log(isPremature,"..isPremature..");
                // console.log(plannedTermDate,"..plannedTermDate..");
                // console.log(isExpected,"..isExpected..");
                // AddChild();
                // console.log(birthDate,"..birthDate..");
                let validated: any = false;
                if (birthDate != null && birthDate != undefined && !isFutureDate(birthDate)) {
                  validated = validateForm(0, birthDate, isPremature, relationship, plannedTermDate, null, gender);
                }
                else if (birthDate != null && birthDate != undefined && isFutureDate(birthDate)) {
                  validated = validateForm(3, birthDate, isPremature, relationship, plannedTermDate, null, gender);
                }
                console.log(validated, "..validated..");
                if (validated == true) {
                  AddChild();
                }
                else {
                  //  Alert.alert(validated);
                }

              }}>
              <ButtonText>{t('childSetupcontinueBtnText')}</ButtonText>
            </ButtonPrimary>
          </ButtonRow>
          </SideSpacing25>
      </SafeAreaView>
    </>
  );
};

export default ChildSetup;
