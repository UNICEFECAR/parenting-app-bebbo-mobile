import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Heading4, Heading4Regular, Heading5, ShiftFromBottom5, ShiftFromTop5, ShiftFromTopBottom10, Heading4Centerr } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, View, Text, Modal } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import { ButtonTextSmLineL } from './shared/ButtonGlobal';
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
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';

// const videoarticleType = {

// }

const ChilDevelopmentCollapsibleItem = (props: any) => {
  const {item, VideoArticlesData, ActivitiesData, sendMileStoneDatatoParent, currentSelectedChildId} = props;
  // console.log(item);
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
  const [selVideoArticleData, setselVideoArticleData] = useState();
  const [selActivitiesData, setselActivitiesData] = useState();
  // useFocusEffect(
  //   React.useCallback(() => {
    useEffect(() => {
      // console.log("collapsible usefocuseffect",item);
      if(item?.toggleCheck == true)
      {
        setToggleCheckBox(true);
      }else {
        setToggleCheckBox(false);
      }
      const fetchData = async () => {
        setselVideoArticleData(VideoArticlesData.filter((x:any) => x.id == 2296)[0]);
        // setselVideoArticleData(VideoArticlesData.filter((x:any) => x.id == item?.related_video_articles[0])[0]);
        setselActivitiesData(ActivitiesData.filter((x:any) => x.id == item?.related_activities[0])[0]);
        if(selActivitiesData && selActivitiesData?.cover_image && selActivitiesData?.cover_image?.url != "")
        {   
            let imageArray = [];
            imageArray.push({
                srcUrl: selActivitiesData?.cover_image.url, 
                destFolder: RNFS.DocumentDirectoryPath + '/content', 
                destFilename: selActivitiesData?.cover_image.url.split('/').pop()
            })
            const imagesDownloadResult = await downloadImages(imageArray);
            // console.log(imagesDownloadResult,"--imagesDownloadResult");
        }
        if(selVideoArticleData && selVideoArticleData?.cover_image && selVideoArticleData?.cover_image?.url != "")
        {   
            let imageArray = [];
            imageArray.push({
                srcUrl: selVideoArticleData?.cover_image.url, 
                destFolder: RNFS.DocumentDirectoryPath + '/content', 
                destFilename: selVideoArticleData?.cover_image.url.split('/').pop()
            })
            const imagesDownloadResult = await downloadImages(imageArray);
            // console.log(imagesDownloadResult,"--imagesDownloadResult");
        }
        
      }
      fetchData()
    }, []);
  //   },[])
  // );
  console.log((selVideoArticleData),"--selActivitiesData---",selActivitiesData);
  // console.log(encodeURI("file://" + destinationFolder + (selVideoArticleData?.cover_image?.url.split('/').pop())));
  const milestoneCheckUncheck = async () => {
    // console.log(activeChilduuid,"--checked mielstone---",item);
    const filterQuery = 'uuid == "'+activeChilduuid+'"';
    // console.log("filterQuery--",filterQuery);
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
              <ShiftFromBottom5>
              <Heading4>{t('developScreenmileStone')}</Heading4>
             </ShiftFromBottom5>
              <FDirRow>
                
                {selVideoArticleData && selVideoArticleData?.cover_video && selVideoArticleData?.cover_video?.url != "" ? 
                  <>
                    <Pressable style={{flex: 1, width: '100%', height: 50, marginRight:10}} onPress={() => openVideo(selVideoArticleData)}>
                      <Image
                        // source={require('@assets/trash/card1.jpeg')}
                        source={selVideoArticleData?.cover_image && selVideoArticleData?.cover_video?.url != "" ? {uri : encodeURI("file://" + destinationFolder + (selVideoArticleData?.cover_image?.url.split('/').pop()))} : require('@assets/trash/defaultArticleImage.png')}
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
                      source={{html: item.body}}
                      baseFontStyle={{fontSize: 14}}
                    />
                    : null 
                  }
                  </ShiftFromBottom5>
                  {/* uncomment this for related article */}
                  {item && item.related_articles && item.related_articles.length > 0 ?
                    <Pressable onPress={() => gotoArticle(item.related_articles)}>
                      <ButtonTextSmLineL>
                        {t('developScreenrelatedArticleText')}
                      </ButtonTextSmLineL>
                    </Pressable>
                    : null }
                </Flex5>
              </FDirRow>
            </ShiftFromTopBottom10>
            <DividerDev></DividerDev>
            
              <ShiftFromTopBottom10>
              <ShiftFromBottom5>
              <Heading4>{t('developScreenrelatedAct')}</Heading4>
             </ShiftFromBottom5>
              <FDirRow>
              { selActivitiesData && selActivitiesData?.cover_image && selActivitiesData?.cover_image?.url != "" ? 
              <>
                {/* <Text>{"file://" + destinationFolder + (selActivitiesData?.cover_image?.url.split('/').pop())}</Text> */}
                  <Image
                      // source={require('@assets/trash/card1.jpeg')}
                      source={{uri : encodeURI("file://" + destinationFolder + (selActivitiesData?.cover_image?.url.split('/').pop()))}}
                      // source={{uri : encodeURI("file:///data/user/0/com.parentbuddyapp/files/content/istra%25C5%25BEivanje%2520u%2520igri%2520konstruktorima.jpg")}}
                      style={{flex: 1, width: '100%', height: 50, borderRadius: 5, marginRight:10}}
                      resizeMode={'cover'}
                    />
                    </>
                  : null
              }
                <Flex5>
                <ShiftFromBottom5>
                <Heading5>
                    {selActivitiesData?.title}
                  </Heading5>
                  </ShiftFromBottom5>
                  {selActivitiesData ?
                    <Pressable onPress={() => gotoActivity(selActivitiesData)}>
                      <ButtonTextSmLineL>
                        {t('developScreenviewDetails')}
                      </ButtonTextSmLineL>
                    </Pressable>
                    : null}
                </Flex5>
              </FDirRow>
            </ShiftFromTopBottom10>
            
          </>
        ) : null}
    </DevelopmentBox>
      <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                console.log("onRequestClose clicked");
            // Alert.alert('Modal has been closed.');
            //   setModalVisible(!modalVisible);
            }}
            onDismiss={() => {
                console.log("onDismiss clicked");
            //   setModalVisible(!modalVisible);
            }}>
            <PopupOverlay>
            <ModalPopupContainer>
                <PopupCloseContainer>
                <PopupClose
                    onPress={() => {
                    // setModalVisible(!modalVisible);
                    console.log("close clicked");
                    setModalVisible(!modalVisible);
                    }}>
                    <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
                </PopupCloseContainer>
                <ModalPopupContent>
                  <VideoPlayer selectedPinnedArticleData={selVideoArticleData}></VideoPlayer>
                </ModalPopupContent>
                
                <FDirRow>
                {/* <ButtonModal
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <ButtonText>{t('continueInModal')}</ButtonText>
                </ButtonModal> */}
                </FDirRow>

            </ModalPopupContainer>
            </PopupOverlay>
        </Modal>
    </MainContainer>
    </>
  );
};
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
