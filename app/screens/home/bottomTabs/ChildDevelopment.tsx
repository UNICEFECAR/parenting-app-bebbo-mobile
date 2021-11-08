import AgeBrackets from '@components/AgeBrackets';
import VideoPlayer from '@components/VideoPlayer';
import ChilDevelopmentCollapsibleItem from '@components/ChilDevelopmentCollapsibleItem';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ArticleHeading } from '@components/shared/ArticlesStyle';
import Container, { BannerContainer, MainContainer } from '@components/shared/Container';
import { DevelopmentContent, DevelopmentPercent, DevelopmentStatus } from '@components/shared/DevelopmentStyle';
import { FDirCol, FlexCol, FDirRow, Flex1, Flex4, FlexDirCol, FlexDirRowSpace, FlexDirRowSpaceStart } from '@components/shared/FlexBoxStyle';
import Icon, { OuterIconLeft, OuterIconRow, IconViewSuccess, IconViewAlert, IconAreaPress } from '@components/shared/Icon';
import { PrematureTagDevelopment } from '@components/shared/PrematureTag';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2, Heading3, Heading3Regular, Heading4, Heading4Center, Heading4Centerr, Heading5Bold, ShiftFromBottom10, ShiftFromBottom15, ShiftFromTop10, ShiftFromTop20, ShiftFromTop5 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import analytics from '@react-native-firebase/analytics';
import {
  BackHandler,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text, View
} from 'react-native';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import { useFocusEffect } from '@react-navigation/native';
import { userRealmCommon } from '../../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../../database/schema/ChildDataSchema';
import ProgressCircle from 'react-native-progress-circle'
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import FirstTimeModal from '@components/shared/FirstTimeModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addSpaceToHtml } from '../../../services/Utils';
import { CHILD_DEVELOPMENT_AGEGROUP_SELECTED, CHILD_MILESTONE_TRACKED, GAME_AGEGROUP_SELECTED } from '@assets/data/firebaseEvents';
import ModalPopupContainer, { PopupOverlay, PopupCloseContainer, PopupClose, ModalPopupContent } from '@components/shared/ModalPopupStyle';
type ChildDevelopmentNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  route: any,
  navigation: ChildDevelopmentNavigationProp;
};
const ChildDevelopment = ({ route, navigation }: Props) => {

  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const ChildDevData = useAppSelector(
    (state: any) =>
      state.utilsData.ChildDevData != '' ? JSON.parse(state.utilsData.ChildDevData) : [],
  );
  const PinnedChildDevData = useAppSelector(
    (state: any) =>
      state.utilsData.PinnedChildDevData != '' ? JSON.parse(state.utilsData.PinnedChildDevData) : [],
  );
  // console.log("PinnedChildDevData--",PinnedChildDevData);
  const MileStonesData = useAppSelector(
    (state: any) =>
      state.utilsData.MileStonesData != '' ? JSON.parse(state.utilsData.MileStonesData) : [],
  );
  const VideoArticlesData = useAppSelector(
    (state: any) =>
      state.utilsData.VideoArticlesData != '' ? JSON.parse(state.utilsData.VideoArticlesData) : [],
  );
  const ActivitiesData = useAppSelector(
    (state: any) =>
      state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
  );
  // console.log("ActivitiesData--",ActivitiesData);
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  // let headerColor,backgroundColor,artHeaderColor,artBackgroundColor,headerColorBlack;
  const childDevModalOpened = useAppSelector((state: any) =>
    (state.utilsData.IsChildDevModalOpened),
  );
  const modalScreenKey = 'IsChildDevModalOpened';
  const modalScreenText = 'childDevModalText';
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectedChildId, setCurrentSelectedChildId] = useState(0);
  const [selectedChildDevData, setSelectedChildDevData] = useState();
  const [selectedChildMilestoneData, setselectedChildMilestoneData] = useState();
  const [selectedPinnedArticleData, setSelectedPinnedArticleData] = useState();
  const [milestonePercent, setMilestonePercent] = useState(0);
  const [componentColors, setComponentColors] = useState({});
  const [showNoData, setshowNoData] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const flatListRef = React.useRef()

  const setIsModalOpened = async (varkey: any) => {
    console.log("modalVisible--", modalVisible);
    if (modalVisible == true) {
      let obj = { key: varkey, value: false };
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  // let selectedChildDevData:any;
  useEffect(() => {
    console.log("in childdev focuseffect", childDevModalOpened);
    setModalVisible(childDevModalOpened);
    // dispatch(setInfoModalOpened({key: modalScreenKey, value: true}));

    setComponentColors({
      headerColor: themeContext.colors.CHILDDEVELOPMENT_COLOR,
      backgroundColor: themeContext.colors.CHILDDEVELOPMENT_TINTCOLOR,
      artHeaderColor: themeContext.colors.ARTICLES_COLOR,
      artBackgroundColor: themeContext.colors.ARTICLES_TINTCOLOR,
      headerColorBlack: themeContext.colors.PRIMARY_TEXTCOLOR
    });

    return () => {
      console.log("in unmount dev-", route.params?.currentSelectedChildId);
      // if(route.params?.currentSelectedChildId)
      // {
      navigation.setParams({ currentSelectedChildId: 0 })
      console.log(route.params?.currentSelectedChildId, "--after unmount");
      // route.params?.currentSelectedChildId = 0;
      // }
    }
  }, []);

  const onPressInfo = () => {
    navigation.navigate('DetailsScreen', {
      fromScreen: 'ChildDevelopment',
      headerColor: componentColors?.artHeaderColor,
      backgroundColor: componentColors?.artBackgroundColor,
      detailData: selectedPinnedArticleData,
      currentSelectedChildId: currentSelectedChildId
    });
  };
  const toTop = () => {
    // use current
    flatListRef?.current?.scrollToOffset({ animated: Platform.OS=="android" ? true:false, offset: 0 })
  }
  const showSelectedBracketData = async (item: any) => {
    console.log("in showSelectedBracketData--", item);
    toTop();
    analytics().logEvent(CHILD_DEVELOPMENT_AGEGROUP_SELECTED, { age_id: item.id });

    setCurrentSelectedChildId(item.id);
    // setCurrentSelectedChildId2(item.id);
    let filteredData = ChildDevData.filter((x: any) => x.child_age.includes(item.id))[0];
    filteredData = { ...filteredData, name: item.name };
    // console.log(filteredData);
    setSelectedChildDevData(filteredData);
    const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, 'uuid == "' + activeChild.uuid + '"');
    // console.log(MileStonesData,"childData in dev--",childData[0].checkedMilestones);
    let milestonefilteredData = await MileStonesData.filter((x: any) => x.child_age.includes(item.id));
    milestonefilteredData = milestonefilteredData.map(item => ({ ...item, toggleCheck: false }))
    // console.log("milestonefilteredData----",milestonefilteredData);
    childData[0].checkedMilestones.filter((x: any) => {
      // console.log(x);
      const i = milestonefilteredData.findIndex((_item: any) => _item.id === x);
      if (i > -1) {
        milestonefilteredData[i]['toggleCheck'] = true;
        // milestonefilteredData[i] = {...milestonefilteredData[i],toggleCheck:true}
      }
      // else {
      //   milestonefilteredData[i]['toggleCheck'] = false;
      // }
    })
    // console.log("after milestonefilteredData----",milestonefilteredData);
    const sortednewArray = milestonefilteredData.sort((x, y) => { return x.toggleCheck === false ? -1 : y.toggleCheck === false ? 1 : 0; });
    // console.log("sortednewArray--",sortednewArray);
    setselectedChildMilestoneData([...sortednewArray]);
    setTimeout(() => {
      setshowNoData(true);
    }, 500);
  }
  const onBackPress = () => {
    if(route.params?.fromNotificationScreen==true){
      navigation.navigate('NotificationsScreen');
      return true;
    }else{
      navigation.goBack();  
      return true;
    }
  }
  useEffect(() => {
    // const currentDate = DateTime.now().plus({days:-8}).toMillis();
    // dispatch(setSyncDate({key: 'userOnboardedDate', value: currentDate}));
    // dispatch(setSyncDate({key: 'weeklyDownloadDate', value: currentDate}));
    // dispatch(setSyncDate({key: 'monthlyDownloadDate', value: currentDate}));
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    navigation.addListener('gestureEnd', onBackPress);
    return () => {
      navigation.removeListener('gestureEnd', onBackPress);
      backHandler.remove()};
  }, []);
  useEffect(() => {
    // console.log("child dev usefocuseffect");
    console.log("in childdev useeffect", route.params?.currentSelectedChildId);
    setshowNoData(false);
    if (route.params?.currentSelectedChildId && route.params?.currentSelectedChildId != 0) {
      // console.log(route.params?.categoryArray);
      const firstChildDevData = childAge.filter((x: any) => x.id == route.params?.currentSelectedChildId);
      // console.log("firstChildDevData---",firstChildDevData);
      showSelectedBracketData(firstChildDevData[0]);
    }
    else {
      const firstChildDevData = childAge.filter((x: any) => x.id == activeChild?.taxonomyData.id);
      // console.log("firstChildDevData---",firstChildDevData);
      showSelectedBracketData(firstChildDevData[0]);
    }
    // const firstChildDevData = childAge.filter((x:any)=> x.id == activeChild?.taxonomyData.id);
    // // console.log("firstChildDevData---",firstChildDevData);
    // showSelectedBracketData(firstChildDevData[0]);

  }, [activeChild?.uuid, route.params?.currentSelectedChildId]
  );
  useFocusEffect(
    React.useCallback(() => {
      // console.log("selectedChildDevData changed--");
      if (activeChild?.gender == "" || activeChild?.gender == 0 || activeChild?.gender == 40 || activeChild?.gender == 59) //for boy,other and blank
      {
        // let pinnedVideoartId = selectedChildDevData.boy_video_article;
        let filteredPinnedData = PinnedChildDevData.filter((x: any) => x.id == selectedChildDevData?.boy_video_article)[0];
        setSelectedPinnedArticleData(filteredPinnedData);
      } else if (activeChild?.gender == "41") //for girl
      {
        let filteredPinnedData = PinnedChildDevData.filter((x: any) => x.id == selectedChildDevData?.girl_video_article)[0];
        setSelectedPinnedArticleData(filteredPinnedData);
      }
    }, [selectedChildDevData])
  );
  useFocusEffect(
    React.useCallback(() => {
      // console.log("selectedChildMilestoneData changed--");
      calculateMileStone();
    }, [selectedChildMilestoneData])
  );
  const sendMileStoneDatatoParent = (item: any, togglevalue: any) => {
    // console.log("sendMileStoneDatatoParent--",item,togglevalue);
    if (togglevalue == true) {
      analytics().logEvent(CHILD_MILESTONE_TRACKED, { age_id: currentSelectedChildId });
    }
    const i = selectedChildMilestoneData.findIndex((_item: any) => _item.id === item.id);
    if (i > -1) {
      let abc = selectedChildMilestoneData[i];
      abc['toggleCheck'] = togglevalue;
      const newArray = [
        ...selectedChildMilestoneData.slice(0, i),
        abc,
        ...selectedChildMilestoneData.slice(i + 1)
      ]
      const sortednewArray = newArray.sort((x, y) => { return x.toggleCheck === false ? -1 : y.toggleCheck === false ? 1 : 0; });

      // console.log(sortednewArray,"newArray---",newArray);
      setselectedChildMilestoneData([...sortednewArray]);
      // userArray.sort((a,b) => a.disabled - b.disabled)
      // milestonefilteredData[i] = {...milestonefilteredData[i],toggleCheck:true}
    }
  }
  const calculateMileStone = () => {
    // console.log("selectedChildMilestoneData------",selectedChildMilestoneData);
    const arrlength = selectedChildMilestoneData?.length;
    let abc = 0;
    if (arrlength > 0) {
      abc = (selectedChildMilestoneData.filter((x: any) => x.toggleCheck == true)).length;
    }
    // console.log(arrlength,"---abc--",abc);
    const percent = Math.round((abc / arrlength) * 100);
    // console.log(percent,"--percent");
    setMilestonePercent(percent);
  }
  // console.log("selectedChildMilestoneData------",selectedChildMilestoneData);
  const RenderItem = React.memo(({ item, index }) => {
    return (
      <ChilDevelopmentCollapsibleItem key={item.id} item={item} sendMileStoneDatatoParent={sendMileStoneDatatoParent} VideoArticlesData={VideoArticlesData} ActivitiesData={ActivitiesData} subItemSaperatorColor={componentColors?.headerColor} currentSelectedChildId={currentSelectedChildId} />
    );
  });
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
                        source={{ html: addSpaceToHtml(selectedChildDevData?.milestone)}}
                        baseFontStyle={{ fontSize: 14 }}
                        ignoredStyles={['color', 'font-size', 'font-family']}
                        tagsStyles={{
                          p:{textAlign:'left',marginBottom:15},
                          h1:{textAlign:'left'},
                          h2:{textAlign:'left'},
                          h3:{textAlign:'left'},
                          h4:{textAlign:'left'},
                          h5:{textAlign:'left'},
                          h6:{textAlign:'left'},
                          span:{textAlign:'left'},
                          li:{textAlign:'left'},
                        }}
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
    console.log(selectedChildDevData, "---selectedChildDevData");
    console.log(selectedChildMilestoneData, "---selectedChildMilestoneData");
    return (
      <>

        {/* <AgeBrackets
            itemColor={backgroundColor}
            activatedItemColor={headerColor}
            currentSelectedChildId={currentSelectedChildId}
            showSelectedBracketData={showSelectedBracketData}
          /> */}
        {selectedChildDevData && Object.keys(selectedChildDevData).length != 0 && selectedChildDevData != "" ?
          <Container>
            {/* <Image
                source={require('@assets/trash/card2.jpeg')}
                style={{width: '100%'}}
              /> */}
            <VideoPlayer style={{ width: '100%' }} selectedPinnedArticleData={selectedPinnedArticleData}></VideoPlayer>
          </Container>
          : null}
        <ArticleHeading>
          {selectedChildDevData && selectedChildDevData != {} && selectedChildDevData != "" ?
            <>
              <FlexDirRowSpace>
                <Heading3>{selectedChildDevData?.name} </Heading3>

                {activeChild.isPremature === 'true' ? (
                   <Pressable onPress={() => setModalVisible1(true)}>
                  <PrematureTagDevelopment>
                    <Heading5Bold>
                      {t('developScreenprematureText')}
                    </Heading5Bold>
                  </PrematureTagDevelopment>
                  </Pressable>
                ) : null}
              </FlexDirRowSpace>
              <ShiftFromTop5>
                <FlexDirRowSpaceStart>
                  <Flex1>
                    <Heading2>
                      {selectedChildDevData?.title}
                    </Heading2>
                  </Flex1>
                  {selectedPinnedArticleData ?
                    <IconAreaPress onPress={onPressInfo}>
                      <ShiftFromTop5>
                        <Icon name="ic_info" size={15} color="#000" />
                      </ShiftFromTop5>
                    </IconAreaPress>
                    : null
                  }
                </FlexDirRowSpaceStart>
              </ShiftFromTop5>
            </>
            : null}
          {selectedChildMilestoneData && selectedChildMilestoneData?.length > 0 ?
            <FDirCol>
              <DevelopmentStatus>
                <FlexDirRowSpace>
                  <DevelopmentContent>
                    <FDirRow>

                      <OuterIconRow>
                        <OuterIconLeft>
                          {milestonePercent < 100 ?
                            <IconViewAlert>
                              <Icon
                                name="ic_incom"
                                size={24}
                                color="#FFF"

                              /></IconViewAlert>
                            : <IconViewSuccess><Icon
                              name="ic_tick"
                              size={16}
                              color="#FFF"

                            /></IconViewSuccess>
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
                    color={componentColors?.headerColor}
                    shadowColor="#fff"
                    bgColor={componentColors?.backgroundColor}
                  >
                    <Text style={{ fontSize: 18 }}>{milestonePercent}{'%'}</Text>
                  </ProgressCircle>
                </FlexDirRowSpace>
              </DevelopmentStatus>
              <FDirRow>

                <Heading3Regular>
                  {t('developScreenmileStoneQ')}
                </Heading3Regular>

              </FDirRow>
            </FDirCol>
            : null}
        </ArticleHeading>
      </>
    );
  };
  return (
    <>
      <View style={{flex:1,backgroundColor:componentColors?.headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={componentColors?.headerColor} />
        <TabScreenHeader
          title={t('developScreenheaderTitle')}
          headerColor={componentColors?.headerColor}
          textColor="#000"
        />
        {currentSelectedChildId && componentColors != {} && currentSelectedChildId != 0 ?
          <View style={{backgroundColor:"#FFF"}}>
          <AgeBrackets
            itemColor={componentColors?.headerColorBlack}
            activatedItemColor={componentColors?.headerColor}
            currentSelectedChildId={currentSelectedChildId}
            showSelectedBracketData={showSelectedBracketData}
            ItemTintColor={componentColors?.backgroundColor}
          />
        </View>
          : null
        }

        <FlexCol style={{ backgroundColor: componentColors?.backgroundColor }}>
          {showNoData == true && (Object.keys(selectedChildDevData).length == 0 || selectedChildDevData == undefined) && selectedChildMilestoneData?.length == 0 ?
            <Heading4Center>{t('noDataTxt')}</Heading4Center>
            : null}
          <View>
            <FlatList
              ref={flatListRef}
              data={selectedChildMilestoneData}
              // renderItem={({item, index}) => renderItem(item)}
              // renderItem={({item, index}) => <RenderItem item={item} index={index} />  }
              renderItem={({ item, index }) => <ChilDevelopmentCollapsibleItem key={item.id} activeChilduuidnew={activeChild.uuid} item={item} sendMileStoneDatatoParent={sendMileStoneDatatoParent} VideoArticlesData={VideoArticlesData} ActivitiesData={ActivitiesData} subItemSaperatorColor={componentColors?.headerColor} currentSelectedChildId={currentSelectedChildId} />}
              keyExtractor={(item) => item.id.toString()}
              nestedScrollEnabled={true}
              ListHeaderComponent={ContentThatGoesAboveTheFlatList}
              ListFooterComponent={ContentThatGoesBelowTheFlatList}
            />
          </View>
        </FlexCol>
        {/* {selectedChildMilestoneData && selectedChildMilestoneData?.length > 0 ?
              : <Heading4Center>{t('noDataTxt')}</Heading4Center> 
            } */}
        <FirstTimeModal modalVisible={modalVisible} setIsModalOpened={setIsModalOpened} modalScreenKey={modalScreenKey} modalScreenText={modalScreenText}></FirstTimeModal>
        <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible1(false);
        }}
        onDismiss={() => {
          setModalVisible1(false);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={() => {
                  setModalVisible1(false);
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>
                {t('childSetupprematureMessage')}
              </Heading4Centerr>
            </ModalPopupContent>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      </View>
    </>
  );
};

export default ChildDevelopment;
