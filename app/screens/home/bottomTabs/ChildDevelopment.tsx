import AgeBrackets from '@components/AgeBrackets';
import VideoPlayer from '@components/VideoPlayer';
import ChilDevelopmentCollapsibleItem from '@components/ChilDevelopmentCollapsibleItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleHeading } from '@components/shared/ArticlesStyle';
import Container, { BannerContainer, MainContainer,SafeAreaContainer } from '@components/shared/Container';
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
  FlatList,
  Image,
  Pressable,
  SafeAreaView, Text, View
} from 'react-native';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../../App';
import { useFocusEffect } from '@react-navigation/native';
import { userRealmCommon } from '../../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../../database/schema/ChildDataSchema';
import ProgressCircle from 'react-native-progress-circle'
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
  const [milestonePercent,setMilestonePercent] = useState(0);
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
    // setCurrentSelectedChildId2(item.id);
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
  useFocusEffect(
    React.useCallback(() => { 
      // console.log("selectedChildMilestoneData changed--");
      calculateMileStone();
    },[selectedChildMilestoneData])
  );
  const sendMileStoneDatatoParent = (item: any,togglevalue: any) => {
    console.log("sendMileStoneDatatoParent--",item,togglevalue);
    const i = selectedChildMilestoneData.findIndex((_item: any) => _item.id === item.id);
    if(i > -1)
    {
      let abc = selectedChildMilestoneData[i];
      abc['toggleCheck'] = togglevalue;
      setselectedChildMilestoneData([
          ...selectedChildMilestoneData.slice(0,i),
          abc,
          ...selectedChildMilestoneData.slice(i+1)
        ]
      );
      // milestonefilteredData[i] = {...milestonefilteredData[i],toggleCheck:true}
    }
  }
  const calculateMileStone = () => {
    console.log("selectedChildMilestoneData------",selectedChildMilestoneData);
    const arrlength = selectedChildMilestoneData?.length;
    let abc = 0;
    if(arrlength > 0)
    {
      abc = (selectedChildMilestoneData.filter((x:any)=>x.toggleCheck == true)).length;
    }
    console.log(arrlength,"---abc--",abc);
    const percent = Math.round((abc/arrlength) * 100);
    console.log(percent,"--percent");
    setMilestonePercent(percent);
  }
  console.log("selectedChildMilestoneData------",selectedChildMilestoneData);
  const renderItem = (item: typeof cditems[0]) => (
    <ChilDevelopmentCollapsibleItem key={item.id} item={item} sendMileStoneDatatoParent={sendMileStoneDatatoParent} VideoArticlesData={VideoArticlesData} ActivitiesData={ActivitiesData} subItemSaperatorColor={headerColor} />
  );
  const ContentThatGoesBelowTheFlatList = () => {
    return (
      <>
      <ShiftFromTop20>
       <MainContainer>
       {selectedChildDevData && selectedChildDevData?.milestone ?
          <BannerContainer>         
            <Heading5Bold>{t('developScreentipsText')}</Heading5Bold>
            <ShiftFromTop10>
              {/* <Text>
              {selectedChildDevData?.milestone}</Text> */}
            {
              selectedChildDevData?.milestone ? 
              <HTML
                  source={{html: selectedChildDevData?.milestone}}
                  baseFontStyle={{fontSize: 14}}
                />
                : null
              }
           </ShiftFromTop10>        
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
        {/* <AgeBrackets
          itemColor={backgroundColor}
          activatedItemColor={headerColor}
          currentSelectedChildId={currentSelectedChildId}
          showSelectedBracketData={showSelectedBracketData}
        /> */}
        <Container>
          {/* <Image
            source={require('@assets/trash/card2.jpeg')}
            style={{width: '100%'}}
          /> */}
          <VideoPlayer style={{width:'100%'}} selectedPinnedArticleData={selectedPinnedArticleData}></VideoPlayer>
        </Container>
        <ArticleHeading>
          <FlexDirRowSpace>
          <Heading3>{selectedChildDevData?.name} </Heading3>
          {/* <PrematureTagDevelopment>
          <Heading5Bold>
              {t('developScreenprematureText')}
            </Heading5Bold>
          </PrematureTagDevelopment> */}
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
              {milestonePercent < 100 ?
                <Icon
                  name="ic_incom"
                  size={24}
                  color="#FFF"
                  style={{backgroundColor: 'red', borderRadius: 150}}
                />
                : <Icon
                  name="ic_incom"
                  size={24}
                  color="#FFF"
                  style={{backgroundColor: 'green', borderRadius: 150}}
                />
              }
              </OuterIconLeft>
            </OuterIconRow>
            {milestonePercent < 100 ?
              <Heading4>{t('developScreenchartLabel')}</Heading4>
              : <Heading4>{t('developScreenCompletechartLabel')}</Heading4>
            }
          </FDirRow>
          <ShiftFromTop5>
            {milestonePercent < 100 ?
                  <Heading3>{t('developScreenchartText')}</Heading3>
                  : <Heading3>{t('developScreenCompletechartText')}</Heading3> 
              }
              </ShiftFromTop5>
              </DevelopmentContent>
             {/* <DevelopmentPercent>
                <Heading3>25%</Heading3>
             </DevelopmentPercent> */}
             <ProgressCircle
                percent={milestonePercent}
                radius={35}
                borderWidth={6}
                color={headerColor}
                shadowColor="#fff"
                bgColor={backgroundColor}
            >
                <Text style={{ fontSize: 18 }}>{milestonePercent}{'%'}</Text>
            </ProgressCircle>
             {/* <VictoryPie
            // standalone={false}
            //animate={{ duration: 1000 }}
            width={160} height={160}
            data={[{'key': "", 'y': 62}, {'key': "", 'y': (100-62)} ]}
            innerRadius={20}
            labels={() => null}
          />
          <VictoryLabel
                  textAnchor="middle" verticalAnchor="middle"
                  x={80} y={80}
                  text={`62%`}
                  style={{ position:'absolute',fontSize: 45 }}
                />
              */}
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
          { currentSelectedChildId && currentSelectedChildId != '' ? 
            <AgeBrackets
              itemColor={backgroundColor}
              activatedItemColor={headerColor}
              currentSelectedChildId={currentSelectedChildId}
              showSelectedBracketData={showSelectedBracketData}
            />  
            : null 
          }      
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
