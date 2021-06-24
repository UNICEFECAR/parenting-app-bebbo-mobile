import {
  ButtonLinkText,
  ButtonPrimary,
  ButtonRow,
  ButtonText,
  ButtonTextLinew,
  ButtonLinkView
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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAppDispatch, useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ChildEntity } from '../database/schema/ChildDataSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { deleteChild, getAllChildren, getAllConfigData } from '../services/childCRUD';
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
    (state: any) => state.childData.childDataSet.allChild != '' ? JSON.parse(state.childData.childDataSet.allChild) : state.childData.childDataSet.allChild,
  );
  const setActiveChild=async (uuid:any)=>{
    let currentActiveChildId = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "currentActiveChildId",uuid);
  }
   const renderDailyReadItem = (dispatch:any,data: ChildEntity, index: number) => {
     return (
       <TouchableOpacity
       onPress={() => setActiveChild(data.uuid)}
     >
    <ChildListingBox key={index}>
    <ChildColArea1>
      <ChildListTitle>{data.name ? data.name : 'Child' + (index+1)}</ChildListTitle>
      <Text>Born on {String(data.birthDate)}</Text>
    </ChildColArea1>
    <ChildColArea2>
      <TitleLinkSm onPress={() => deleteRecord(index,dispatch,data.uuid)}>Delete</TitleLinkSm>
      <TitleLinkSm onPress={() => editRecord(data)}>Edit Profile</TitleLinkSm>
    </ChildColArea2>
  </ChildListingBox>
  </TouchableOpacity>
     );
    };
   const deleteRecord = (index:number,dispatch:any,uuid: string) => {
    //console.log("..deleted..");
    deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"');
    // return new Promise((resolve, reject) => {
    //   Alert.alert('Delete Child', "Do you want to delete child?",
    //     [
    //       {
    //         text: "Cancel",
    //         onPress: () => reject("error"),
    //         style: "cancel"
    //       },
    //       { text: "Delete", onPress: () => {
    //         deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"',resolve,reject);
    //       }
    //       }
    //     ]
    //   );
    // });
   
  }
  const editRecord = (data:any) => {
    navigation.navigate('AddSiblingDataScreen',{headerTitle:t('childSetupList.editSiblingBtn'),childData:data});
  }
  // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
  const apiJsonData = [
    {
      apiEndpoint: appConfig.articles,
      method: 'get',
      postdata: {
        childAge: 'all',
        childGender: 'all',
        // childAge: '43',
        // childGender: '40',
        parentGender: 'all',
        Seasons: 'all',
      },
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.taxonomies,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    // {apiEndpoint:appConfig.basicPages,method:'get',postdata:{},saveinDB:true}
  ];
  const childSetup = () => {
    // if(netInfo.isConnected){
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

  return (
    <>
      <OnboardingContainer>
        <OnboardingHeading>
          <ChildCenterView>
            <Heading1Centerw>
              {t('childSetupList.header')}
            </Heading1Centerw>
            <ShiftFromTop30>
            <Heading3Centerw>
              {t('childSetupList.subHeader')}
            </Heading3Centerw>
            </ShiftFromTop30>
          </ChildCenterView>
        </OnboardingHeading>
        <ChildContentArea>
         {/* <ScrollView> */}
          <ChildListingArea>
          <CustomScrollView>
            {
           childList?.length > 0 ? (
              childList.map((item: ChildEntity, index: number) => {
               // console.log(childList,"..childList123..");
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
            <ButtonLinkView
              
              onPress={() => navigation.navigate('AddSiblingDataScreen',{headerTitle:t('childSetupList.addSiblingBtn'),childData:null})}>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_plus" size={20} color="#FFF" />
                </OuterIconLeft>
                <ButtonTextLinew> {t('childSetupList.addSiblingBtn')}</ButtonTextLinew>
              </OuterIconRow>
            </ButtonLinkView>
          </ShiftFromBottom20>

          <ButtonPrimary
            onPress={() => {
              childSetup();
            }}>
            <ButtonText>{t('childSetupList.continueBtnText')}</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default ChildSetupList;
