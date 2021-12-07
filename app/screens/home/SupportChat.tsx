import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { FlexCol,FlexDirCol} from '@components/shared/FlexBoxStyle';
import TabScreenHeader from '@components/TabScreenHeader';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1, Heading3Center, Heading4Bold, Heading4Center, Heading4Regular, Heading5BoldW } from '@styles/typography';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import styled from 'styled-components/native';
import botAvatarImage from '../../assets/avatar.png';
import { ToolBoxText, ToolPress } from '@components/shared/HomeScreenStyle';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import { addSpaceToHtml } from '../../services/Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setchatBotData } from '../../redux/reducers/childSlice';
import { useFocusEffect } from '@react-navigation/core';
import ChatBot from './ChatBot';
type SupportChatNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SupportChatNavigationProp;
};

const ChatbotJson = {
  "helloMessage": "Hello ‘name’, my name is Bebbo. I'm here to answer your questions",
  "selectAreaOfInterest": "Please select the area of interest from which you have a question",
  "question1": "What is your question about? ",
  "question2": "Please select from the following questions",
  "question3": "Please select from the following options to continue",
  "question4": "I do not have any further questions",
  "question5": "Explore … (name of subcategory) ",
  "question6": "Back to start",
  "question7": "Back to… ( name of category)",
  "question8": "Here is our experts advice",
  "question9": "Read more",
  "question10": "Learn more about this topic",
  "question11": "Have you found what you were looking for?",
  "question12": "No, I haven’t",
  "question13": "Yes, I have",
  "question14": "Thank you for using the chatbot.  Please come visit me again if you have other questions.  Goodbye!",
  "question15": "Exit the Chatbot",
  "question16": "I am sorry you could not find an answer to your question.  Please select one of the following options:",
  "question17": "Give us feedback",
  "question18": "Not now"
}
const subCategoryStepId = 2;
const faqsStepId = 3;
const expertAdviceId = 4;
const explorecatstep = 1;
const exploresubcatstep = 2;

// const ChatBot2 = (props: any) => {
//   const {steps,stepsjson,categorySelection,dynamicStepSelection,backToStep,backToHomeScreen} = props
//   return (
//     // <>
//     <View style={{flex:1}} key={steps.length}>
//       { steps.map((x: any,i: any)=>{
//               return (
//                 <>
//                  { x.showNextStep==true ? 
//                     <>
//                       <BotBubble key={'b'+x.id+'-'+i} message={x.message} steps={x} /> 
//                       {
//                         x.answer ? 
//                           <UserBubble key={'u'+x.id+'-'+x.answer.value} message={x.answer.label} steps={x} />
//                           : 
//                           <>
//                             {x.options && x.options.length > 0 ? 
//                               x.options.map((y:any,i2:any) => {
//                                 return(
//                                   <OptionBubble key={'o'+i+'-'+i2} optionval = {y} optionindex={i2} stepindex={i} steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToHomeScreen={backToHomeScreen}/>
//                                 )
//                               })
//                             : null}
//                             {x && x.actions && x.actions.length > 0 ? 
//                                x.actions.map((y:any,i2:any) => {
//                                  return(
//                                    <ActionBubble key={'a'+i+'-'+i2} actionval = {y} actionindex={i2} stepindex={i} steps={steps} stepsjson={stepsjson} backToStep={backToStep} backToHomeScreen={backToHomeScreen} />
//                                  )
//                                })
//                              : null}
//                            </>
//                       }
//                     </>
//                     : null 
//                   }
//                 </>
//               )
//             })
//           }
//       </View>
//     // </>
//   )
// }



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
  const chatBotData = useAppSelector((state: any) =>
    state.childData.childDataSet.chatBotData
  );
  const flatListRef = useRef(null);
  const [steps,setsteps] = useState<any>([]);


  var toString = Object.prototype.toString;
  function deepCopy(obj:any) {
      var rv;

      switch (typeof obj) {
          case "object":
              if (obj === null) {
                  // null => null
                  rv = null;
              } else {
                  switch (toString.call(obj)) {
                      case "[object Array]":
                          // It's an array, create a new array with
                          // deep copies of the entries
                          rv = obj.map(deepCopy);
                          break;
                      case "[object Date]":
                          // Clone the date
                          rv = new Date(obj);
                          break;
                      case "[object RegExp]":
                          // Clone the RegExp
                          rv = new RegExp(obj);
                          break;
                      // ...probably a few others
                      default:
                          // Some other kind of object, deep-copy its
                          // properties into a new object
                          rv = Object.keys(obj).reduce(function(prev, key) {
                              prev[key] = deepCopy(obj[key]);
                              return prev;
                          }, {});
                          break;
                  }
              }
              break;
          default:
              // It's a primitive, copy via assignment
              rv = obj;
              break;
      }
      return rv;
  }

  // const ChatBot3 = React.memo(({item, index}) => {
  //   //console.log("renderArticleItem-",index)
  //   return(
  //       <View style={{flex:1}} key={index}> 
  //         { item.showNextStep==true ? 
  //           <>
  //             <BotBubble key={'b'+item.id+'-'+index} message={item.message} steps={item} /> 
  //             {
  //               item.answer ? 
  //                 <UserBubble key={'u'+item.id+'-'+item.answer.value} message={item.answer.label} steps={item} />
  //                 : 
  //                 <>
  //                   {item.options && item.options.length > 0 ? 
  //                     item.options.map((y:any,i2:any) => {
  //                       return(
  //                         <OptionBubble key={'o'+index+'-'+i2} optionval = {y} optionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToHomeScreen={backToHomeScreen}/>
  //                       )
  //                     })
  //                   : null}
  //                   {item && item.actions && item.actions.length > 0 ? 
  //                       item.actions.map((y:any,i2:any) => {
  //                         return(
  //                           <ActionBubble key={'a'+index+'-'+i2} actionval = {y} actionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} backToStep={backToStep} backToHomeScreen={backToHomeScreen} />
  //                         )
  //                       })
  //                     : null}
  //                   </>
  //             }
  //           </>
  //           : null 
  //         }
  //       </View>
  //   ) 
  // });

  const categorySelection = (stepIndex: any,optionIndex: any,steps2: any) => {
    console.log(steps2,"categorySelection--",optionIndex,stepIndex);
    let localsteps = deepCopy(steps2);
    // let localsteps = steps2.map(a => ({...a,...a.options,...a.actions}));
    // let localsteps = Object.assign([],steps2);
    console.log("---localsteps--",localsteps);
    //changing answer value from null to option value
    localsteps[stepIndex].answer = localsteps[stepIndex].options[optionIndex];
    //changing showNextStep to true of the nextStep id
    let nextstepid = localsteps[stepIndex].nextStep;
    // let index = localsteps.findIndex(el => el.id == nextstepid);
    const index = localsteps.reduce((acc: any, el: any, i: any) => (
        el.id === nextstepid ? i : acc
    ), -1);
    localsteps[index].showNextStep = true;
    if(nextstepid == subCategoryStepId) {
      //setting options for nextStepId
      const subcat = taxonomy.chatbot_subcategory.filter((x:any)=>x.parent_category_id == localsteps[stepIndex].options[optionIndex].value);
      const subcat2 = subcat.map((x: any,i: any) => {
        return {...x,label : x.name,value : x.id,nextStepFunc : categorySelection}
      });
      localsteps[index].options = subcat2;
    }else if(nextstepid == faqsStepId) {
      const faqsoption = faqsData ? faqsData.filter((x:any)=>x.chatbot_subcategory == localsteps[stepIndex].options[optionIndex].value) : [];
      const faqsoption2 = faqsoption.map((x: any,i: any) => {
        return {...x,label : x.question,value : x.id,nextStepFunc : categorySelection}
      });
      localsteps[index].options = faqsoption2;
      const indexForText = localsteps.reduce((acc: any, el: any, i: any) => (
          el.id === explorecatstep ? i : acc
      ), -1);
      localsteps[index].actions[1].label = t('backToCategoryTxt',{categoryName:localsteps[indexForText].answer.label})
    }else if(nextstepid == expertAdviceId) {
      localsteps[index].textToShow = localsteps[stepIndex].options[optionIndex];
      localsteps[index+1].showNextStep = true;
      const indexForText = localsteps.reduce((acc: any, el: any, i: any) => (
          el.id === explorecatstep ? i : acc
      ), -1);
      const indexForText2 = localsteps.reduce((acc: any, el: any, i: any) => (
          el.id === exploresubcatstep ? i : acc
      ), -1);
      localsteps[index+1].actions[0].label = t('backToSubCategoryTxt',{subCategoryName:localsteps[indexForText].answer.label})
      localsteps[index+1].actions[1].label = t('backToSubCategoryTxt',{subCategoryName:localsteps[indexForText2].answer.label})
    }
    console.log("updated localsteps--",localsteps);
    setsteps(localsteps);

    dispatch(setchatBotData(localsteps));
    // AsyncStorage.setItem('chatBotData',JSON.stringify(steps));
  }
  const dynamicStepSelection = (stepIndex: any,optionIndex: any,steps2: any) => {
    // let localsteps = [...steps2];
    let localsteps = deepCopy(steps2);
    localsteps[stepIndex].answer = localsteps[stepIndex].options[optionIndex];
    let nextstepid = localsteps[stepIndex].options[optionIndex].nextStepval;
    const index = localsteps.reduce((acc: any, el: any, i: any) => (
        el.id === nextstepid ? i : acc
    ), -1);
    localsteps[index].showNextStep = true;
    setsteps(localsteps);

    dispatch(setchatBotData(localsteps));
    // AsyncStorage.setItem('chatBotData',JSON.stringify(steps));
  }
  
  const category = taxonomy.chatbot_category.map((x:any,i:any)=> {
    return {...x,label : x.name,value : x.id,nextStepFunc : categorySelection}
    // return {...x,label : x.name,value : i,trigger : '3'}
  });
  console.log("--category---",category);
  const backToStep = (stepIndex:any,actionIndex:any,steptogoto: number,currentstep: number,steps2: any,stepsjson2:any) => {
    console.log(steptogoto,"--stepnumber",currentstep);
    // let localsteps = [...steps2];
    // let localstepsjson = [...stepsjson2];
    let localsteps = deepCopy(steps2);
    let localstepsjson = deepCopy(stepsjson2);
    //changing answer value from null to action value
    localsteps[stepIndex].answer = localsteps[stepIndex].actions[actionIndex];
    //get steptogoto index and get all item from json from that index till end.
    // let index = stepsjson.findIndex(el => el.id == steptogoto);
    const index = localstepsjson.reduce((acc: any, el: any, i: any) => (
      el.id === steptogoto ? i : acc
  ), -1);
  console.log("index is --",index);
    localstepsjson = localstepsjson.slice(index,localstepsjson.length);
    console.log(localsteps,"---stepsjson---",localstepsjson);
    const updatedsteps = [...localsteps,...localstepsjson]
    console.log("merged--",updatedsteps);
    setsteps((updatedsteps));

    dispatch(setchatBotData(updatedsteps));
    // AsyncStorage.setItem('chatBotData',JSON.stringify(updatedsteps));
    // if(steptogoto == 0) {
    //   // updatedjson.map(x=>x.answer = null);
    //   console.log(steps,"--updatedjson---",stepsjson);
    //   // console.log("afteradding all again2--",[...steps,...updatedjson]);
    // }
  }
  const backToHomeScreen = () => {
    //navigate to home screen.
    //ask if history needs to be cleared.
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'HomeDrawerNavigator',
        },
      ],
    });
  }
  
  const stepsjson = [
    {
      id: 0,
      message: t('helloMessage',{parentName:userNameData?.length > 0 ? userNameData[0].value : t('childInfoParentText')}),
      delay:500,
      userInput:false,
      showNextStep:true,
      nextStep: 1,
      answer:null
    },
    {
      id: 1,
      message: t('selectAreaOfInterest'),
      options:category,
      userInput: true,
      showNextStep:true,
      nextStep:2,
      answer:null
    },
    {
      id: 2,
      message: t('question1'),
      options:[],
      actions:[{value:0,label:t('backtoStarttxt'),nextStepFunc:backToStep,nextStepval:0}],
      userInput: true,
      showNextStep:false,
      nextStep:3,
      answer:null,
    },
    {
      id: 3,
      message: t('question2'),
      options:[],
      actions:[{value:1,label:t('backtoStarttxt'),nextStepFunc:backToStep,nextStepval:0},{value:2,label:t('backToCategoryTxt'),nextStepFunc:backToStep,nextStepval:1}],
      userInput: true,
      showNextStep:false,
      nextStep:4,
      answer:null,
    },
    {
      id: 4,
      message: t('hereIsExportAdviceTxt'),
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
      options:[{value:100,label:t('donthavequestiontxt'),nextStepFunc:categorySelection}],
      actions:[{value:3,label:t('backToSubCategoryTxt'),nextStepFunc:backToStep,nextStepval:1},{value:4,label:t('backToSubCategoryTxt'),nextStepFunc:backToStep,nextStepval:2},{value:5,label:t('backtoStarttxt'),nextStepFunc:backToStep,nextStepval:0}],
      userInput: true,
      showNextStep:false,
      nextStep:6,
      answer:null,
    },
    {
      id: 6,
      message: t('question4'),
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
      options:[],
      actions:[{value:7,label:t('feedbackLinkTxt'),nextStepFunc:backToHomeScreen,nextStepval:0},{value:8,label:t('notNowTxt'),nextStepFunc:dynamicStepSelection,nextStepval:9}],
      userInput: true,
      showNextStep:false,
      nextStep:9,
      answer:null,
    },
    {
      id: 9,
      message: t('thankYouTxt'),
      options:[],
      actions:[{value:9,label:t('exitchatBotTxt'),nextStepFunc:backToHomeScreen,nextStepval:0}],
      userInput: true,
      showNextStep:false,
      nextStep:9,
      answer:null,
      end:true
    },
  ];
  useFocusEffect(
    React.useCallback(() => {
    console.log("steps changed--",steps);
  },[steps])
  );
  useEffect(() => {
    return () => {
      console.log("in return");
      setsteps([])
    };
  }, []);
  useEffect(() => {
    // console.log("steps updated--",steps);
    // const category = taxonomy.chatbot_category.map((x:any,i:any)=> {
    //   return {...x,label : x.name,value : x.id,nextStepFunc : categorySelection}
    //   // return {...x,label : x.name,value : i,trigger : '3'}
    // });
    async function fetchData() {
      console.log(chatBotData,"--category in fetch3",stepsjson);
      // const savedData = await AsyncStorage.getItem('chatBotData');
      if(chatBotData && chatBotData.length > 0) {
        console.log("savedData4---",chatBotData);
        console.log("savedData4---",(chatBotData)[1].options[0]);
        setsteps((stepsjson));
      }else {
        setsteps((stepsjson));
        // AsyncStorage.setItem('chatBotData',JSON.stringify(stepsjson));
        //dispatch(setchatBotData(stepsjson));
      }
    }
    fetchData()    
    
  }, []);
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
        />
        {/* <ScrollView> */}
          <FlexCol style={{backgroundColor:'grey',width:'100%',padding:10}}>
          {/* <ScrollView contentContainerStyle={{ padding: 0, paddingTop: 0 }}> */}
            {/* <ChatBot steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToStep={backToStep} backToHomeScreen={backToHomeScreen}/> */}
            {steps.length> 0 ? 
                // <InfiniteScrollList filteredData ={filteredData} renderArticleItem = {renderArticleItem} receivedLoadingArticle={receivedLoadingArticle}/> 
                <FlatList
                  ref={flatListRef}
                  data={steps}
                  onScroll={(e)=>{
                    // if(keyboardStatus==true){
                    //   Keyboard.dismiss();
                    // }
                  }}
                  nestedScrollEnabled={true}
                  // keyboardDismissMode={"on-drag"}
                  // keyboardShouldPersistTaps='always'
                  removeClippedSubviews={true} // Unmount components when outside of window 
                  initialNumToRender={4} // Reduce initial render amount
                  maxToRenderPerBatch={4} // Reduce number in each render batch
                  updateCellsBatchingPeriod={100} // Increase time between renders
                  windowSize={7} // Reduce the window size
                  renderItem={({item, index}) => <ChatBot item={item} index={index} steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToStep={backToStep} backToHomeScreen={backToHomeScreen}  />  }
                  keyExtractor={(item,index) => index.toString()}
                  />
                : <Heading4Center>{t('noDataTxt')}</Heading4Center>}
            {/* </ScrollView> */}
          </FlexCol>
      </View>
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
    // marginTop:10
    // width:'80%',
    // maxWidth:80,
    // minHeight:30
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
    // width:'80%',
    // maxWidth:80,
    // minHeight:30
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
    // width:'80%',
    // maxWidth:80,
    // minHeight:30
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
    // width:'80%',
    // maxWidth:80,
    // minHeight:30
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
// const styles = StyleSheet.create({
//   rootContainer: {
//     paddingTop:20
//   },
//   footerkeyboardstyle: {
//     display: 'none'
//   },
//   avatarStyle:{

//   },
//   avatarWrapperStyle:{
//     backgroundColor: 'transparent',
//     borderWidth:0
//   },
//   bubbleStyle:{
//     flex: 1, 
//     flexDirection: 'row',
//     backgroundColor:'#f7f7f7',
//     fontFamily:'roboto-bold',
//     borderTopLeftRadius:4,
//     borderTopRightRadius:4,
//     borderBottomRightRadius:4,
//     borderBottomLeftRadius:4,
//     minWidth:'82%',
//     paddingTop:17,
//     paddingBottom:17,
//     marginBottom:15
//   },
//   optionStyle: {
//     width:'80%',
//     backgroundColor:'#fff',
//     borderTopLeftRadius:4,
//     borderTopRightRadius:4,
//     borderBottomRightRadius:4,
//     borderBottomLeftRadius:4,
//     borderWidth:1,
//     borderColor:'#2B2F84',
//     marginLeft:50
//   },
//   optionElementStyle:{
//     backgroundColor:'#fff',    
//   },
//   userBubbleStyle: {
//     flex: 1, 
//     flexDirection: 'row',
//     backgroundColor:'#2B2F84',
//     borderTopLeftRadius:4,
//     borderTopRightRadius:4,
//     borderBottomRightRadius:4,
//     borderBottomLeftRadius:4
//   }
// });