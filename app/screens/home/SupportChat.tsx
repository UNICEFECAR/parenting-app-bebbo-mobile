import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { FDirRow, FlexCol} from '@components/shared/FlexBoxStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1Centerr, Heading4Center } from '@styles/typography';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ImageBackground, Linking, Modal, Platform, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setchatBotData } from '../../redux/reducers/childSlice';
import ChatBot from './ChatBot';
import ChatContainer from '@components/shared/SupportChatStyle';
import ModalPopupContainer, { ModalPopupContent, PopupClose, PopupCloseContainer, PopupOverlay } from '@components/shared/ModalPopupStyle';
import Icon from '@components/shared/Icon';
import HTML from 'react-native-render-html';
import { addSpaceToHtml } from '../../services/Utils';
import { ButtonModal, ButtonText } from '@components/shared/ButtonGlobal';
import analytics from '@react-native-firebase/analytics';
import { CHATBOT_CATEGORY_SELECTED, CHATBOT_FAQ_SELECTED, CHATBOT_SUBCATEGORY_SELECTED, FEEDBACK_SUBMIT } from '@assets/data/firebaseEvents';

type SupportChatNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SupportChatNavigationProp;
};

const subCategoryStepId = 2;
const faqsStepId = 3;
const expertAdviceId = 4;
const explorecatstep = 1;
const exploresubcatstep = 2;
const delayOfSteps = 2000;
const delayOfConcurrentSteps = 2500;
const SupportChat = ({ navigation }: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.PRIMARY_COLOR;
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
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
      ? allConfigData.filter((item:any) => item.key === 'userName')
      : [];
const taxonomy = useAppSelector(
  (state: any) =>
    (state.utilsData.taxonomy?.allTaxonomyData != "" ? JSON.parse(state.utilsData.taxonomy?.allTaxonomyData) : {}),
);
const faqsData = useAppSelector((state: any) =>
    state.utilsData.faqsData != ''
      ? JSON.parse(state.utilsData.faqsData)
      : state.utilsData.faqsData,
  );
  function parseWithFunctions(obj: any) {
    return JSON.parse(obj, (k, v) => {
      if (typeof v === 'string' && k == 'nextStepFunc') {
        return eval(v);
      }
      return v;
    });
  };
  const chatBotData = useAppSelector((state: any) =>
  state.childData.childDataSet.chatBotData != '' ? parseWithFunctions(state.childData.childDataSet.chatBotData) : state.childData.childDataSet.chatBotData
  );
  const [profileLoading,setProfileLoading] = React.useState(false);
  const surveryData = useAppSelector((state: any) =>
    state.utilsData.surveryData != ''
      ? JSON.parse(state.utilsData.surveryData)
      : state.utilsData.surveryData,
  );
  const feedbackItem = surveryData.find((item:any) => item.type == "feedback")
  const [steps,setsteps] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const flatListRef = useRef(null);
  const noDataStep = () => {

  }
  const categorySelection = (stepIndex: any,optionIndex: any,steps2: any) => {
    let localsteps = [...steps2];
    //changing answer value from null to option value
    localsteps[stepIndex].answer = localsteps[stepIndex].options[optionIndex];
    //changing showNextStep to true of the nextStep id
    let nextstepid = localsteps[stepIndex].nextStep;
    const index = localsteps.reduce((acc: any, el: any, i: any) => (
        el.id === nextstepid ? i : acc
    ), -1);
    localsteps=localsteps.map(item=>({ ...item, delay: 0 }));
    localsteps[index].delay = delayOfSteps;
    localsteps[index].showNextStep = true;
    if(nextstepid == subCategoryStepId) {
      //setting options for nextStepId
      analytics().logEvent(CHATBOT_CATEGORY_SELECTED+"_"+localsteps[stepIndex].options[optionIndex].value);
      const subcat = taxonomy.chatbot_subcategory.filter((x:any)=>x.parent_category_id == localsteps[stepIndex].options[optionIndex].value);
      const subcat2 = subcat.map((x: any,i: any) => {
        return {...x,label : x.name,value : x.id,nextStepFunc : categorySelection}
      });
      localsteps[index].options = subcat2;
      
    }else if(nextstepid == faqsStepId) {
      analytics().logEvent(CHATBOT_SUBCATEGORY_SELECTED+"_"+localsteps[stepIndex].options[optionIndex].value);
      const faqsoption = faqsData ? faqsData.filter((x:any)=>x.chatbot_subcategory == localsteps[stepIndex].options[optionIndex].value) : [];
      const faqsoption2 = faqsoption.map((x: any,i: any) => {
        return {...x,label : x.question,value : x.id,nextStepFunc : categorySelection}
      });
      if(faqsoption2.length <=0) {
        faqsoption2.push({value:110,label:t('noDataTxt'),nextStepFunc:noDataStep,nextStepval:1})
      }
      localsteps[index].options = faqsoption2;
      const indexForText = localsteps.reduce((acc: any, el: any, i: any) => (
          el.id === explorecatstep ? i : acc
      ), -1);
      localsteps[index].actions[1].label = t('backToCategoryTxt',{categoryName:localsteps[indexForText].answer.label});
      
    }else if(nextstepid == expertAdviceId) {
      localsteps[index].textToShow = localsteps[stepIndex].options[optionIndex];
      const indexForText = localsteps.reduce((acc: any, el: any, i: any) => (
          el.id === explorecatstep ? i : acc
      ), -1);
      const indexForText2 = localsteps.reduce((acc: any, el: any, i: any) => (
          el.id === exploresubcatstep ? i : acc
      ), -1);
      analytics().logEvent(CHATBOT_FAQ_SELECTED,{faq_Id:localsteps[index].textToShow.id,faq_Subcategory_Id:localsteps[indexForText2].answer.value});
      localsteps[index+1].actions[0].label = t('backToSubCategoryTxt',{subCategoryName:localsteps[indexForText2].answer.label})
      localsteps[index+1].actions[1].label = t('backToSubCategoryTxt',{subCategoryName:localsteps[indexForText].answer.label})
    }
    updateChatBotData(localsteps);
    if(nextstepid == expertAdviceId) {
      showdynamicdelay(localsteps,index);
    }
  }

  const showdynamicdelay=(stepobj: any[],index: number) => {
    setTimeout(() => {
      let localsteps = [...stepobj]
      localsteps=localsteps.map(item=>({ ...item, delay: 0 }));
      localsteps[index+1].delay = delayOfSteps;
      localsteps[index+1].showNextStep = true;
      updateChatBotData(localsteps);
    },delayOfSteps);
  }
  const dynamicStepSelection = (stepIndex: any,optionIndex: any,steps2: any) => {
    let localsteps = [...steps2];
    localsteps[stepIndex].answer = localsteps[stepIndex].options[optionIndex];
    let nextstepid = localsteps[stepIndex].options[optionIndex].nextStepval;
    const index = localsteps.reduce((acc: any, el: any, i: any) => (
        el.id === nextstepid ? i : acc
    ), -1);
    localsteps=localsteps.map(item=>({ ...item, delay: 0 }));
    localsteps[index].delay = delayOfSteps;
    localsteps[index].showNextStep = true;
    updateChatBotData(localsteps);
  }
  
  const category = taxonomy.chatbot_category.map((x:any,i:any)=> {
    return {...x,label : x.name,value : x.id,nextStepFunc : categorySelection}
  });
  const backToStep = (stepIndex:any,actionIndex:any,steptogoto: number,currentstep: number,steps2: any,stepsjson2:any) => {
    let localsteps = [...steps2];
    let localstepsjson = [...steps2];
    //changing answer value from null to action value
    localsteps[stepIndex].answer = localsteps[stepIndex].actions[actionIndex];
    //get steptogoto index and get all item from json from that index till end.
    const index = localstepsjson.reduce((acc: any, el: any, i: any) => (
      el.id === steptogoto ? i : acc
  ), -1);
    //loop through object need to update later
    localstepsjson = localstepsjson.slice(index,localstepsjson.length);
    localstepsjson = localstepsjson.map(item=>({ ...item, showNextStep: false,answer:null,delay:0 }));
    localstepsjson[0].delay = delayOfSteps;
    localstepsjson[0].showNextStep = true;
    localsteps=localsteps.map(item=>({ ...item, delay: 0 }));
    const updatedsteps = [...localsteps,...localstepsjson]
    updateChatBotData(updatedsteps);
  }
  const backToHomeScreen = (stepIndex:any,actionIndex:any,steptogoto: number,currentstep: number,steps2: any,stepsjson2:any) => {
    //navigate to home screen.
    //ask if history needs to be cleared.
    let localsteps = [...steps2];
    let localstepsjson = [...stepsjson2];
    localsteps[stepIndex].answer = localsteps[stepIndex].actions[actionIndex];
    localsteps=localsteps.map(item=>({ ...item, delay: 0 }));
    localstepsjson = localstepsjson.slice(1,localstepsjson.length);
    localstepsjson[0].showNextStep = true;
    const updatedsteps = [...localsteps,...localstepsjson];
    dispatch(setchatBotData(updatedsteps));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeDrawerNavigator',
        },
      ],
    });
  }
  const showFeedbackLink = (stepIndex: any,optionIndex: any,steps2: any) => {
    setModalVisible(true);
    let localsteps = [...steps2];
    localsteps[stepIndex].answer = localsteps[stepIndex].options[optionIndex];
    let nextstepid = localsteps[stepIndex].options[optionIndex].nextStepval;
    const index = localsteps.reduce((acc: any, el: any, i: any) => (
        el.id === nextstepid ? i : acc
    ), -1);
    localsteps=localsteps.map(item=>({ ...item, delay: 0 }));
    localsteps[index].delay = delayOfSteps;
    localsteps[index].showNextStep = true;
    updateChatBotData(localsteps);
  }
  const stepsjson = [
    {
      id: 0,
      message: t('helloMessage',{parentName:userNameData?.length > 0 ? ' '+userNameData[0].value : ''}),
      delay:delayOfSteps,
      userInput:false,
      showNextStep:true,
      nextStep: 1,
      answer:null
    },
    {
      id: 1,
      message: t('selectAreaOfInterest'),
      delay:delayOfSteps,
      options:category,
      userInput: true,
      showNextStep:false,
      nextStep:2,
      answer:null
    },
    {
      id: 2,
      message: t('question1'),
      delay:0,
      options:[],
      actions:[{value:0,label:t('backtoStarttxt'),nextStepFunc:backToStep,nextStepval:1}],
      userInput: true,
      showNextStep:false,
      nextStep:3,
      answer:null,
    },
    {
      id: 3,
      message: t('question2'),
      delay:0,
      options:[],
      actions:[{value:1,label:t('backtoStarttxt'),nextStepFunc:backToStep,nextStepval:1},{value:2,label:t('backToCategoryTxt'),nextStepFunc:backToStep,nextStepval:2}],
      userInput: true,
      showNextStep:false,
      nextStep:4,
      answer:null,
    },
    {
      id: 4,
      message: t('hereIsExportAdviceTxt'),
      delay:0,
      options:[],
      actions:[],
      textToShow:'',
      userInput: true,
      showNextStep:false,
      nextStep:5,
      answer:null,
    },    
    {
      id: 5,
      message: t('question3'),
      delay:0,
      options:[{value:100,label:t('donthavequestiontxt'),nextStepFunc:categorySelection}],
      actions:[{value:3,label:t('backToSubCategoryTxt'),nextStepFunc:backToStep,nextStepval:3},{value:4,label:t('backToSubCategoryTxt'),nextStepFunc:backToStep,nextStepval:2},{value:5,label:t('backtoStarttxt'),nextStepFunc:backToStep,nextStepval:1}],
      userInput: true,
      showNextStep:false,
      nextStep:6,
      answer:null,
    },
    {
      id: 6,
      message: t('question4'),
      delay:0,
      options:[{value:101,label:t('answerFoundTxt'),nextStepFunc:dynamicStepSelection,nextStepval:7},{value:102,label:t('noNotFoundTxt'),nextStepFunc:dynamicStepSelection,nextStepval:8}],
      actions:[],
      userInput: true,
      showNextStep:false,
      nextStep:7,
      answer:null,
    },
    {
      id: 7,
      message: t('thankYouTxt'),
      delay:0,
      options:[],
      actions:[{value:6,label:t('exitchatBotTxt'),nextStepFunc:backToHomeScreen,nextStepval:0}],
      userInput: true,
      showNextStep:false,
      nextStep:7,
      answer:null,
    },
    {
      id: 8,
      message: t('sorryMsgTxt'),
      delay:0,
      options:[{value:103,label:t('feedbackLinkTxt'),nextStepFunc:showFeedbackLink,nextStepval:9},{value:104,label:t('notNowTxt'),nextStepFunc:dynamicStepSelection,nextStepval:9}],
      actions:[],
      userInput: true,
      showNextStep:false,
      nextStep:9,
      answer:null,
    },
    {
      id: 9,
      message: t('thankYouTxt'),
      delay:0,
      options:[],
      actions:[{value:9,label:t('exitchatBotTxt'),nextStepFunc:backToHomeScreen,nextStepval:0}],
      userInput: true,
      showNextStep:false,
      nextStep:9,
      answer:null,
      end:true
    },
  ];
  
  const updateChatBotData = (updatedData:any) => {
    setsteps(updatedData);
    dispatch(setchatBotData(updatedData));
  }
  useEffect(() => {
    setTimeout(() => {
      if(flatListRef && flatListRef.current && steps.length >0)  {
        flatListRef.current.scrollToIndex({ animated: true, index: steps.length-1, viewPosition:1 });
      }
    },0);
    setTimeout(() => {
      if(flatListRef && flatListRef.current && steps.length >0)  {
        flatListRef.current.scrollToIndex({ animated: true, index: steps.length-1, viewPosition:1 });
      }
    },delayOfConcurrentSteps);       
  }, [steps]);
  
  const setOnloadChatBotData = (chatBotData:any,stepsjson:any) => {
    if(chatBotData && chatBotData.length > 0) {
      setsteps((chatBotData));
    }else {
      setsteps((stepsjson));
      setTimeout(() => {
        let localstepsjson = [...stepsjson];
        localstepsjson[1].showNextStep = true;
        setsteps(localstepsjson);
      },delayOfConcurrentSteps); 
    }
  }
  useEffect(() => {
    async function fetchData() {
      setOnloadChatBotData(chatBotData,stepsjson);
    }
    fetchData()        
  }, []);
  const scrollToIndexFailed = (error) => {
      const offset = error.averageItemLength * error.index;
      flatListRef?.current?.scrollToOffset({offset});
      setTimeout(() => flatListRef?.current?.scrollToIndex({ index: error.index }), 10); // You may choose to skip this line if the above typically works well because your average item height is accurate.
  }
  return (
    <>
     <View style={{flex:1,backgroundColor:headerColor}}>
     <FocusAwareStatusBar
        animated={true}
        backgroundColor={headerColor}
       />
       <TabScreenHeader
          title={t('supportScreenheaderTitle')}
          headerColor={headerColor}
          textColor="#FFF"
          setProfileLoading={setProfileLoading}
        />
          <FlexCol>
          <ImageBackground 
            source={Platform.OS === 'android' ? require('@assets/svg/img-bg-chatbot.png') : require('@assets/svg/img-bg-chatbot-ios.png')} 
            resizeMode="repeat" style={{flex:1,width:'100%',height:'100%',backgroundColor:'#dbe9f6'}}>
              <ChatContainer>
                {steps.length> 0 ? 
                    <FlatList
                      ref={flatListRef}
                      data={steps}
                      onScroll={(e)=>{
                        // if(keyboardStatus==true){
                        //   Keyboard.dismiss();
                        // }
                      }}
                      nestedScrollEnabled={true}
                      initialScrollIndex={steps.length - 1}
                      // keyboardDismissMode={"on-drag"}
                      // keyboardShouldPersistTaps='always'
                      removeClippedSubviews={true} // Unmount components when outside of window 
                      initialNumToRender={75} // Reduce initial render amount
                      maxToRenderPerBatch={75} // Reduce number in each render batch
                      updateCellsBatchingPeriod={100} // Increase time between renders
                      windowSize={90} // Reduce the window size
                      renderItem={({item, index}) => <ChatBot item={item} index={index} steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToStep={backToStep} backToHomeScreen={backToHomeScreen} showFeedbackLink={showFeedbackLink} noDataStep={noDataStep} />  }
                      keyExtractor={(item,index) => index.toString()}
                      onScrollToIndexFailed={scrollToIndexFailed}
                      />
                    : <Heading4Center>{t('noDataTxt')}</Heading4Center>}

                </ChatContainer>
                </ImageBackground>
          </FlexCol>
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onDismiss={() => {
          setModalVisible(false);
        }}>
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            {feedbackItem ?
              <><ModalPopupContent>

                <Heading1Centerr>{feedbackItem?.title}</Heading1Centerr>

                {feedbackItem && feedbackItem?.body ?
                  <HTML
                    source={{ html: addSpaceToHtml(feedbackItem?.body)}}
                    ignoredStyles={['color', 'font-size', 'font-family']}
                  />
                  : null
                }

              </ModalPopupContent>
                <FDirRow>
                  <ButtonModal
                    onPress={() => {
                      setModalVisible(false);
                      analytics().logEvent(FEEDBACK_SUBMIT)
                      Linking.openURL(feedbackItem?.survey_feedback_link)
                    }}>
                    <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                  </ButtonModal>
                </FDirRow>
              </>
              : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
      <OverlayLoadingComponent loading={profileLoading}/>
    </>
  );
};

export default SupportChat;

const styles = StyleSheet.create({
  botStyle : {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor:'#fff',
    padding:10,
    margin:5,
    marginBottom:10,
    marginRight:50,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
    borderBottomRightRadius:4,
    borderBottomLeftRadius:4,
    paddingTop:17,
    paddingBottom:17,
  },
  userStyle : {
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor:'#2B2F84',
    padding:10,
    margin:5,
    marginBottom:10,
    marginLeft:50,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
    borderBottomRightRadius:4,
    borderBottomLeftRadius:4,
    paddingTop:17,
    paddingBottom:17,
    // width:'80%',
    // maxWidth:80,
    // minHeight:30
  },
  optionStyle : {
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor:'#fff',
    padding:10,
    margin:5,
    marginBottom:10,
    borderWidth:2,
    borderColor:'#2B2F84',
    marginLeft:50,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
    borderBottomRightRadius:4,
    borderBottomLeftRadius:4,
    paddingTop:17,
    paddingBottom:17,
  },
  actionStyle : {
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor:'#F7F6F4',
    padding:10,
    margin:5,
    marginBottom:10,
    borderWidth:2,
    borderColor:'#000',
    marginLeft:50,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
    borderBottomRightRadius:4,
    borderBottomLeftRadius:4,
    paddingTop:17,
    paddingBottom:17,
  },
  textStyle : {
    flex:1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor:'#fff',
    padding:10,
    margin:5,
    marginTop:0,
    marginBottom:10,
    marginRight:50,
    borderTopLeftRadius:4,
    borderTopRightRadius:4,
    borderBottomRightRadius:4,
    borderBottomLeftRadius:4,
    paddingTop:17,
    paddingBottom:17,
  },
  imageContainer: {
    marginTop: 6,
    marginRight: 6,
    marginBottom: 10,
    marginLeft: 6,
    paddingTop: 2,
    paddingRight: 2,
    paddingBottom: 2,
    paddingLeft: 2,
    backgroundColor: '#fff',
    borderTopRightRadius: 21,
    borderTopLeftRadius: 21,
    borderBottomRightRadius: 21,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  imageStyle: {
    height: 40,
    width: 40,
    borderRadius: 21,
  }
});