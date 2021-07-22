import AgeBrackets from '@components/AgeBrackets';
import VideoPlayer from '@components/VideoPlayer';
import ChilDevelopmentCollapsibleItem from '@components/ChilDevelopmentCollapsibleItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleHeading } from '@components/shared/ArticlesStyle';
import { BannerContainer, MainContainer,SafeAreaContainer } from '@components/shared/Container';
import { DevelopmentContent, DevelopmentPercent, DevelopmentStatus } from '@components/shared/DevelopmentStyle';
import { FDirCol,FlexCol, FDirRow,Flex1, Flex4, FlexDirCol, FlexDirRowSpace, FlexDirRowSpaceStart } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { PrematureTagDevelopment } from '@components/shared/PrematureTag';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading3, Heading3Regular, Heading4, Heading5Bold, ShiftFromTop10, ShiftFromTop20, ShiftFromTop5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView, View
} from 'react-native';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../../App';
import { useFocusEffect } from '@react-navigation/native';
import { userRealmCommon } from '../../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../../database/schema/ChildDataSchema';
import { VictoryPie } from 'victory-native';
type ChildDevelopmentNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: ChildDevelopmentNavigationProp;
};
const ChildDevelopment = ({navigation}: Props) => {
  const cditems = [
    {
      id: 0,
      title: 'Laughs at a human face',
    },
    {
      id: 1,
      title: "Carefully observes people's face",
    },
    {
      id: 2,
      title: 'Shows that she is angry or happy',
    },
    {
      id: 3,
      title:
        'Begins a mimic facial movements and expressions, as well as sound',
    },
    {
      id: 4,
      title: "Carefully observes people's face",
    },
    {
      id: 5,
      title: 'Shows that she is angry or happy',
    },
    {
      id: 6,
      title:
        'Begins a mimic facial movements and expressions, as well as soundy',
    },
  ];
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const backgroundColor = themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const {t} = useTranslation();
  const ChildDevData = useAppSelector(
    (state: any) =>
      state.utilsData.ChildDevData != '' ?JSON.parse(state.utilsData.ChildDevData):[],
    );
  const PinnedChildDevData = useAppSelector(
    (state: any) =>
      state.utilsData.PinnedChildDevData != '' ?JSON.parse(state.utilsData.PinnedChildDevData):[],
    );
    // console.log("PinnedChildDevData--",PinnedChildDevData);
  const MileStonesData = useAppSelector(
    (state: any) =>
      state.utilsData.MileStonesData != '' ?JSON.parse(state.utilsData.MileStonesData):[],
    );
    const VideoArticlesData = useAppSelector(
      (state: any) =>
        state.utilsData.VideoArticlesData != '' ?JSON.parse(state.utilsData.VideoArticlesData):[],
      );
    const ActivitiesData = useAppSelector(
      (state: any) =>
        state.utilsData.ActivitiesData != '' ?JSON.parse(state.utilsData.ActivitiesData):[],
      );
      // console.log("ActivitiesData--",ActivitiesData);
  const childAge = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
    );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const [currentSelectedChildId,setCurrentSelectedChildId] = useState();
  const [selectedChildDevData,setSelectedChildDevData] = useState();
  const [selectedChildMilestoneData,setselectedChildMilestoneData] = useState();
  const [selectedPinnedArticleData,setSelectedPinnedArticleData] = useState();
  // let selectedChildDevData:any;
  const onPressInfo = () => {
    navigation.navigate('DetailsScreen', {
      fromScreen: 'ChildDevelopment',
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
      detailData: selectedPinnedArticleData
    });

    // navigation.navigate('DetailsScreen',
    // {
    //   fromScreen:"Articles",
    //   headerColor:headerColor,
    //   backgroundColor:backgroundColor,
    //   detailData:item,
    //   listCategoryArray: filterArray
    //   // setFilteredArticleData: setFilteredArticleData
    // });
  };
  const showSelectedBracketData = async (item: any) => {
    // console.log("in showSelectedBracketData--",item);
    setCurrentSelectedChildId(item.id);
    let filteredData = ChildDevData.filter((x:any)=>x.child_age.includes(item.id))[0];
    filteredData = {...filteredData,name:item.name};
    // console.log(filteredData);
    setSelectedChildDevData(filteredData);
    const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema,'uuid == "'+activeChild.uuid+'"');
    // console.log("childData--",childData[0].checkedMilestones);
    let milestonefilteredData = await MileStonesData.filter((x:any)=>x.child_age.includes(item.id));
    // console.log(milestonefilteredData);
    childData[0].checkedMilestones.filter((x:any)=> {
      console.log(x);
      const i = milestonefilteredData.findIndex((_item: any) => _item.id === x);
      if(i > -1)
      {
        milestonefilteredData[i]['toggleCheck'] = true;
        // milestonefilteredData[i] = {...milestonefilteredData[i],toggleCheck:true}
      }
    })
    setselectedChildMilestoneData(milestonefilteredData);
  }
  useFocusEffect(
    React.useCallback(() => { 
      console.log("child dev usefocuseffect");
      const firstChildDevData = childAge.filter((x:any)=> x.id == activeChild?.taxonomyData.id);
      // console.log("firstChildDevData---",firstChildDevData);
      showSelectedBracketData(firstChildDevData[0]);
    },[])
  );
  useFocusEffect(
    React.useCallback(() => { 
      console.log("selectedChildDevData changed--");
      if(activeChild?.gender == "" || activeChild?.gender == 0 || activeChild?.gender == 40 || activeChild?.gender == 59) //for boy,other and blank
      {
        // let pinnedVideoartId = selectedChildDevData.boy_video_article;
        let filteredPinnedData = PinnedChildDevData.filter((x:any)=>x.id == selectedChildDevData?.boy_video_article)[0];
        setSelectedPinnedArticleData(filteredPinnedData);
      }else if(activeChild?.gender =="41") //for girl
      {
        let filteredPinnedData = PinnedChildDevData.filter((x:any)=>x.id == selectedChildDevData?.girl_video_article)[0];
        setSelectedPinnedArticleData(filteredPinnedData);
      }
    },[selectedChildDevData])
  );
  const renderItem = (item: typeof cditems[0]) => (
    <ChilDevelopmentCollapsibleItem key={item.id} item={item} VideoArticlesData={VideoArticlesData} ActivitiesData={ActivitiesData} subItemSaperatorColor={headerColor} />
  );
  const ContentThatGoesBelowTheFlatList = () => {
    return (
      <>
      <ShiftFromTop20>
       <MainContainer>
       {selectedChildDevData && selectedChildDevData?.milestone ?
          <BannerContainer>         
            <Heading5Bold>{t('developScreentipsText')}</Heading5Bold>
            <ShiftFromTop10><Heading3Regular>
              {selectedChildDevData?.milestone}
            {/* {
              selectedChildDevData?.milestone ? 
              <HTML
                  source={{html: selectedChildDevData?.milestone}}
                  baseFontStyle={{fontSize: 16}}
                />
                : null
              } */}
            </Heading3Regular></ShiftFromTop10>        
          </BannerContainer>
          : null 
        }
        </MainContainer></ShiftFromTop20>
      </>
    );
  };
  const ContentThatGoesAboveTheFlatList = () => {

    return (
      <>
        <AgeBrackets
          itemColor={backgroundColor}
          activatedItemColor={headerColor}
          currentSelectedChildId={currentSelectedChildId}
          showSelectedBracketData={showSelectedBracketData}
        />
        <View>
          {/* <Image
            source={require('@assets/trash/card2.jpeg')}
            style={{width: '100%'}}
          /> */}
          <VideoPlayer selectedPinnedArticleData={selectedPinnedArticleData}></VideoPlayer>
        </View>
        <ArticleHeading>
          <FlexDirRowSpace>
          <Heading3>{selectedChildDevData?.name} </Heading3>
          <PrematureTagDevelopment>
          <Heading5Bold>
              {t('developScreenprematureText')}
            </Heading5Bold>
          </PrematureTagDevelopment>
          </FlexDirRowSpace>
          <ShiftFromTop5>
          <FlexDirRowSpaceStart>
          <Heading2>
            {selectedChildDevData?.title}
          </Heading2>
          <Pressable onPress={onPressInfo}>
            <ShiftFromTop5>
                <Icon name="ic_info" size={15} color="#000" />
                </ShiftFromTop5>
            </Pressable>
          </FlexDirRowSpaceStart>
          </ShiftFromTop5>
          <FDirCol>
            <DevelopmentStatus>
            <FlexDirRowSpace>
              <DevelopmentContent>
              <FDirRow>
            
            <OuterIconRow>
              <OuterIconLeft>
              <Icon
            name="ic_incom"
            size={24}
            color="#FFF"
            style={{backgroundColor: 'red', borderRadius: 150}}
          />
              </OuterIconLeft>
            </OuterIconRow>
          <Heading4>{t('developScreenchartLabel')}</Heading4>
          </FDirRow>
          <ShiftFromTop5>
              <Heading3>{t('developScreenchartText')}</Heading3>
              </ShiftFromTop5>
              </DevelopmentContent>
             <DevelopmentPercent>
                <Heading3>25%</Heading3>
             </DevelopmentPercent>
             {/* <View style={{width:64,height:64}}> */}
              {/* <VictoryPie
                  innerRadius={20}
                  width={164} height={164}
                  data={[
                    { x: "", y: 90 },
                    { x: "", y: 100-90 },
                  ]}
                /> */}
              {/* </View> */}
            </FlexDirRowSpace>
            </DevelopmentStatus>
            <FDirRow>
            <Heading3Regular>
          {t('developScreenmileStoneQ')}
        </Heading3Regular>
            </FDirRow>
          </FDirCol>
        
        </ArticleHeading>
        
      </>
    );
  };
  return (
    <>
      <SafeAreaContainer>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
          <TabScreenHeader
            title={t('developScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
          />
          {selectedChildMilestoneData && selectedChildMilestoneData?.length > 0 ?
              <FlexCol style={{backgroundColor: backgroundColor}}>
                <View>
                  <FlatList
                    data={selectedChildMilestoneData}
                    renderItem={({item, index}) => renderItem(item)}
                    keyExtractor={(item) => item.id.toString()}
                    nestedScrollEnabled={true}
                    ListHeaderComponent={ContentThatGoesAboveTheFlatList}
                    ListFooterComponent={ContentThatGoesBelowTheFlatList}
                  />
                </View>
              </FlexCol>
              : null 
            }
         
      </SafeAreaContainer>
    </>
  );
};

export default ChildDevelopment;
