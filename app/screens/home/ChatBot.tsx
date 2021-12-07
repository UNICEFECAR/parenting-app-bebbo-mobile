import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from "react-native";
import { useTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import { addSpaceToHtml } from '../../services/Utils';
import { Heading1, Heading3Center, Heading4Bold, Heading4Center, Heading4Regular, Heading5BoldW } from '@styles/typography';

const BotBubble = (props:any) =>{
    const { message,steps} = props;
    const {t} = useTranslation();
    const [answer2visible, setanswer2visible] = useState(false);
    return (
      <>
        {/* <View style={{flex:1,flexDirection: 'row'}}>
          <Image  
            style={styles.imageStyle}
              source={
                require('@assets/svg/logo_chatbot.svg')
              }
          />
        </View> */}
        <View style={styles.botStyle}>
        <Heading4Regular style={[{flex: 7,textAlignVertical:'center'}]}>{message}</Heading4Regular>
        </View>
        {steps && steps.textToShow && steps.textToShow.answer_part_1 && steps.textToShow.answer_part_1 != '' ?
          <>
            {/* <Heading4Regular style={[{flex: 7,textAlignVertical:'center'}]}>{steps.textToShow.answer_part_1}</Heading4Regular> */}
            <HTML
              source={{ html: addSpaceToHtml(steps.textToShow.answer_part_1)}}
              baseFontStyle={{ fontSize: 14 }}
              ignoredStyles={['color', 'font-size', 'font-family']}
            />
            {steps && steps.textToShow && steps.textToShow.answer_part_2 && steps.textToShow.answer_part_2 != '' && answer2visible == false ? 
                <Pressable
                style={{
                  flexDirection: 'row',
                  flex: 1
                }}
                onPress={() => {
                  //show answer 2
                  setanswer2visible(true)
                }}>
                <Heading4Bold style={[{flex: 7,textAlignVertical:'center'}]}>
                  {t('readMoreTxt')}
                </Heading4Bold>
              </Pressable>
            : null}
              {answer2visible == true ? 
                <HTML
                  source={{ html: addSpaceToHtml(steps.textToShow.answer_part_2)}}
                  baseFontStyle={{ fontSize: 14 }}
                  ignoredStyles={['color', 'font-size', 'font-family']}
                />
              : null}
              {steps && steps.textToShow && steps.textToShow.related_article && steps.textToShow.related_article != 0 && answer2visible == true ?
                  <Pressable
                  style={{
                    flexDirection: 'row',
                    flex: 1
                  }}
                  onPress={() => {
                    //show article related steps.textToShow.related_article
                    
                  }}>
                  <Heading4Bold style={[{flex: 7,textAlignVertical:'center'}]}>
                    {t('learnMoreLinkTxt')}
                  </Heading4Bold>
                </Pressable>
              : null}
            </>
          : null
        }
      </>
    )
  }
  const UserBubble = (props:any) =>{
    const { message,steps} = props
    return (
      <>
        <View style={styles.userStyle}>
        <Heading5BoldW style={[{flex: 7,textAlignVertical:'center'}]}>{message}</Heading5BoldW>
        </View>
      </>
    )
  }
  const OptionBubble = (props:any) =>{
    const { optionval,optionindex,stepindex,steps,categorySelection,dynamicStepSelection,backToHomeScreen} = props
    return (
      <>
        <View style={styles.optionStyle}>
          <Pressable
            style={{
              flexDirection: 'row',
              flex: 1
            }}
            onPress={() => {
              optionval.nextStepFunc && optionval?.nextStepFunc(stepindex,optionindex,steps)
            }}>
            <Heading4Bold style={[{flex: 7,textAlignVertical:'center'}]}>
              {optionval?.label}
            </Heading4Bold>
            {/* <Icon
              style={{flex: 1, textAlign: 'right', alignSelf: 'center'}}
              name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            /> */}
          </Pressable>
          </View>
      </>
    )
  }
  const ActionBubble = (props:any) =>{
    const { actionval,actionindex,stepindex,steps,stepsjson,backToStep,backToHomeScreen} = props
    return (
      <>
        <View style={styles.actionStyle}>
          <Pressable
            style={{
              flexDirection: 'row',
              flex: 1
            }}
            onPress={() => {
              actionval?.nextStepFunc(stepindex,actionindex,actionval.nextStepval,steps[stepindex].id,steps,stepsjson)
            }}>
            <Heading4Bold style={[{flex: 7,textAlignVertical:'center'}]}>
              {actionval?.label}
            </Heading4Bold>
            {/* <Icon
              style={{flex: 1, textAlign: 'right', alignSelf: 'center'}}
              name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            /> */}
          </Pressable>
          </View>
      </>
    )
  }
  

const ChatBot = (props:any) => {
    console.log("chatbot----",props)
    const { item,index,steps,stepsjson,categorySelection,dynamicStepSelection,backToStep,backToHomeScreen} = props;
    return(
        <View style={{flex:1}} key={index}> 
          { item.showNextStep==true ? 
            <>
              <BotBubble key={'b'+item.id+'-'+index} message={item.message} steps={item} /> 
              {
                item.answer ? 
                  <UserBubble key={'u'+item.id+'-'+item.answer.value} message={item.answer.label} steps={item} />
                  : 
                  <>
                    {item.options && item.options.length > 0 ? 
                      item.options.map((y:any,i2:any) => {
                        return(
                          <OptionBubble key={'o'+index+'-'+i2} optionval = {y} optionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToHomeScreen={backToHomeScreen}/>
                        )
                      })
                    : null}
                    {item && item.actions && item.actions.length > 0 ? 
                        item.actions.map((y:any,i2:any) => {
                          return(
                            <ActionBubble key={'a'+index+'-'+i2} actionval = {y} actionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} backToStep={backToStep} backToHomeScreen={backToHomeScreen} />
                          )
                        })
                      : null}
                    </>
              }
            </>
            : null 
          }
        </View>
    ) 
  };

  export default React.memo(ChatBot);

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