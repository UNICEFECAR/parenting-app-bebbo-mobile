import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonLinkPress, ButtonPrimary, ButtonRow, ButtonText,
  ButtonTextLinew
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildColArea1,
  ChildColArea2,
  ChildContentArea,
  ChildListAction,
  ChildListingArea,
  ChildListingBox,
  ChildListTitle,
  CustomScrollView,
  TitleLinkSm
} from '@components/shared/ChildSetupStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { ChildEntity } from '../database/schema/ChildDataSchema';
import { apiJsonDataGet, checkBetween, deleteChild, getAge, getAllChildren, getAllConfigData, getCurrentChildAgeInDays, isFutureDate } from '../services/childCRUD';
import { formatDate } from '../services/Utils';
import {
  Heading1Centerw,
  Heading3Centerw,
  Heading5,
  ShiftFromBottom20,
  ShiftFromTop30
} from '../styles/typography';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSiblingDataScreen'
>;
import analytics from '@react-native-firebase/analytics';
import { ONBOARDING_CHILD_COUNT } from '@assets/data/firebaseEvents';
type Props = {
  navigation: ChildSetupNavigationProp;
};


const ChildSetupList = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const genders = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender:[],
  );
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch,child_age);
      getAllConfigData(dispatch);
    },[])
  );
  
  useFocusEffect(
    React.useCallback(() => {
      navigation.dispatch(state => {
        // Remove the home route from the stack
        const routes = state.routes.filter(r => r.name !== 'LoadingScreen');
      
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
    },[])
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const childList = useAppSelector(
    (state: any) => state.childData.childDataSet.allChild != '' ? JSON.parse(state.childData.childDataSet.allChild) : [],
  );
  console.log(childList,"..childList..")
  const activeChild = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild)
    : [],
  );
  console.log(activeChild,"..activeChild..");
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
   const renderDailyReadItem =(dispatch:any,data: ChildEntity, index: number,gender:any) => {
       
     return (
    <ChildListingBox key={index}>
    <ChildColArea1>
      <ChildListTitle>{data.childName}{(gender!='' && gender!=0 && gender!=undefined)?<Text style={{fontSize:12,fontWeight:'normal'}}>, {gender}</Text>:null}</ChildListTitle>
      <Heading5>{(data.birthDate != null && data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn',{childdob:data.birthDate!=null  ? formatDate(data.birthDate,luxonLocale):''}):t('expectedChildDobLabel')}</Heading5>
    </ChildColArea1>
    <ChildColArea2>
    
    {
          childList.length> 1 ? (
            <ChildListAction>
            <TitleLinkSm numberOfLines={2} onPress={() => deleteRecord(index,dispatch,data.uuid)}>{t('growthScreendelText')}</TitleLinkSm>
            </ChildListAction>
            ) :null
          }
          <ChildListAction>
      <TitleLinkSm numberOfLines={2} onPress={() => editRecord(data)}>{t('editProfileBtn')}</TitleLinkSm>
      </ChildListAction>
    </ChildColArea2>
  </ChildListingBox>
     );
    };
   const deleteRecord = (index:number,dispatch:any,uuid: string) => {
    //console.log("..deleted..");
    // deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"');
    return new Promise((resolve, reject) => {
      Alert.alert(t('deleteChildTxt'), t('deleteWarnTxt'),
        [
          {
            text: t('removeOption1'),
            onPress: () => reject("error"),
            style: "cancel"
          },
          { text: t('growthScreendelText'), onPress: () => {
            deleteChild(languageCode,index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"',resolve,reject,child_age,t);
          }
          }
        ]
      );
    });
   
  }
  const editRecord = (data:any) => {
    navigation.navigate('AddSiblingDataScreen',{headerTitle:t('childSetupListeditSiblingBtn'),childData:data});
  }
  // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];

 
  const child_age = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
  );
  
  const childSetup = async () => {
    // if(netInfo.isConnected){
      
    const Ages=await getAge(childList,child_age);
    console.log(Ages,"..Ages..")
    let apiJsonData;
    if(Ages?.length>0){
      console.log(Ages,"..11Ages..")
      apiJsonData=apiJsonDataGet(String(Ages),"all")
    }
    else{
      apiJsonData=apiJsonDataGet("all","all")
    }
     analytics().logEvent(ONBOARDING_CHILD_COUNT, {child_count: childList?.length})
    // await analytics().setUserProperties({ageid,is_premature,child_gender,relationship_with_child}) relationship_with_child:monther/father

    console.log(apiJsonData,"..apiJsonData...")
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoadingScreen',
          params: { apiJsonData: apiJsonData, prevPage: 'ChilSetup' },
        },
      ],
    });
    // navigation.navigate('HomeDrawerNavigator')
  };
  // else{
  //   Alert.alert("No Internet Connection.")
  // }
 
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
     <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <OnboardingContainer>
        <OnboardingHeading>
          <ChildCenterView>
            <Heading1Centerw>
              {t('childSetupListheader')}
            </Heading1Centerw>
            <ShiftFromTop30>
            <Heading3Centerw>
              {t('childSetupListsubHeader')}
            </Heading3Centerw>
            </ShiftFromTop30>
          </ChildCenterView>
        </OnboardingHeading>
        <ChildContentArea>
         {/* <ScrollView> */}
          <ChildListingArea>
          <CustomScrollView>
            {
              childList.length> 0 ? (
              childList.map((item: ChildEntity, index: number) => {
                const genderLocal=(genders?.length>0 && item.gender!="")? genders.find(genderset => genderset.id == parseInt(item.gender)).name:'';
                console.log(genderLocal,"..genderLocal..")
               return renderDailyReadItem(dispatch,item,index,genderLocal);
              })
            ) :
            <ChildListingBox>
            <ChildColArea1>
              <Text>{t('noChildsTxt')}</Text></ChildColArea1>
            </ChildListingBox>
            }
          </CustomScrollView>
          </ChildListingArea>
          {/* </ScrollView> */}
        </ChildContentArea>

        <ButtonRow>
          
          <ShiftFromBottom20>
            <ButtonLinkPress
              onPress={() => navigation.navigate('AddSiblingDataScreen',{headerTitle:t('childSetupListaddSiblingBtn'),childData:null})}>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_plus" size={20} color="#FFF" />
                </OuterIconLeft>
                <ButtonTextLinew numberOfLines={2}> {t('childSetupListaddSiblingBtn')}</ButtonTextLinew>
              </OuterIconRow>
            </ButtonLinkPress>
          </ShiftFromBottom20>
         
          <ButtonPrimary
            onPress={(e) => {
              e.stopPropagation();
              childSetup();
            }}>
            <ButtonText numberOfLines={2}>{t('childSetupListcontinueBtnText')}</ButtonText>
          </ButtonPrimary>
   
        </ButtonRow>
      </OnboardingContainer>
      </SafeAreaView>
    </>
  );
};

export default ChildSetupList;
