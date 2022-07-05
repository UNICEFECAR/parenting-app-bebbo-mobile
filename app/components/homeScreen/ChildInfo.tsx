import {
  ButtonPrimary,
  ButtonSpacing,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import VideoPlayer from '@components/VideoPlayer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading2Center, Heading3Center, Heading4Centerr, Heading4Regular, ShiftFromBottom10, ShiftFromTopBottom10,SideSpacing25} from '@styles/typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { getAllConfigData, getCurrentChildAgeInMonths } from '../../services/childCRUD';
import HTML from 'react-native-render-html';
import { relationShipOtherCaregiverId, relationShipServiceProviderId } from '@assets/translations/appOfflineData/apiConstants';

const ChildInfo = (props: any) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const { headerColor, backgroundColor} = props;
  const activeChild = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild)
    : [],
);
const allConfigData = useAppSelector((state: any) =>
state.variableData?.variableData != ''
  ? JSON.parse(state.variableData?.variableData)
  : state.variableData?.variableData,
);
const dispatch = useAppDispatch();
// console.log(allConfigData,"allConfigData--",activeChild);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const userNameData =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userName')
      : [];
const userRelationToParent =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userRelationToParent')
      : [];
      console.log("userRelationToParent----",userRelationToParent);
const activeChildGender = activeChild.gender;
const ChildDevData = useAppSelector(
  (state: any) =>
    state.utilsData.ChildDevData != '' ?JSON.parse(state.utilsData.ChildDevData):[],
  );
const PinnedChildDevData = useAppSelector(
  (state: any) =>
    state.utilsData.PinnedChildDevData != '' ?JSON.parse(state.utilsData.PinnedChildDevData):[],
  );
  const [selectedPinnedArticleData,setSelectedPinnedArticleData] = useState();
  const activityTaxonomyId = activeChild?.taxonomyData.prematureTaxonomyId != null && activeChild?.taxonomyData.prematureTaxonomyId != undefined && activeChild?.taxonomyData.prematureTaxonomyId != "" ? activeChild?.taxonomyData.prematureTaxonomyId : activeChild?.taxonomyData.id;
  // console.log(activityTaxonomyId, "..activityTaxonomyId..");
  useEffect(() => {
    getAllConfigData(dispatch);
  },[]);
  useEffect(() => {
    // console.log("selectedChildDevData changed--");
    let filteredData = ChildDevData.filter((x:any)=>x.child_age.includes(activityTaxonomyId))[0];
    filteredData = {...filteredData,name:activeChild.taxonomyData.name};
    const selectedChildDevData = filteredData;
    if(activeChildGender == "" || activeChildGender == 0 || activeChildGender == 40 || activeChildGender == 59) //for boy,other and blank
    {
      // let pinnedVideoartId = selectedChildDevData.boy_video_article;
      let filteredPinnedData = PinnedChildDevData.filter((x:any)=>x.id == selectedChildDevData?.boy_video_article)[0];
      setSelectedPinnedArticleData(filteredPinnedData);
    }else if(activeChildGender =="41") //for girl
    {
      let filteredPinnedData = PinnedChildDevData.filter((x:any)=>x.id == selectedChildDevData?.girl_video_article)[0];
      setSelectedPinnedArticleData(filteredPinnedData);
    }
  },[activeChild.uuid,activityTaxonomyId]);
const showAndParentText = () => {
  if(userRelationToParent?.length > 0 && 
    (parseInt(userRelationToParent[0].value) == relationShipOtherCaregiverId || parseInt(userRelationToParent[0].value) == relationShipServiceProviderId)) {
      // console.log("in if");
      return false
  }else {
    // console.log("in else");
    return true
  }
}
console.log("showAndParentText---",showAndParentText());
const goToVideoArticleDetails = () => {
  navigation.navigate('DetailsScreen', {
    fromScreen: 'Home',
    headerColor: headerColor,
    backgroundColor: backgroundColor,
    detailData: selectedPinnedArticleData
  });
}
  return (
    <>
    
      <MainContainer key={selectedPinnedArticleData?.id}>
        
          <ShiftFromBottom10>
          <Heading2Center>
            {t('homeScreenchildInfoTitle',{childName:(activeChild.childName!='' && activeChild.childName!=null)?activeChild.childName:t('childInfoBabyText'),parentName:userNameData?.length > 0 ? t('childInfoAndText') + ' ' + userNameData[0].value : showAndParentText() ? t('childInfoAndText') + ' ' + t('childInfoParentText') : ''})} 
            {/* if baby found use childInfoTitle */}
          </Heading2Center>
          </ShiftFromBottom10>
          {selectedPinnedArticleData ?
          <>
          <ShiftFromBottom10 style={{height:windowWidth*0.563-17}}>
            {/* <Image
              source={require('@assets/trash/card3.jpeg')}
              style={{width: '100%', borderRadius: 10}}
            /> */}
            <VideoPlayer selectedPinnedArticleData={selectedPinnedArticleData}></VideoPlayer>
          </ShiftFromBottom10>
          {/* <Heading3Center>{t('babyNotificationbyAge',{childName:(activeChild.childName!=null && activeChild.childName!="" && activeChild.childName!=undefined)?activeChild.childName:'',ageInMonth:(activeChild.birthDate!=null && activeChild.birthDate!="" && activeChild.birthDate!=undefined)? getCurrentChildAgeInMonths(t,activeChild.birthDate):''})}</Heading3Center> */}
          <Heading3Center style={{flexShrink:1}} numberOfLines={2}>{selectedPinnedArticleData?.title}</Heading3Center>

          <ShiftFromTopBottom10>
          
            {selectedPinnedArticleData && selectedPinnedArticleData?.summary ? 
            <Heading4Centerr style={{flexShrink:1}} numberOfLines={2}>
              {selectedPinnedArticleData?.summary}
            </Heading4Centerr>
              : null}
          </ShiftFromTopBottom10>
          <ShiftFromBottom10>
            <ButtonSpacing>
              <SideSpacing25>
            <ButtonPrimary onPress={goToVideoArticleDetails}>
              <ButtonText numberOfLines={2}>{t('homeScreenchildBtnText')}</ButtonText>
             
            </ButtonPrimary>
            </SideSpacing25>
            </ButtonSpacing>
          </ShiftFromBottom10>
        </>
        : null 
      }
        </MainContainer>
        
    </>
  );
};

export default ChildInfo;
