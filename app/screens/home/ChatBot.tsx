import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Image } from "react-native";
import { useTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import { addSpaceToHtml } from '../../services/Utils';
import { Heading1, Heading3Center, Heading4Bold, Heading4Center, Heading4Centerr, Heading4Regular, Heading4Centerw, SideSpacing15 } from '@styles/typography';
import { FlexCol, FlexRow } from '@components/shared/FlexBoxStyle';
import VectorImage from 'react-native-vector-image';
import { ButtonLinkPressLeft, ButtonTextMdLineL } from '@components/shared/ButtonGlobal';
import LinearGradient from 'react-native-linear-gradient';
import Icon, { IconML } from '@components/shared/Icon';
import { BotImage, BotBubbleContainer, BotBubbleTextContainer, UserBubbleContainer, UserBubbleTextContainer, OptionBubbleContainer, ActionBubbleContainer,ActionBubbleIcon, OptionBubblePressable, ActionBubblePressable } from '@components/shared/SupportChatStyle';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../App';

const BotBubble = (props: any) => {
  const { message, steps,stepindex } = props;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [answer2visible, setanswer2visible] = useState(false);
  const allConfigData = useAppSelector((state: any) =>
    state.variableData?.variableData != ''
      ? JSON.parse(state.variableData?.variableData)
      : state.variableData?.variableData,
    );
    const userNameData =
        allConfigData?.length > 0
          ? allConfigData.filter((item:any) => item.key === 'userName')
          : [];
  console.log("botbubble---", userNameData);
  return (
    <FlexRow>
      <BotImage>
        <LinearGradient
          style={{ flex: 1, borderRadius: 100, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#2B2F84', '#1F50A0', '#00AEEF']}>
          <VectorImage style={{ width: 20, height: 20, borderRadius: 100, resizeMode: 'contain' }} source={require('@assets/svg/img-logo-chatbot.svg')} />
        </LinearGradient>
      </BotImage>
      <BotBubbleContainer>
        <BotBubbleTextContainer>
          {stepindex == 0 ?
              <Heading4Bold>{t('helloMessage',{parentName:userNameData?.length > 0 ? userNameData[0].value : t('childInfoParentText')})}</Heading4Bold>
              : <Heading4Bold>{message}</Heading4Bold> 
          }
        </BotBubbleTextContainer>
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
            {steps && steps.textToShow && steps.textToShow.related_article && steps.textToShow.related_article != 0 && (answer2visible == true || (steps.textToShow.answer_part_2 == '' && answer2visible == false)) ?
              <SideSpacing15>
                <ButtonLinkPressLeft
                  onPress={() => {
                    //show article related steps.textToShow.related_article
                      navigation.navigate('DetailsScreen',
                      {
                        fromScreen:"SupportChat",
                        headerColor:'',
                        backgroundColor:'',
                        detailData:steps.textToShow.related_article,
                        // setFilteredArticleData: setFilteredArticleData
                      });

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
      </BotBubbleContainer>
    </FlexRow>
  )
}
const UserBubble = (props: any) => {
  const { message, steps } = props
  return (
    <UserBubbleContainer>
      <UserBubbleTextContainer>
        <Heading4Centerw>{message}</Heading4Centerw>
      </UserBubbleTextContainer>
    </UserBubbleContainer>
  )
}
const OptionBubble = (props: any) => {
  const { optionval, optionindex, stepindex, steps, categorySelection, dynamicStepSelection, backToHomeScreen, showFeedbackLink } = props
  return (
    <>

      <OptionBubbleContainer>
        <OptionBubblePressable
          onPress={() => {
            optionval.nextStepFunc && optionval?.nextStepFunc(stepindex, optionindex, steps)
          }}>
          <Heading4Centerr>
            {optionval?.label}
          </Heading4Centerr>
        </OptionBubblePressable>
      </OptionBubbleContainer>

    </>
  )
}
const ActionBubble = (props: any) => {
  const { actionval, actionindex, stepindex, steps, stepsjson, backToStep, backToHomeScreen } = props
  return (
    <>

      <ActionBubbleContainer style={{ marginTop: actionindex == 0 ? 40 : 0 }}>
        <ActionBubblePressable
          onPress={() => {
            actionval?.nextStepFunc(stepindex, actionindex, actionval.nextStepval, steps[stepindex].id, steps, stepsjson)
          }}>
          <ActionBubbleIcon>
            <IconML name="ic_back" size={16} color="#000" />
          </ActionBubbleIcon>
          <Heading4Regular style={{ flexShrink: 1 }}>
            {actionval?.label}
          </Heading4Regular>
        </ActionBubblePressable>
      </ActionBubbleContainer>
    </>
  )
}


const ChatBot = (props: any) => {
  // console.log("chatbot----",props)
  const { item, index, steps, stepsjson, categorySelection, dynamicStepSelection, backToStep, backToHomeScreen, showFeedbackLink } = props;
  return (
    <View style={{ flex: 1,paddingTop:index == 0 ? 10 : 0 }} key={index}>
      {item.showNextStep == true ?
        <>
          <BotBubble key={'b' + item.id + '-' + index} message={item.message} steps={item} stepindex={index} />
          {
            item.answer ?
              <UserBubble key={'u' + item.id + '-' + item.answer.value} message={item.answer.label} steps={item} />
              :
              <>
                {item.options && item.options.length > 0 ?
                  item.options.map((y: any, i2: any) => {
                    return (
                      <OptionBubble key={'o' + index + '-' + i2} optionval={y} optionindex={i2} stepindex={index} steps={steps} stepsjson={stepsjson} categorySelection={categorySelection} dynamicStepSelection={dynamicStepSelection} backToHomeScreen={backToHomeScreen} showFeedbackLink={showFeedbackLink} />
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
