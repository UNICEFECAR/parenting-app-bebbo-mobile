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
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { ChildEntity } from '../database/schema/ChildDataSchema';
import { between, checkBetween, deleteChild, getAllChildren, getAllConfigData, getCurrentChild, getCurrentChildAgeInDays } from '../services/childCRUD';
import { formatDate } from '../services/Utils';
import {
  Heading1Centerw,
  Heading3Centerw,
  ShiftFromBottom20,
  ShiftFromTop30
} from '../styles/typography';
import { appConfig } from '../types/apiConstants';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSiblingDataScreen'
>;
type Props = {
  navigation: ChildSetupNavigationProp;
};


const ChildSetupList = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);
    },[])
  );

  const childList = useAppSelector(
    (state: any) => state.childData.childDataSet.allChild != '' ? JSON.parse(state.childData.childDataSet.allChild) : [],
  );

   const renderDailyReadItem =(dispatch:any,data: ChildEntity, index: number) => {
       
     return (
    <ChildListingBox key={index}>
    <ChildColArea1>
      <ChildListTitle>{data.childName}</ChildListTitle>
      <Text>Born on {data.birthDate!=null  ? formatDate(data.birthDate):''}</Text>
    </ChildColArea1>
    <ChildColArea2>
    {
          childList.length> 1 ? (
            <TitleLinkSm onPress={() => deleteRecord(index,dispatch,data.uuid)}>Delete</TitleLinkSm>
            ) :null
          }
      <TitleLinkSm onPress={() => editRecord(data)}>Edit Profile</TitleLinkSm>
    </ChildColArea2>
  </ChildListingBox>
     );
    };
   const deleteRecord = (index:number,dispatch:any,uuid: string) => {
    //console.log("..deleted..");
    // deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"');
    return new Promise((resolve, reject) => {
      Alert.alert('Delete Child', "Do you want to delete child?",
        [
          {
            text: "Cancel",
            onPress: () => reject("error"),
            style: "cancel"
          },
          { text: "Delete", onPress: () => {
            deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"',resolve,reject,child_age);
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
  
  let apiJsonData = [
    {
      apiEndpoint: appConfig.articles,
      method: 'get',
      postdata: {
        // childAge: 'all',
        childGender: 'all',
        childAge: '43',
        // childGender: '40',
        parentGender: 'all',
        Seasons: 'all',
      },
      saveinDB: true,
    },
    // {
    //   apiEndpoint: appConfig.taxonomies,
    //   method: 'get',
    //   postdata: {},
    //   saveinDB: true,
    // },
    // {apiEndpoint:appConfig.basicPages,method:'get',postdata:{},saveinDB:true}
  ];
 
  const child_age = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age,
  );
  const getAge=()=>{
    let ageData:any=[];
    if(childList.length> 0){
    var promises = childList.map((item:any)=>{
      if(item.birthDate!=null && item.birthDate!=undefined && item.birthDate!=""){
      return getCurrentChildAgeInDays(DateTime.fromJSDate(new Date(item.birthDate)).toMillis());   
      }  
    })
    return Promise.all(promises).then(async (results:any)=>{
        const data=await checkBetween(0,results,child_age); 
        return data;
    })
  }
  }
  const childSetup = async () => {
    // if(netInfo.isConnected){
    const Ages=await getAge();
    if(Ages?.length>0){
    apiJsonData[0].postdata.childAge=String(Ages);  
    }
    else{
    apiJsonData[0].postdata.childAge='all';
    }
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
               return renderDailyReadItem(dispatch,item,index);
              })
            ) :
            <ChildListingBox>
            <ChildColArea1>
              <Text>No Data</Text></ChildColArea1>
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
                <ButtonTextLinew> {t('childSetupListaddSiblingBtn')}</ButtonTextLinew>
              </OuterIconRow>
            </ButtonLinkPress>
          </ShiftFromBottom20>
         
          <ButtonPrimary
            onPress={() => {
              
              childSetup();
            }}>
            <ButtonText>{t('childSetupListcontinueBtnText')}</ButtonText>
          </ButtonPrimary>
   
        </ButtonRow>
      </OnboardingContainer>
      </SafeAreaView>
    </>
  );
};

export default ChildSetupList;
