import {
  ButtonPrimary,
  ButtonSpacing,
  ButtonText
} from '@components/shared/ButtonGlobal';
import { MainContainer } from '@components/shared/Container';
import VideoPlayer from '@components/VideoPlayer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading2Center, Heading3Center, Heading4Centerr, ShiftFromBottom10, ShiftFromTopBottom10,SideSpacing25} from '@styles/typography';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { useAppSelector } from '../../../App';
import { getCurrentChildAgeInMonths } from '../../services/childCRUD';
import HTML from 'react-native-render-html';

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
const userNameData =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userName')
      : [];
const activeChildGender = activeChild.gender;
// console.log("activeChildGender--",activeChildGender);
const ChildDevData = useAppSelector(
  (state: any) =>
    state.utilsData.ChildDevData != '' ?JSON.parse(state.utilsData.ChildDevData):[],
  );
const PinnedChildDevData = useAppSelector(
  (state: any) =>
    state.utilsData.PinnedChildDevData != '' ?JSON.parse(state.utilsData.PinnedChildDevData):[],
  );
  const [selectedPinnedArticleData,setSelectedPinnedArticleData] = useState();
useFocusEffect(
  React.useCallback(() => { 
    // console.log("selectedChildDevData changed--");
    let filteredData = ChildDevData.filter((x:any)=>x.child_age.includes(activeChild.taxonomyData.id))[0];
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
  },[activeChild.uuid])
);

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
            {t('homeScreenchildInfoTitle',{childName:(activeChild.childName!='' && activeChild.childName!=null)?activeChild.childName:t('childInfoBabyText'),parentName:userNameData?.length > 0 ? t('childInfoAndText')+' '+userNameData[0].value : t('childInfoAndText')+' ' +t('childInfoParentText')})} 
            {/* if baby found use childInfoTitle */}
          </Heading2Center>
          </ShiftFromBottom10>
          {selectedPinnedArticleData ?
          <>
          <ShiftFromBottom10>
            {/* <Image
              source={require('@assets/trash/card3.jpeg')}
              style={{width: '100%', borderRadius: 10}}
            /> */}
            <VideoPlayer selectedPinnedArticleData={selectedPinnedArticleData}></VideoPlayer>
          </ShiftFromBottom10>
          {/* <Heading3Center>{t('babyNotificationbyAge',{childName:(activeChild.childName!=null && activeChild.childName!="" && activeChild.childName!=undefined)?activeChild.childName:'',ageInMonth:(activeChild.birthDate!=null && activeChild.birthDate!="" && activeChild.birthDate!=undefined)? getCurrentChildAgeInMonths(t,activeChild.birthDate):''})}</Heading3Center> */}
          <Heading3Center>{selectedPinnedArticleData?.title}</Heading3Center>

          <ShiftFromTopBottom10>
          
            {/* {selectedPinnedArticleData && selectedPinnedArticleData?.body ? 
              <HTML
                source={{html: selectedPinnedArticleData?.body}}
                baseFontStyle={{fontSize: 14}}
              />
              : null} */}
          </ShiftFromTopBottom10>
          <ShiftFromBottom10>
            <ButtonSpacing>
              <SideSpacing25>
            <ButtonPrimary onPress={goToVideoArticleDetails}>
              <ButtonText>{t('homeScreenchildBtnText')}</ButtonText>
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
