import ActivitiesCategories from '@components/ActivitiesCategories';
import AgeBrackets from '@components/AgeBrackets';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ActivityBox, ArticleHeading, ArticleListContainer, ArticleListContent, MainActivityBox } from '@components/shared/ArticlesStyle';
import { ButtonTextSmLine } from '@components/shared/ButtonGlobal';
import { DividerAct } from '@components/shared/Divider';
import FirstTimeModal from '@components/shared/FirstTimeModal';
import { Flex2, Flex4, FlexCol } from '@components/shared/FlexBoxStyle';
import { PrematureTagActivity } from '@components/shared/PrematureTag';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading4, Heading4Center, Heading4Centerr, Heading5Bold, Heading6Bold, ShiftFromTop5, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Modal,
  Platform,
  Pressable,
  SectionList,
  StyleSheet, View
} from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import LoadableImage from '../../../services/LoadableImage';

import analytics from '@react-native-firebase/analytics';
import { GAME_AGEGROUP_SELECTED } from '@assets/data/firebaseEvents';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, { PopupOverlay, PopupCloseContainer, PopupClose, ModalPopupContent } from '@components/shared/ModalPopupStyle';
import { userRealmCommon } from '../../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../../database/schema/ChildDataSchema';
import FastImage from 'react-native-fast-image';
import { randomArrayShuffle } from '../../../services/Utils';
import { activitiesTintcolor, bgcolorWhite2 } from '@styles/style';
type ActivitiesNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  route: any;
  navigation: ActivitiesNavigationProp;
};
const styles = StyleSheet.create({
  activityHeadingView: {
    flexDirection:'row'
  },
  ageBracketView: { 
    backgroundColor: bgcolorWhite2 
  },
  cardImage: {
    alignSelf: 'center',
    flex: 1,
    height: 200,
    width: '100%',
  },
  containerView: {
    backgroundColor:activitiesTintcolor,
    flex:1
  },
  customHeading3: {
    flex:1,
    paddingLeft:5,
    paddingRight:5
  },
  headingBoldStyle: {
    justifyContent:"center",
    paddingBottom:15,
    paddingTop:17
  },
  pressableHeading: {
    flex:1,
    maxWidth:'40%'
  },
  pressableMilestone: {
    paddingBottom:15,
    paddingTop:15
  }
});
const Activities = ({ route, navigation }: any):any => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  let sectionListRef:any;
  const themeContext = useContext(ThemeContext);
  const [profileLoading,setProfileLoading] = React.useState(false);
  const headerColor = themeContext.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const headerColorBlack = themeContext.colors.PRIMARY_TEXTCOLOR;
  const fromPage = 'Activities';
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
  state.bandWidthData?.lowbandWidth
    ? state.bandWidthData.lowbandWidth
    : false,
);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const ActivitiesDataold = useAppSelector(
    (state: any) =>
      state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
  );
  const ActivitiesData = randomArrayShuffle(ActivitiesDataold)
  const activityCategoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
  );
  const MileStonesData = useAppSelector(
    (state: any) =>
      state.utilsData.MileStonesData != '' ? JSON.parse(state.utilsData.MileStonesData) : [],
  );
  const activityTaxonomyId = activeChild?.taxonomyData.prematureTaxonomyId != null && activeChild?.taxonomyData.prematureTaxonomyId != undefined && activeChild?.taxonomyData.prematureTaxonomyId != "" ? activeChild?.taxonomyData.prematureTaxonomyId : activeChild?.taxonomyData.id;
  const favoritegames = useAppSelector((state: any) =>
    state.childData.childDataSet.favoritegames
  );
  const activityModalOpened = useAppSelector((state: any) =>
    (state.utilsData.IsActivityModalOpened),
  );
  const modalScreenKey = 'IsActivityModalOpened';
  const modalScreenText = 'activityModalText';
  const [modalVisible, setModalVisible] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [currentSelectedChildId, setCurrentSelectedChildId] = useState(0);
  const [selectedChildActivitiesData, setSelectedChildActivitiesData] = useState([]);
  const [suggestedGames, setsuggestedGames] = useState([]);
  const [otherGames, setotherGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setfilteredData] = useState([]);
  const [showNoData, setshowNoData] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [childMilestonedata,setchildMilestonedata] = useState([]);
  const setIsModalOpened = async (varkey: any):Promise<any> => {
    if (modalVisible == true) {
      const obj = { key: varkey, value: false };
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  useFocusEffect(() => {
    setModalVisible(activityModalOpened);
  })
  const toTop = ():any => {
    // use current
    // flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
    if(sectionListRef){
    sectionListRef.scrollToLocation(
      {
        animated:Platform.OS=="android" ? true:false,
        sectionIndex: 0,
        itemIndex: 0
      }
    );
    }
  }
  const setFilteredActivityData = (itemId: any):any => {
  
    if (selectedChildActivitiesData && selectedChildActivitiesData.length > 0 && selectedChildActivitiesData != []) {
      if (itemId.length > 0) {
        const newArticleData = selectedChildActivitiesData.filter((x: any) => itemId.includes(x.activity_category));
        setfilteredData(newArticleData);
        setLoading(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 200);
      } else {
        const newArticleData = selectedChildActivitiesData.length > 0 ? selectedChildActivitiesData : [];
        setfilteredData(newArticleData);
        setLoading(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 200);
      }
    }
    else {
      setfilteredData([]);
      setLoading(false);
      setTimeout(() => {
        setshowNoData(true);
      }, 200);
    }
    toTop();
  }
  useFocusEffect(
    React.useCallback(() => {
     console.log("useFocusEffect called route.params?.backClicked",route.params?.backClicked);
      setLoading(true);
      
      async function fetchData():Promise<any> {
        if (route.params?.categoryArray) {
          setFilterArray(route.params?.categoryArray);
          setFilteredActivityData(route.params?.categoryArray);
        }
        else {
          setFilterArray([]);
          setFilteredActivityData([]);
        }
      }
      if (route.params?.backClicked != 'yes') {
        fetchData()
      } else {
        setLoading(false);
      }

    }, [selectedChildActivitiesData, route.params?.categoryArray])
  );

  const showSelectedBracketData = (item: any):any => {

    analytics().logEvent(GAME_AGEGROUP_SELECTED, { age_id: item.id });
   
    setCurrentSelectedChildId(item.id);
    const filteredData = ActivitiesData.filter((x: any) => x.child_age.includes(item.id));
    setSelectedChildActivitiesData(filteredData);
     }
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.backClicked != 'yes') {
        setshowNoData(false);
        if (route.params?.currentSelectedChildId && route.params?.currentSelectedChildId != 0) {
          console.log("if route params 0",route.params);
          const firstChildDevData = childAge.filter((x: any) => x.id == route.params?.currentSelectedChildId);
          showSelectedBracketData(firstChildDevData[0]);
        }
        else {
          console.log("else if route params 0",route.params,activityTaxonomyId);
       
        const firstChildDevData = childAge.filter((x: any) => x.id == activityTaxonomyId);
        showSelectedBracketData(firstChildDevData[0]);
        }
      } else {
        setLoading(false);
        if (route.params?.backClicked == 'yes') {
          navigation.setParams({ backClicked: 'no' })
        }
      }

    }, [activeChild?.uuid, languageCode, route.params?.currentSelectedChildId,activityTaxonomyId])
  );
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async ():Promise<any> => {
        const filterQuery = 'uuid == "'+activeChild?.uuid+'"';
        const childData = await userRealmCommon.getFilteredData<ChildEntity>(ChildEntitySchema, filterQuery);
        setchildMilestonedata(childData[0].checkedMilestones)
      }
      fetchData()
      return ():any => {
        console.log("unmount activity",route.params);
        
        navigation.setParams({ backClicked: 'no' })
       
        navigation.setParams({ currentSelectedChildId: 0 })
        
        navigation.setParams({ categoryArray: [] })
        
      };
    }, [])
  );
  
  useFocusEffect(
    React.useCallback(() => {
      setsuggestedGames((filteredData.filter((x: any) => x.related_milestone.length > 0 && ((childMilestonedata.findIndex((y:any)=>y == x.related_milestone[0])) == -1))));
      setotherGames((filteredData.filter((x: any) => x.related_milestone.length == 0  || (x.related_milestone.length > 0 && (childMilestonedata.findIndex((y:any)=>y == x.related_milestone[0])) > -1))));
    }, [filteredData,childMilestonedata])
  );
  
  const goToActivityDetail = (item: any):any => {
    navigation.navigate('DetailsScreen',
      {
        fromScreen: "Activities",
        headerColor: headerColor,
        backgroundColor: backgroundColor,
        detailData: item,
        listCategoryArray: filterArray,
        selectedChildActivitiesData: selectedChildActivitiesData,
        currentSelectedChildId: currentSelectedChildId
      });
  };
  

  const onFilterArrayChange = (newFilterArray: any):any => {
    setFilterArray(newFilterArray)
  }
  const gotoMilestone = ():any => {
    navigation.navigate('ChildDevelopment',
    {
      currentSelectedChildId: currentSelectedChildId,
      fromActivitiesScreen: true
    });
  }
  const SuggestedActivities = ({ item, section, index }:any):any => {
    let milestonedatadetail:any = [];
    if(section == 1) {
      const relatedmilestoneid = item.related_milestone.length > 0 ? item.related_milestone[0] : 0;
      milestonedatadetail = MileStonesData.filter((x:any)=>x.id == relatedmilestoneid);
    }
    return (
        <ArticleListContainer>
           <Pressable onPress={():any => { goToActivityDetail(item) }} key={index}>
          <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover}/>
          <ArticleListContent>
            <ShiftFromTopBottom5>
              <Heading6Bold>{activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name}</Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
            {section == 1 && milestonedatadetail.length > 0 && ((childMilestonedata.findIndex((x:any)=>x == milestonedatadetail[0]?.id)) == -1) ? 
            <MainActivityBox>
            <ActivityBox>
            <Flex4>
              <Heading6Bold  style={styles.headingBoldStyle}>
                {t('actScreenpendingMilestone')} {t('actScreenmilestones')}
              </Heading6Bold>
            </Flex4>
            <Flex2>
              <Pressable onPress={():any => gotoMilestone()} style={styles.pressableMilestone}>
                <ButtonTextSmLine numberOfLines={2}>
                  {t('actScreentrack')} {t('actScreenmilestones')}
                </ButtonTextSmLine>
              </Pressable>
              </Flex2>
          </ActivityBox>
          <ActivityBox><ShiftFromTop5>
          <Heading4>{milestonedatadetail[0]?.title}</Heading4>
          </ShiftFromTop5></ActivityBox></MainActivityBox>
        : null
        }
          </ArticleListContent>
          <ShareFavButtons backgroundColor={'#FFF'} item={item} isFavourite = {((favoritegames.findIndex((x:any)=>x == item?.id)) > -1) ? true : false} isAdvice={false} />
          </Pressable>
        </ArticleListContainer>
     
    )
  };

  const DATA = [
    {
      id: 1,
      title: t('actScreensugacttxt'),
      data: suggestedGames
    },
    {
      id: 2,
      title: t('actScreenotheracttxt'),
      data: otherGames
    }
  ];
  const memoizedValue = useMemo(() => SuggestedActivities, [SuggestedActivities,DATA]);

  const HeadingComponent = React.memo(({ section }:any) => {
    const maxWidthpercent = section?.id == 1 && activeChild.isPremature === 'true' ? '60%' : '90%';
    return (
      <ArticleHeading>
        <View style={styles.activityHeadingView}>
          <Heading3 numberOfLines={1} style={[styles.customHeading3,{maxWidth:maxWidthpercent}]}>{section.title}</Heading3>
          {section?.id == 1 && activeChild.isPremature === 'true' ? (
            <Pressable style={styles.pressableHeading} onPress={():any => setModalVisible1(true)}>
              <PrematureTagActivity>
                <Heading5Bold numberOfLines={1}>{t('actScreenprematureText')}</Heading5Bold>
              </PrematureTagActivity>
            </Pressable>
          ) : null}
        </View>
      </ArticleHeading>
    )
  });

  return (
    <>
      <OverlayLoadingComponent loading={loading} />
      <View style={styles.containerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        {/* <ScrollView nestedScrollEnabled={true}> */}
        <TabScreenHeader
          title={t('actScreenheaderTitle')}
          headerColor={headerColor}
          textColor="#000"
          setProfileLoading={setProfileLoading}
        />
        <FlexCol>
          <View style={styles.ageBracketView}>
            <AgeBrackets
              itemColor={headerColorBlack}
              activatedItemColor={headerColor}
              currentSelectedChildId={currentSelectedChildId}
              showSelectedBracketData={showSelectedBracketData}
              ItemTintColor={backgroundColor}
            />
          </View>

          <DividerAct></DividerAct>
          <ActivitiesCategories
            borderColor={headerColor}
            filterOnCategory={setFilteredActivityData}
            fromPage={fromPage}
            filterArray={filterArray}
            onFilterArrayChange={onFilterArrayChange}
          />
          <DividerAct></DividerAct>

          <FlexCol>
            {showNoData == true && suggestedGames?.length == 0 && otherGames?.length == 0 ?
              <Heading4Center>{t('noDataTxt')}</Heading4Center>
              : null}
            
            <SectionList
              sections={DATA}
              // ref={flatListRef}
              ref={(ref:any):any => (sectionListRef = ref)}
              keyExtractor={(item: any, index: any):any => String(item?.id) + String(index)}
              stickySectionHeadersEnabled={false}
              // initialNumToRender={4}
              // renderItem={({ item, title }) => <Item item={item} title={title}/>}
              removeClippedSubviews={true} // Unmount components when outside of window 
              initialNumToRender={4} // Reduce initial render amount
              maxToRenderPerBatch={4} // Reduce number in each render batch
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              // renderItem={({ item, section, index }) => <SuggestedActivities item={item} section={section.id} index={index} />}
              renderItem={memoizedValue}
              renderSectionHeader={({ section }):any => (
                section.data.length > 0 ?
                  <HeadingComponent section={section} />
                  // <Text style={styles.header}>{section.title}</Text> 
                  : null
              )}
            />

          </FlexCol>
        </FlexCol>
        <FirstTimeModal modalVisible={modalVisible} setIsModalOpened={setIsModalOpened} modalScreenKey={modalScreenKey} modalScreenText={modalScreenText}></FirstTimeModal>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={():any => {
            setModalVisible1(false);
          }}
          onDismiss={():any => {
            setModalVisible1(false);
          }}>
          <PopupOverlay>
            <ModalPopupContainer>
              <PopupCloseContainer>
                <PopupClose
                  onPress={():any => {
                    setModalVisible1(false);
                  }}>
                  <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
              </PopupCloseContainer>
              <ModalPopupContent>
                <Heading4Centerr>
                  {t('childSetupprematureMessageNext')}
                </Heading4Centerr>
              </ModalPopupContent>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
        <OverlayLoadingComponent loading={profileLoading}/>
      </View>
    </>
  );
};

export default Activities;
