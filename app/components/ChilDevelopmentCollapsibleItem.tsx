import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading3,Heading4, Heading4Regular, Heading5, ShiftFromBottom5,ShiftFromBottom10, ShiftFromTop5, ShiftFromTopBottom10, Heading4Centerr } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View,Dimensions, Text, Modal } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import { ButtonTextSmLineL,ButtonTextMdLineL } from './shared/ButtonGlobal';
import Checkbox, { CheckboxDevActive, CheckboxItem } from './shared/CheckboxStyle';
import { MainContainer } from './shared/Container';
import { DevelopmentBox } from './shared/DevelopmentStyle';
import { DividerDev } from './shared/Divider';
import { FDirRow, Flex5 } from './shared/FlexBoxStyle';
import Icon from './shared/Icon';
import VideoPlayer from './VideoPlayer';
import RNFS from 'react-native-fs';
import downloadImages from '../downloadImages/ImageStorage';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import HTML from 'react-native-render-html';
import ModalPopupContainer, {
  ModalPopupContent,
  ModalPopupContainerVideo,
  ModalPopupContentVideo,
  PopupCloseVideo,
  PopupCloseContainer,
  PopupOverlay,
  PopupOverlayVideo
} from '@components/shared/ModalPopupStyle';
import { isFutureDate } from '../services/childCRUD';
import { removeParams } from '../services/Utils';
// const videoarticleType = {

// }

const ChilDevelopmentCollapsibleItem = React.memo((props: any) => {
  const {item, VideoArticlesData, ActivitiesData, sendMileStoneDatatoParent, currentSelectedChildId,activeChilduuidnew} = props;
  // console.log(item,"---item---");
  // console.log(ActivitiesData);
  const navigation = useNavigation();
  const {t}= useTranslation()
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const themeContext = useContext(ThemeContext);
  const actHeaderColor = themeContext.colors.ACTIVITIES_COLOR;
  const actBackgroundColor = themeContext.colors.ACTIVITIES_TINTCOLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const activeChilduuid = useAppSelector((state: any) =>
  state.childData.childDataSet.activeChild != ''
    ? JSON.parse(state.childData.childDataSet.activeChild).uuid
    : [],
);
const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const [selVideoArticleData, setselVideoArticleData] = useState();
  const [selActivitiesData, setselActivitiesData] = useState();
  const [selVideoImage, setselVideoImage] = useState('');
  const [selActivityImage, setselActivityImage] = useState('');
  // useFocusEffect(
  //   React.useCallback(() => {
    useEffect(() => {
      // console.log(item.id,"collapsible usefocuseffect",item?.toggleCheck);
      if(item?.toggleCheck == true)
      {
        setToggleCheckBox(true);
      }else {
        setToggleCheckBox(false);
      }
      const fetchData = async () => {
        //setselVideoArticleData(VideoArticlesData.filter((x:any) => x.id == 2296)[0]);
        setselVideoImage('');
        setselActivityImage('')
        const currVideoArtData = VideoArticlesData.filter((x:any) => x.id == item?.related_video_articles[0])[0];
        setselVideoArticleData(currVideoArtData);
        const currActivityData = ActivitiesData.filter((x:any) => x.id == item?.related_activities[0])[0];
        setselActivitiesData(currActivityData);
        console.log(currActivityData?.cover_image?.url,"----url");
        if(currActivityData && currActivityData?.cover_image && currActivityData?.cover_image?.url != "")
        {   
          let imageName=removeParams(currActivityData?.cover_image?.url.split('/').pop());
          console.log(imageName,"..imageName..");
            let imageArray = [];
            imageArray.push({
                srcUrl: currActivityData?.cover_image?.url, 
                destFolder: RNFS.DocumentDirectoryPath + '/content', 
                // destFilename: currActivityData?.cover_image?.url.split('/').pop()
                destFilename:imageName
            })
            const imagesDownloadResult = await downloadImages(imageArray);
            if (await RNFS.exists(destinationFolder + '/' + imageName)) {
              console.log("selActivityImage in if ",selActivityImage);
           //   setselActivityImage(encodeURI("file://" + destinationFolder + currActivityData?.cover_image?.url.split('/').pop()));
              setselActivityImage(encodeURI("file://" + destinationFolder + imageName));
            }else {
             console.log("selActivityImage in else ",selActivityImage);
            setselActivityImage('');
            }
            // console.log(imagesDownloadResult,"--imagesDownloadResult");
        }
        if(currVideoArtData && currVideoArtData?.cover_image && currVideoArtData?.cover_image?.url != "")
        {   
          let imageName=removeParams(currVideoArtData?.cover_image?.url.split('/').pop());
          console.log(imageName,"..imageName..");
       
            let imageArray = [];
            imageArray.push({
                srcUrl: currVideoArtData?.cover_image?.url, 
                destFolder: RNFS.DocumentDirectoryPath + '/content', 
              //  destFilename: currVideoArtData?.cover_image?.url.split('/').pop()
                destFilename: imageName
                
            })
            const imagesDownloadResult = await downloadImages(imageArray);
            if (await RNFS.exists(destinationFolder + '/' + imageName)) {
              // console.log("Image already exists");
              setselVideoImage(encodeURI("file://" + destinationFolder + imageName));
            }else {
            //  console.log("Image already exists");
              setselVideoImage('');
            }
            // console.log(imagesDownloadResult,"--imagesDownloadResult");
        }
        
      }
      fetchData()
    }, [item]);
  //   },[])
  // );
  // console.log((selVideoArticleData),"--selActivitiesData---",selActivitiesData);
  // console.log(encodeURI("file://" + destinationFolder + (selVideoArticleData?.cover_image?.url.split('/').pop())));
  const milestoneCheckUncheck = async () => {
    // console.log(activeChilduuid,"--checked mielstone---",item);
    const filterQuery = 'uuid == "'+activeChilduuid+'"';
    // console.log("filterQuery child dev--",filterQuery);
    setToggleCheckBox(!toggleCheckBox);
    sendMileStoneDatatoParent(item,!toggleCheckBox);
    const updatemilestone = await userRealmCommon.updateChildMilestones<ChildEntity>(ChildEntitySchema,item?.id,filterQuery);
  }
  const gotoArticle =(articleId: any[])=>{
    // 3626
    console.log("currentSelectedChildId---",currentSelectedChildId)
    navigation.navigate('DetailsScreen',
    {
      fromScreen:"MileStone",
      headerColor:artHeaderColor,
      backgroundColor:artBackgroundColor,
      detailData:articleId[0],
      currentSelectedChildId: currentSelectedChildId
    });
  }
  const gotoActivity =(activityData)=>{
    console.log("activityData--",activityData);
    navigation.navigate('DetailsScreen',
    {
      fromScreen:"MileStoneActivity", //ChildDevelopment
      headerColor:actHeaderColor,
      backgroundColor:actBackgroundColor,
      detailData:activityData,
      // listCategoryArray: filterArray,
      selectedChildActivitiesData: currentSelectedChildId,
      currentSelectedChildId: currentSelectedChildId
    });
  }
  const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    
  const openVideo = (videoArticle) => {
    console.log("openVideo---",videoArticle);
    setModalVisible(!modalVisible)
  }
  return (
    <>
    <MainContainer key={item.id}>
    <DevelopmentBox>
    <View style={{flex: 1, flexDirection: 'row'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection:'row',
            }}>
            <Pressable
              disabled={isFutureDate(activeChild?.birthDate)}
              onPress={() => {
                milestoneCheckUncheck();
              }}>
              <CheckboxItem>
                <View>
                  {toggleCheckBox ? (
                    <CheckboxDevActive>
                      <Icon name="ic_tick" size={12} color="#000" />
                    </CheckboxDevActive>
                  ) : (
                    <Checkbox style={{borderWidth: 1}}></Checkbox>
                  )}
                </View>
              </CheckboxItem>
            </Pressable>
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              flex: 1
            }}
            onPress={() => {
              setIsOPen(!isOPen);
            }}>
            <Heading4Regular style={[{flex: 7,textAlignVertical:'center'}]}>
              {item?.title}
            </Heading4Regular>
            <Icon
              style={{flex: 1, textAlign: 'right', alignSelf: 'center'}}
              name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            />
          </Pressable>
        </View>
        {isOPen ? (
          <>
          <ShiftFromTop5></ShiftFromTop5>
            <ShiftFromTopBottom10>
              <ShiftFromBottom10>
              <Heading4>{t('developScreenmileStone')}</Heading4>
             </ShiftFromBottom10>
              <FDirRow style={{alignItems:'flex-start'}}>
                
                {selVideoArticleData && selVideoArticleData?.cover_video && selVideoArticleData?.cover_video?.url != "" ? 
                  <>
                    <Pressable style={{flex: 1, width: '100%', height: 50, marginRight:10}} onPress={() => openVideo(selVideoArticleData)}>
                      <Image
                        // source={require('@assets/trash/card1.jpeg')}
                        // source={selVideoArticleData.cover_image && selVideoArticleData?.cover_image?.url != "" ? {uri : encodeURI("file://" + destinationFolder + (selVideoArticleData?.cover_image?.url.split('/').pop()))} : require('@assets/trash/defaultArticleImage.png')}
                        source={selVideoImage != "" ? {uri : selVideoImage} : require('@assets/trash/defaultArticleImage.png')}
                        style={{flex: 1, width: '100%', height: 50, borderRadius: 5, marginRight:10}}
                        resizeMode={'cover'}
                      />
                    </Pressable>
                  </>
                  // <VideoPlayer selectedPinnedArticleData={selVideoArticleData}></VideoPlayer>
                  // <Heading4Regular style={{flex: 1}}>in if</Heading4Regular>
                  : null 
                  }
                <Flex5>
                <ShiftFromBottom5>
                  {/* <Heading5>
                    {selVideoArticleData?.title}
                  </Heading5> */}
                  {item && item.body ?
                    <HTML
                      source={{html: item.body.replace(/>\s+</g, '>&shy; <')}}
                      baseFontStyle={{fontSize: 14}}
                      ignoredStyles={['color', 'font-size', 'font-family','margin','padding']}
                      tagsStyles={{
                        p:{marginTop:0,},
                      }}
                    />
                    : null 
                  }
                  </ShiftFromBottom5>
                  {/* uncomment this for related article */}
                  {item && item.related_articles && item.related_articles.length > 0 ?
                    <Pressable onPress={() => gotoArticle(item.related_articles)}>
                      <ButtonTextSmLineL numberOfLines={2}>
                        {t('developScreenrelatedArticleText')}
                      </ButtonTextSmLineL>
                    </Pressable>
                    : null }
                </Flex5>
              </FDirRow>
            </ShiftFromTopBottom10>
            { selActivitiesData ?
              <>
                  <DividerDev></DividerDev>
                
                  <ShiftFromTopBottom10>
                  <ShiftFromBottom10>
                  <Heading4>{t('developScreenrelatedAct')}</Heading4>
                </ShiftFromBottom10>
                  <FDirRow>
                  { selActivitiesData && selActivitiesData?.cover_image && selActivitiesData?.cover_image?.url != "" ? 
                  <>
                    {/* <Text>{selActivityImage}</Text> */}
                      <Image
                          // source={require('@assets/trash/card1.jpeg')}
                          source={selActivityImage != "" ? {uri : selActivityImage} : require('@assets/trash/defaultArticleImage.png')}
                          style={{flex: 1, width: '100%', height: 50, borderRadius: 5, marginRight:10}}
                          resizeMode={'cover'}
                        />
                        </>
                      : null
                  }
                    <Flex5>
                    <ShiftFromBottom5>
                    <Heading4Regular>
                        {selActivitiesData?.title}
                      </Heading4Regular>
                      </ShiftFromBottom5>
                      {selActivitiesData ?
                        <Pressable onPress={() => gotoActivity(selActivitiesData)}>
                          <ButtonTextMdLineL numberOfLines={2}>
                            {t('developScreenviewDetails')}
                          </ButtonTextMdLineL>
                        </Pressable>
                        : null}
                    </Flex5>
                  </FDirRow>
                </ShiftFromTopBottom10>
                </> 
                : null }
            
          </>
        ) : null}
    </DevelopmentBox>
      <Modal
      style={{padding:0}}
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                console.log("onRequestClose clicked",modalVisible);
            // Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
            onDismiss={() => {
                console.log("onDismiss clicked");
            //   setModalVisible(!modalVisible);
            }}>
            <View style={{width:windowWidth,height:windowHeight, backgroundColor:'rgba(0,0,0,0.7)',

flexDirection:'row',

alignItems:'center',justifyContent:'center'}}>

  

 <VideoPlayer selectedPinnedArticleData={selVideoArticleData}></VideoPlayer>

 <PopupCloseContainer style={{width:windowWidth,height:windowHeight,position:'absolute',zIndex:-1,top:0,}}>

  <PopupCloseVideo style={{

    width:windowWidth,height:windowHeight, alignItems:'flex-start',justifyContent:'flex-end',padding:17

  }}

      onPress={() => {

      // setModalVisible(!modalVisible);

      console.log("close clicked");

      setModalVisible(!modalVisible);

      }}>

      <Icon name="ic_close" size={20} color="#fff" />

  </PopupCloseVideo>

  </PopupCloseContainer>

 </View>
        </Modal>
    </MainContainer>
    </>
  );
});
export default ChilDevelopmentCollapsibleItem;

const styles = StyleSheet.create({
  // item: {
  //   padding: 10,
  //   color: '#000',
  //   backgroundColor: '#FFF',
  //   // marginVertical: 8,
  //   marginHorizontal: 16,

  //   marginVertical: 5,
  // },
  title: {
    fontSize: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});