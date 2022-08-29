import {
  ButtonPrimary,
  ButtonSpacing,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import VideoPlayer from '@components/VideoPlayer';
import { useNavigation } from '@react-navigation/native';
import {
  Heading2Center,
  Heading3Center,
  Heading4Centerr,
  ShiftFromBottom10,
  ShiftFromTopBottom10,
  SideSpacing25,
} from '@styles/typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { getAllConfigData } from '../../services/childCRUD';
import { relationShipOtherCaregiverId, relationShipServiceProviderId } from '@assets/translations/appOfflineData/apiConstants';
const windowWidth = Dimensions.get('window').width;
const styles=StyleSheet.create({
  flexShrink1:{flexShrink:1},
  shiftFromBottom:{height:windowWidth*0.563-17}
})
const ChildInfo = (props: any):any => {
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

const userNameData =
    allConfigData?.length > 0
      ? allConfigData.filter((item:any) => item.key === 'userName')
      : [];
const userRelationToParent =
    allConfigData?.length > 0
      ? allConfigData.filter((item:any) => item.key === 'userRelationToParent')
      : [];
const activeChildGender = activeChild.gender;
const ChildDevData = useAppSelector(
  (state: any) =>
    state.utilsData.ChildDevData != '' ?JSON.parse(state.utilsData.ChildDevData):[],
  );
const PinnedChildDevData = useAppSelector(
  (state: any) =>
    state.utilsData.PinnedChildDevData != '' ?JSON.parse(state.utilsData.PinnedChildDevData):[],
  );
  const [selectedPinnedArticleData,setSelectedPinnedArticleData] = useState<any>();
  const activityTaxonomyId = activeChild?.taxonomyData.prematureTaxonomyId != null && activeChild?.taxonomyData.prematureTaxonomyId != undefined && activeChild?.taxonomyData.prematureTaxonomyId != "" ? activeChild?.taxonomyData.prematureTaxonomyId : activeChild?.taxonomyData.id;
  useEffect(() => {
    getAllConfigData(dispatch);
  },[]);
  useEffect(() => {
    let filteredData = ChildDevData.filter((x:any)=>x.child_age.includes(activityTaxonomyId))[0];
    filteredData = {...filteredData,name:activeChild.taxonomyData.name};
    const selectedChildDevData = filteredData;
    if(activeChildGender == "" || activeChildGender == 0 || activeChildGender == 40 || activeChildGender == 59) //for boy,other and blank
    {
      const filteredPinnedData = PinnedChildDevData.filter((x:any)=>x.id == selectedChildDevData?.boy_video_article)[0];
      setSelectedPinnedArticleData(filteredPinnedData);
    }else if(activeChildGender =="41") //for girl
    {
      const filteredPinnedData = PinnedChildDevData.filter((x:any)=>x.id == selectedChildDevData?.girl_video_article)[0];
      setSelectedPinnedArticleData(filteredPinnedData);
    }
  },[activeChild.uuid,activityTaxonomyId]);
const showAndParentText = ():any => {
  if(userRelationToParent?.length > 0 && 
    (parseInt(userRelationToParent[0].value) == relationShipOtherCaregiverId || parseInt(userRelationToParent[0].value) == relationShipServiceProviderId)) {
      return false
  }else {
    return true
  }
}
const goToVideoArticleDetails = ():any => {
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
           </Heading2Center>
          </ShiftFromBottom10>
          {selectedPinnedArticleData ?
          <>
          <ShiftFromBottom10 style={styles.shiftFromBottom}>
             <VideoPlayer selectedPinnedArticleData={selectedPinnedArticleData}></VideoPlayer>
          </ShiftFromBottom10>
          <Heading3Center style={styles.flexShrink1}  numberOfLines={2}>{selectedPinnedArticleData?.title}</Heading3Center>

          <ShiftFromTopBottom10>
          
            {selectedPinnedArticleData && selectedPinnedArticleData?.summary ? 
            <Heading4Centerr style={styles.flexShrink1} numberOfLines={2}>
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

