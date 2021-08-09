import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import ActivitiesCategories from '@components/ActivitiesCategories';
import AgeBrackets from '@components/AgeBrackets';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ActivityBox, ArticleHeading, ArticleListContainer, ArticleListContent } from '@components/shared/ArticlesStyle';
import { ButtonTextSmLine } from '@components/shared/ButtonGlobal';
import RNFS from 'react-native-fs';
import { MainContainer } from '@components/shared/Container';
import { DividerAct } from '@components/shared/Divider';
import FirstTimeModal from '@components/shared/FirstTimeModal';
import { FDirCol, FDirRow, FlexCol, FlexDirRow, FlexDirRowSpace } from '@components/shared/FlexBoxStyle';
import PrematureTag, { PrematureTagActivity } from '@components/shared/PrematureTag';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading3, Heading4, Heading4Center, Heading5Bold, Heading6Bold, ShiftFromTop5, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from '../../../services/ImageLoad';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet, Text, View
} from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import downloadImages from '../../../downloadImages/ImageStorage';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import { DefaultImage } from '@components/shared/Image';
type ActivitiesNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  route:any
  navigation: ActivitiesNavigationProp;
};
const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '2',
    imagePath: require('@assets/trash/card2.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '3',
    imagePath: require('@assets/trash/card3.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '4',
    imagePath: require('@assets/trash/card4.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '5',
    imagePath: require('@assets/trash/card5.jpeg'),
    title: 'General recommendations for overweight and obese infants',
  },
  {
    id: '6',
    imagePath: require('@assets/trash/card6.jpeg'),
    title: 'Picking stuff around',
  },
];
const ContainerView = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.ACTIVITIES_TINTCOLOR};
`;

const Activities = ({ route,navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const flatListRef = React.useRef()
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ACTIVITIES_COLOR;
  const backgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const headerColorBlack = themeContext.colors.PRIMARY_TEXTCOLOR;
  const fromPage = 'Activities';
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const ActivitiesData = useAppSelector(
    (state: any) =>
      state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
  );
  const activityCategoryData = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
  );
  const renderIndicator = (progress:any, indeterminate:any) => (<Text>{indeterminate ? 'Loading..' : progress * 100}</Text>);
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
  const [loading, setLoading] = useState(false);
  const [filteredData,setfilteredData] = useState([]);
  const [showNoData,setshowNoData] = useState(false);
  const setIsModalOpened = async (varkey: any) => {
    if(modalVisible == true)
    {
      let obj = {key: varkey, value: false};
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  useFocusEffect(() => {
    console.log("in activity focuseffect without callback",activityModalOpened);
    setModalVisible(activityModalOpened);
  })

  const toTop = () => {
    // use current
    flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
}
  useFocusEffect(
    React.useCallback(() => {
      // console.log("useFocusEffect called");
      setLoading(true);
      // setModalVisible(true);
      console.log("in usefocuseffect ",route.params);
      async function fetchData() {
          if(route.params?.categoryArray)
          {
            // console.log(route.params?.categoryArray);
            setFilterArray(route.params?.categoryArray);
            setFilteredActivityData(route.params?.categoryArray);
          }
          else {
            setFilterArray([]);
            setFilteredActivityData([]);
          }
      }
      if(route.params?.backClicked != 'yes')
      {
        fetchData()
      }

    },[selectedChildActivitiesData,route.params?.categoryArray])
  );

  const showSelectedBracketData = async (item: any) => {
    console.log("in showSelectedBracketData--",item);
    if(route.params?.backClicked == 'yes')
    {
      navigation.setParams({backClicked:'no'})
    }
    setCurrentSelectedChildId(item.id);
    let filteredData = ActivitiesData.filter((x: any) => x.child_age.includes(item.id));
    // filteredData =filteredData.map( item => ({ ...item, name:item.name }) )
    console.log("filteredData---",filteredData);
    setSelectedChildActivitiesData(filteredData);
    // console.log(filteredData?.length);
    if(filteredData?.length>0){
      filteredData.map(async (item: any, index: number) => {
        if (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined) {
          if (await RNFS.exists(destinationFolder + '/' + item['cover_image']?.url.split('/').pop())) {
          }
          else{
          let imageArray:any=[];
          imageArray.push({
              srcUrl: item['cover_image'].url, 
              destFolder: destinationFolder, 
              destFilename: item['cover_image'].url.split('/').pop()
          })
          const imagesDownloadResult = await downloadImages(imageArray);
          console.log(imagesDownloadResult,"..imagesDownloadResult..");
        }
        }
        });
        // console.log(imageArray,"..imageArray..");
       
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      // console.log("child dev usefocuseffect");
      console.log("in usefocuseffect ",route.params);
      if(route.params?.backClicked != 'yes')
      {
        setshowNoData(false);
        if(route.params?.currentSelectedChildId && route.params?.currentSelectedChildId != 0)
        {
          // console.log(route.params?.categoryArray);
          const firstChildDevData = childAge.filter((x:any)=> x.id == route.params?.currentSelectedChildId);
          // console.log("firstChildDevData---",firstChildDevData);
          showSelectedBracketData(firstChildDevData[0]);
        }
        else {
          const firstChildDevData = childAge.filter((x:any)=> x.id == activeChild?.taxonomyData.id);
          console.log("firstChildDevData---",firstChildDevData);
          showSelectedBracketData(firstChildDevData[0]);
        }
      }
      
    }, [activeChild?.uuid,languageCode,route.params?.currentSelectedChildId])
  );
  useFocusEffect(
    React.useCallback(() => {
      
      return () => {
        // setModalVisible(false);
        // setFilterArray([]);
        // setCurrentSelectedChildId(0);
        // setSelectedChildActivitiesData([]);
        // setsuggestedGames([]);
        // setotherGames([]);
        // setLoading(false);
        // setfilteredData([]);
        // setshowNoData(false);
        console.log("in unmount-",route.params?.currentSelectedChildId);
        navigation.setParams({backClicked:'no'})
          if(route.params?.currentSelectedChildId)
          {
            navigation.setParams({currentSelectedChildId:0})
            // route.params?.currentSelectedChildId = 0;
          }
          if(route.params?.categoryArray)
          {
            navigation.setParams({categoryArray:[]})
            // route.params?.currentSelectedChildId = 0;
          }
      };
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      // console.log("child dev usefocuseffect");
      setsuggestedGames(filteredData.filter((x: any) => x.related_milestone.length > 0));
      setotherGames(filteredData.filter((x: any) => x.related_milestone.length == 0));
      console.log("filteredData inner---",filteredData);
    }, [filteredData])
  );
  const setFilteredActivityData = (itemId:any) => {
    console.log(itemId,"articleData in filtered ",selectedChildActivitiesData);
    if(route.params?.backClicked == 'yes')
    {
      navigation.setParams({backClicked:'no'})
    }
    if(selectedChildActivitiesData && selectedChildActivitiesData.length > 0 && selectedChildActivitiesData != [])
    {
      console.log("in if");
      if(itemId.length>0)
      {
        const newArticleData = selectedChildActivitiesData.filter((x:any)=> itemId.includes(x.activity_category));
        setfilteredData(newArticleData);
        setLoading(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 2000);
      }else {
        const newArticleData = selectedChildActivitiesData.length > 0 ? selectedChildActivitiesData : [];
        setfilteredData(newArticleData);
        setLoading(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 2000);
      }
    }
    else {
      setfilteredData([]);
        setLoading(false);
        setTimeout(() => {
          setshowNoData(true);
        }, 2000);
    }
    toTop();
  }
  const goToActivityDetail = (item:typeof filteredData[0]) => {
      console.log(selectedChildActivitiesData,"--selectedChildActivitiesData");
    navigation.navigate('DetailsScreen',
    {
      fromScreen:"Activities",
      headerColor:headerColor,
      backgroundColor:backgroundColor,
      detailData:item,
      listCategoryArray: filterArray,
      selectedChildActivitiesData: selectedChildActivitiesData,
      currentSelectedChildId: currentSelectedChildId
    });
  };
  // console.log(filteredData,"--filteredData");
  // console.log(suggestedGames,"--suggestedGames");
  // console.log(otherGames,"--otherGames");
  
  const onFilterArrayChange = (newFilterArray: any) => {
    console.log("on filterarray change",newFilterArray);
    // filterArray = [...newFilterArray];
      setFilterArray(newFilterArray)
    // console.log("on filterarray change after",filterArray)
  }
  const renderActivityItem = (item: any, index: number) => (
    <Pressable onPress={() => { goToActivityDetail(item)}} key={index}>
      <ArticleListContainer>
        {/* <Image
          style={styles.cardImage}
          source={item.imagePath}
          resizeMode={'cover'}
        /> */}
        {/* <ProgressiveImage
          thumbnailSource={require('@assets/trash/defaultArticleImage.png')}
          source={item.cover_image ? { uri: "file://" + destinationFolder + item.cover_image.url.split('/').pop() } : require('@assets/trash/defaultArticleImage.png')}
          style={styles.cardImage}
          resizeMode="cover"
        /> */}
         {
        (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined)?
       
  //       <ImageLoad
  //  style={styles.cardImage}
  //  placeholderStyle={styles.cardImage}
  //   loadingStyle={{ size: 'large', color: '#000' }}
  //   //source={{uri : encodeURI("file://" + destinationFolder + item.cover_image.url.split('/').pop())}}
  //   source={{uri :  encodeURI("file://" + destinationFolder + item.cover_image.url.split('/').pop())}}
  //   />
  <Image 
  renderIndicator={renderIndicator}
  source={{uri :  "file://" + destinationFolder + item.cover_image.url.split('/').pop()}}
  indicator={null}
  renderError={(err:any) => {
    console.log(err,"..err")
     return (<DefaultImage source={require('@assets/trash/defaultArticleImage.png')} style={styles.cardImage} />) 
}}
  indicatorProps={{
    size: 'large',
    borderWidth: 0,
    color: '#000',
  }}
  style={styles.cardImage}
  />
    :<DefaultImage
    style={styles.cardImage}
    source={require('@assets/trash/defaultArticleImage.png')}/>
   }
        <ArticleListContent>
          <ShiftFromTopBottom5>
            <Heading6Bold>{activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name}</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{item.title}</Heading3>
        </ArticleListContent>

        <ShareFavButtons isFavourite={false} backgroundColor={'#FFF'} />
      </ArticleListContainer>
    </Pressable>
  );
  const SuggestedActivities = (item: any, index: number) => (
    <Pressable onPress={() => { goToActivityDetail(item)}} key={index}>
      <ArticleListContainer>
        {/* <Image
          style={styles.cardImage}
          source={require('@assets/trash/card5.jpeg')}
          resizeMode={'cover'}
        /> */}
        {/* <ProgressiveImage
          thumbnailSource={require('@assets/trash/defaultArticleImage.png')}
          source={item.cover_image ? { uri: "file://" + destinationFolder + item.cover_image.url.split('/').pop() } : require('@assets/trash/defaultArticleImage.png')}
          style={styles.cardImage}
          resizeMode="cover"
        /> */}
        {
        (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined)?
  //       <ImageLoad
  //  style={styles.cardImage}
  //  placeholderStyle={styles.cardImage}
  //   loadingStyle={{ size: 'large', color: '#000' }}
  //   //source={{uri : encodeURI("file://" + destinationFolder + item.cover_image.url.split('/').pop())}}
  //   source={{uri:encodeURI("file://" + destinationFolder + item.cover_image.url.split('/').pop())}}
  //   />
 
  <Image 
  renderIndicator={renderIndicator}
  source={{uri:encodeURI("file://" + destinationFolder + item.cover_image.url.split('/').pop())}}
  indicator={null}
  renderError={(err:any) => { 
    console.log(err,"..err")
    return (<DefaultImage source={require('@assets/trash/defaultArticleImage.png')} style={styles.cardImage} />) 
}}
  indicatorProps={{
    size: 'large',
    borderWidth: 0,
    color: '#000',
  }}
  style={styles.cardImage}
  />
    :
    <DefaultImage
    style={styles.cardImage}
    source={require('@assets/trash/defaultArticleImage.png')}/>
   }
        <ArticleListContent>
          <ShiftFromTopBottom5>
            <Heading6Bold>{activityCategoryData.filter((x: any) => x.id == item.activity_category)[0].name}</Heading6Bold>
          </ShiftFromTopBottom5>
          <Heading3>{item.title}</Heading3>
          {/* keep below code ActivityBox for future use */}
          {/* <ActivityBox>
          <View>
            <Heading6Bold>
              {t('actScreenpendingMilestone')} {t('actScreenmilestones')}
            </Heading6Bold>
            <ShiftFromTop5>
            <Heading4>{'Laugh at Human face'}</Heading4>
            </ShiftFromTop5>
          </View>
          <View>
            <ButtonTextSmLine>
              {t('actScreentrack')} {t('actScreenmilestones')}
            </ButtonTextSmLine>
          </View>
        </ActivityBox> */}
        </ArticleListContent>
        <ShareFavButtons isFavourite={false} backgroundColor={'#FFF'} />
      </ArticleListContainer>
    </Pressable>
  );
  const ContentThatGoesAboveTheFlatList = () => {

    return (
      <>
        <View style={{}}>
          {suggestedGames && suggestedGames?.length > 0 ?
            <>
              <ArticleHeading>
                <FlexDirRowSpace>
                  <Heading3>{t('actScreensugacttxt')}</Heading3>
                  {activeChild.isPremature === 'true' ? (
                    <PrematureTagActivity>
                      <Heading5Bold>{t('actScreenprematureText')}</Heading5Bold>
                    </PrematureTagActivity>
                  ) : null}
                </FlexDirRowSpace>
              </ArticleHeading>

              <FlatList
                data={suggestedGames}
                renderItem={({ item, index }) => SuggestedActivities(item, index)}
                keyExtractor={(item) => item.id.toString()}
              />
              {/* {otherGames && otherGames?.length > 0 ?
                <ArticleHeading>
                  <Heading3>{t('actScreenotheracttxt')}</Heading3>
                </ArticleHeading>
                :null} */}
            </>
            : null
          }
          {otherGames && otherGames?.length > 0 ?
            <ArticleHeading>
              <Heading3>{t('actScreenotheracttxt')}</Heading3>
            </ArticleHeading>
          :null}
        </View>

      </>
    );
  };
  
  return (
    <>
      <ContainerView>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        {/* <ScrollView nestedScrollEnabled={true}> */}
        <TabScreenHeader
          title={t('actScreenheaderTitle')}
          headerColor={headerColor}
          textColor="#000"
        />
        <FlexCol>
        <View style={{backgroundColor:'#fff'}}>
        {/* {currentSelectedChildId && currentSelectedChildId != 0 ? */}
          <AgeBrackets
            itemColor={headerColorBlack}
            activatedItemColor={headerColor}
            currentSelectedChildId={currentSelectedChildId}
            showSelectedBracketData={showSelectedBracketData}
            ItemTintColor={backgroundColor}
          />
          {/* : null} */}
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
                { showNoData == true && suggestedGames?.length == 0 && otherGames?.length == 0 ?
                  <Heading4Center>{t('noDataTxt')}</Heading4Center>
                :null}
                <FlatList
                  ref={flatListRef}
                  data={otherGames}
                  renderItem={({ item, index }) => renderActivityItem(item, index)}
                  keyExtractor={(item) => item.id.toString()}
                  ListHeaderComponent={ContentThatGoesAboveTheFlatList}
                // ListFooterComponent={ContentThatGoesBelowTheFlatList}
                />
                
              
          </FlexCol>
        </FlexCol>
        <FirstTimeModal modalVisible={modalVisible} setIsModalOpened={setIsModalOpened} modalScreenKey={modalScreenKey} modalScreenText={modalScreenText}></FirstTimeModal>
      </ContainerView>
    </>
  );
};

export default Activities;

const styles = StyleSheet.create({
  cardImage: {
    height: 200,
    width: '100%',
    flex: 1,
    alignSelf: 'center',
  },
});
