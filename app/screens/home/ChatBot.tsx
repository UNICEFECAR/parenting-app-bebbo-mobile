import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Image } from "react-native";
import { useTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import { addSpaceToHtml } from '../../services/Utils';
import { Heading1, Heading3Center, Heading4Bold, Heading4Center, Heading4Regular, Heading5BoldWh, SideSpacing15 } from '@styles/typography';
import { FlexCol, FlexRow } from '@components/shared/FlexBoxStyle';
import VectorImage from 'react-native-vector-image';
import { ButtonLinkPressLeft, ButtonTextMdLineL } from '@components/shared/ButtonGlobal';
import LinearGradient from 'react-native-linear-gradient';

const BotBubble = (props: any) => {
  const { message, steps, userNameData } = props;
  console.log("botbubble---", userNameData);
  const { t } = useTranslation();
  const [answer2visible, setanswer2visible] = useState(false);
  return (
    <FlexRow>
      <View style={styles.imageStyle}>
        <LinearGradient
          style={{ flex: 1, borderRadius: 100, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#2B2F84', '#1F50A0', '#00AEEF']}>
          <VectorImage style={{ width: 20, height: 20, borderRadius: 100 }} source={require('@assets/svg/logo_chatbot.svg')} />
        </LinearGradient>
      </View>
      <FlexCol style={{ backgroundColor: '#fff', marginBottom: 10, borderRadius: 4, overflow: 'hidden' }}>
        <View style={styles.botStyle}>
          <Heading4Bold style={[{ flex: 7, textAlignVertical: 'center' }]}>{message}</Heading4Bold>
        </View>
        {steps && steps.textToShow && steps.textToShow.answer_part_1 && steps.textToShow.answer_part_1 != '' ?
          <>
            {/* <Heading4Regular style={[{flex: 7,textAlignVertical:'center'}]}>{steps.textToShow.answer_part_1}</Heading4Regular> */}
            <View style={{ padding: 15, paddingTop: 5, paddingBottom: 5 }}>
              <HTML
                source={{ html: addSpaceToHtml(steps.textToShow.answer_part_1) }}
                baseFontStyle={{ fontSize: 14 }}
                ignoredStyles={['color', 'font-size', 'font-family']}
                tagsStyles={{
                  p: { marginBottom: 0, marginTop: 0, textAlign: 'left' },
                  // h1:{marginBottom:0,marginTop:10,textAlign:'left'},
                  // h2:{marginBottom:15,marginTop:0,textAlign:'left'},
                  // h3:{marginBottom:15,marginTop:0,textAlign:'left'},
                  // h4:{marginBottom:15,marginTop:0,textAlign:'left'},
                  // h5:{marginBottom:15,marginTop:0,textAlign:'left'},
                  // h6:{marginBottom:15,marginTop:0,textAlign:'left'},
                  // span:{marginBottom:15,marginTop:0,textAlign:'left'},
                  // li:{textAlign:'left'},
                  // br:{height:0},
                }}
              />
            </View>
            {steps && steps.textToShow && steps.textToShow.answer_part_2 && steps.textToShow.answer_part_2 != '' && answer2visible == false ?
              <SideSpacing15>
                <ButtonLinkPressLeft
                  onPress={() => {
                    //show answer 2
                    setanswer2visible(true)
                  }}>
                  <ButtonTextMdLineL >
                    {t('readMoreTxt')}
                  </ButtonTextMdLineL>
                </ButtonLinkPressLeft>
              </SideSpacing15>
              : null}
            {answer2visible == true ?
              <View style={{ padding: 15, paddingTop: 15, paddingBottom: 5 }}>
                <HTML
                  source={{ html: addSpaceToHtml(steps.textToShow.answer_part_2) }}
                  baseFontStyle={{ fontSize: 14 }}
                  ignoredStyles={['color', 'font-size', 'font-family']}
                  tagsStyles={{
                    p: { marginBottom: 0, marginTop: 0, textAlign: 'left' },
                  }}
                />
              </View>
              : null}
            {steps && steps.textToShow && steps.textToShow.related_article && steps.textToShow.related_article != 0 && answer2visible == true ?
              <SideSpacing15>
                <ButtonLinkPressLeft
                  onPress={() => {
                    //show article related steps.textToShow.related_article

                  }}>
                  <ButtonTextMdLineL>
                    {t('learnMoreLinkTxt')}
                  </ButtonTextMdLineL>
                </ButtonLinkPressLeft>
              </SideSpacing15>
              : null}
          </>
          : null
        }
      </FlexCol>
    </FlexRow>
  )
}
const UserBubble = (props: any) => {
  const { message, steps } = props
  return (
    <>
      <View style={styles.userStyle}>
        <Heading5BoldWh style={[{ textAlignVertical: 'center' }]}>{message}</Heading5BoldWh>
      </View>
    </>
  )
}
const OptionBubble = (props: any) => {
  const { optionval, optionindex, stepindex, steps, categorySelection, dynamicStepSelection, backToHomeScreen } = props
  return (
    <>
      <Pressable
        style={{
          flexDirection: 'row',
          flex: 1
        }}
        onPress={() => {
          optionval.nextStepFunc && optionval?.nextStepFunc(stepindex, optionindex, steps)
        }}>
        <View style={styles.optionStyle}>

          <Heading4Regular style={[{ flex: 7, textAlignVertical: 'center' }]}>
            {optionval?.label}
          </Heading4Regular>
          {/* <Icon
              style={{flex: 1, textAlign: 'right', alignSelf: 'center'}}
              name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            /> */}

        </View>
      </Pressable>
    </>
  )
}
const ActionBubble = (props: any) => {
  const { actionval, actionindex, stepindex, steps, stepsjson, backToStep, backToHomeScreen } = props
  return (
    <>
      <Pressable
        style={{
          flexDirection: 'row',
          flex: 1
        }}
        onPress={() => {
          actionval?.nextStepFunc(stepindex, actionindex, actionval.nextStepval, steps[stepindex].id, steps, stepsjson)
        }}>
        <View style={[styles.actionStyle,{marginTop:actionindex == 0 ? 25 : 0}]}>
          {/* <View style={styles.imageStyle}>
            <LinearGradient
              style={{ flex: 1, borderRadius: 100, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['#2B2F84', '#1F50A0', '#00AEEF']}>
              <VectorImage style={{ width: 20, height: 20, borderRadius: 100 }} source={require('@assets/svg/logo_chatbot.svg')} />
            </LinearGradient>
          </View> */}
          <Heading4Regular style={[{ flex: 7, textAlignVertical: 'center'}]}>
            {actionval?.label}
          </Heading4Regular>
          {/* <Icon
              style={{flex: 1, textAlign: 'right', alignSelf: 'center'}}
              name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
              size={10}
              color="#000"
            /> */}

        </View>
      </Pressable>
    </>
  )
}


const ChatBot = (props: any) => {
  // console.log("chatbot----",props)
  const { userNameData, item, index, steps, stepsjson, categorySelection, dynamicStepSelection, backToStep, backToHomeScreen } = props;
  console.log("ChatBot---", userNameData);
  return (
    <View style={{ flex: 1 }} key={index}>
      {item.showNextStep == true ?
        <>
          <BotBubble key={'b' + item.id + '-' + index} message={item.message} steps={item} userNameData={userNameData} />
          {
            item.answer ?
              <UserBubble key={'u' + item.id + '-' + item.answer.value} message={item.answer.label} steps={item} />
              :
              <>
                {item.options && item.options.length > 0 ?
                  item.options.map((y: any, i2: any) => {
                    return (
                      <OptionBubble key={'o' + index + '-' + i2} optionval={y} optionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToHomeScreen={backToHomeScreen} />
                    )
                  })
                  : null}
                {item && item.actions && item.actions.length > 0 ?
                  item.actions.map((y: any, i2: any) => {
                    return (
                      <ActionBubble key={'a' + index + '-' + i2} actionval={y} actionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} backToStep={backToStep} backToHomeScreen={backToHomeScreen} />
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
  botStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#f6f5f2',
    padding: 10,
    // margin:5,
    //marginBottom:10,
    // marginRight:50,
    paddingTop: 17,
    paddingBottom: 17,
  },
  userStyle: {
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    // backgroundColor:'#2B2F84',
    backgroundColor: '#1e2c76',
    padding: 10,
    borderRadius: 4,
    // margin:5,
    marginBottom: 10,
    marginLeft: 60,
    paddingTop: 17,
    paddingBottom: 17,
  },
  optionStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 4,
    // margin:5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2B2F84',
    marginLeft: 55,
    paddingTop: 17,
    paddingBottom: 17,
  },
  actionStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#75A7DD',
    padding: 10,
    borderRadius: 100,
    // margin:5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginLeft: 65,
    marginRight:10,
    paddingTop: 17,
    paddingBottom: 17,
  },
  imageStyle: {
    height: 36,
    width: 36,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 5,
    // borderWidth:2,
    // borderColor:'#000'
  }
});