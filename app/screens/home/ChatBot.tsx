import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from 'react-i18next';
import HTML from 'react-native-render-html';
import { addSpaceToHtml } from '../../services/Utils';
import { Heading4Bold, Heading4Centerr, Heading4Regular, SideSpacing15, HeadingChatCenterw } from '@styles/typography';
import { FlexRow } from '@components/shared/FlexBoxStyle';
import VectorImage from 'react-native-vector-image';
import { ButtonLinkPressLeft, ButtonTextMdLineL } from '@components/shared/ButtonGlobal';
import LinearGradient from 'react-native-linear-gradient';
import { IconML } from '@components/shared/Icon';
import { BotImage, BotBubbleContainer, BotBubbleTextContainer, UserBubbleContainer, UserBubbleTextContainer, OptionBubbleContainer, ActionBubbleContainer, ActionBubbleIcon, OptionBubblePressable, ActionBubblePressable } from '@components/shared/SupportChatStyle';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../App';
import ThreeDotsLoader from '../../services/ThreeDotsLoader';
import { imgLogoChatbotNew } from '../../instance';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  flexShrink1: { flexShrink: 1 },
  font14: { fontSize: 14 },
  htmlView: { padding: 15, paddingTop: 5, paddingBottom: 5 },
  htmlView2: { padding: 15, paddingTop: 15, paddingBottom: 5 },
  linearGradient: { alignItems: 'center', borderRadius: 100, flex: 1, height: 36, justifyContent: 'center', width: 36 },
  marginTop0: { marginTop: 0 },
  marginTop40: { marginTop: 40 },
  paddingTop0: { paddingTop: 0 },
  paddingTop10: { paddingTop: 10 },
  vectorImage: { borderRadius: 100, height: 20, resizeMode: 'contain', width: 20 },
})
interface ChatBotData {
  item: Object,
  index: any,
  steps: Object,
  stepsjson: Object,
  categorySelection: any,
  dynamicStepSelection: any,
  backToStep: any,
  backToHomeScreen: any,
  showFeedbackLink: any,
  noDataStep: any
}
const BotBubble = (props: any): any => {
  const { message, steps, stepindex, loading } = props;
  const { t } = useTranslation();
  const netInfo = useNetInfoHook();
  const navigation = useNavigation<any>();
  const [answer2visible, setanswer2visible] = useState(false);
  const allConfigData = useAppSelector((state: any) =>
    state.variableData?.variableData != ''
      ? JSON.parse(state.variableData?.variableData)
      : state.variableData?.variableData,
  );
  const userNameData =
    allConfigData?.length > 0
      ? allConfigData.filter((item: any) => item.key === 'userName')
      : [];


  return (
    <FlexRow>
      <BotImage>
        <LinearGradient
          style={styles.linearGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#2B2F84', '#1F50A0', '#00AEEF']}>
          <VectorImage style={styles.vectorImage} source={imgLogoChatbotNew} />
        </LinearGradient>
      </BotImage>
      <BotBubbleContainer>
        <BotBubbleTextContainer>
          {loading == true ? <ThreeDotsLoader /> :
            <>
              {stepindex == 0 ?
                <Heading4Bold>{t('helloMessage', { parentName: userNameData?.length > 0 ? ' ' + userNameData[0].value : '' })}</Heading4Bold>
                : <Heading4Bold>{message}</Heading4Bold>
              }
            </>
          }
        </BotBubbleTextContainer>
        {loading == false && steps && steps.textToShow && steps.textToShow.answer_part_1 && steps.textToShow.answer_part_1 != '' ?
          <>
            <View style={styles.htmlView}>
              <HTML
                source={{ html: addSpaceToHtml(steps.textToShow.answer_part_1) }}
                baseStyle={styles.font14}
                ignoredStyles={['color', 'fontSize', 'fontFamily']}
                tagsStyles={{
                  p: { marginBottom: 0, marginTop: 0, textAlign: 'left' },
                }}
              />
            </View>
            {steps && steps.textToShow && steps.textToShow.answer_part_2 && steps.textToShow.answer_part_2 != '' && answer2visible == false ?
              <SideSpacing15>
                <ButtonLinkPressLeft
                  onPress={(): any => {
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
              <View style={styles.htmlView2}>
                <HTML
                  source={{ html: addSpaceToHtml(steps.textToShow.answer_part_2) }}
                  baseStyle={styles.font14}
                  ignoredStyles={['color', 'fontSize', 'fontFamily']}
                  tagsStyles={{
                    p: { marginBottom: 0, marginTop: 0, textAlign: 'left' },
                  }}
                />
              </View>
              : null}
            {steps && steps.textToShow && steps.textToShow.related_article && steps.textToShow.related_article != 0 && (answer2visible == true || (steps.textToShow.answer_part_2 == '' && answer2visible == false)) ?
              <SideSpacing15>
                <ButtonLinkPressLeft
                  onPress={(): any => {
                    //show article related steps.textToShow.related_article
                    navigation.navigate('DetailsScreen',
                      {
                        fromScreen: "SupportChat",
                        headerColor: '',
                        backgroundColor: '',
                        detailData: steps.textToShow.related_article,
                        netInfo: netInfo
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
const UserBubble = (props: any): any => {
  const { message } = props
  return (
    <UserBubbleContainer>
      <UserBubbleTextContainer>
        <HeadingChatCenterw>{message}</HeadingChatCenterw>
      </UserBubbleTextContainer>
    </UserBubbleContainer>
  )
}
const OptionBubble = (props: any): any => {
  const { optionval, optionindex, stepindex, steps } = props
  return (
    <>

      <OptionBubbleContainer>
        <OptionBubblePressable
          onPress={(): any => {
            optionval?.nextStepFunc(stepindex, optionindex, steps)
          }}>
          <Heading4Centerr>
            {optionval?.label}
          </Heading4Centerr>
        </OptionBubblePressable>
      </OptionBubbleContainer>

    </>
  )
}
const ActionBubble = (props: any): any => {
  const { actionval, actionindex, stepindex, steps, stepsjson } = props
  return (
    <>

      <ActionBubbleContainer style={actionindex == 0 ? styles.marginTop40 : styles.marginTop0}>
        <ActionBubblePressable
          onPress={(): any => {
            actionval?.nextStepFunc(stepindex, actionindex, actionval.nextStepval, steps[stepindex].id, steps, stepsjson)
          }}>
          <ActionBubbleIcon>
            <IconML name="ic_back" size={16} color="#000" />
          </ActionBubbleIcon>
          <Heading4Regular style={styles.flexShrink1}>
            {actionval?.label}
          </Heading4Regular>
        </ActionBubblePressable>
      </ActionBubbleContainer>
    </>
  )
}


const ChatBot : React.FC<ChatBotData> =(props:any) => {
  console.log('chatbot latest data', props)
  console.log('chatbot item data', props.item)
  console.log('chatbot steps data', props.steps)
 // const { item, index, steps, stepsjson, categorySelection, dynamicStepSelection, backToStep, backToHomeScreen, showFeedbackLink, noDataStep } = props;
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    console.log('chatbot screen', props.steps)
    console.log('showNextStep screen', props.item)
    console.log('categorySelection screen', props.categorySelection)
    setLoading(true);
    setTimeout(() => {
      setLoading(false)
    }, props.item.delay);
  }, [props.item.showNextStep]);
 
//   return (
//     <View style={[styles.flex1, (props.index == 0 ? styles.paddingTop10 : styles.paddingTop0)]} key={props.index}>
//       {props.item.showNextStep == true ?
//       <Text>{props.item.message}</Text>:<Text>No Data</Text>
// }
      
//      </View>)
return(
    <View style={[styles.flex1, (props.index == 0 ? styles.paddingTop10 : styles.paddingTop0)]} key={props.index}>
      {props.item.showNextStep == true ?
        <>
          <BotBubble key={'b' + props.item.id + '-' + props.index} message={props.item.message} steps={props.item} stepindex={props.index} loading={loading} />
          {loading == false ?
            <>
              {
                props.item.answer ?
                  <UserBubble key={'u' + props.item.id + '-' + props.item.answer.value} message={props.item.answer.label} steps={props.item} />
                  :
                  <>
                    {props.item.options && props.item.options.length > 0 ?
                      props.item.options.map((y: any, i2: any) => {
                        return (
                          <OptionBubble key={'o' + props.index + '-' + i2} optionval={y} optionindex={i2} stepindex={props.index} steps={props.steps} stepsjson={props.stepsjson} categorySelection={props.categorySelection} dynamicStepSelection={props.dynamicStepSelection} backToHomeScreen={props.backToHomeScreen} showFeedbackLink={props.showFeedbackLink} noDataStep={props.noDataStep} />
                        )
                      })
                      : null}
                    {props.item && props.item.actions && props.item.actions.length > 0 ?
                      props.item.actions.map((y: any, i2: any) => {
                        return (
                          <ActionBubble key={'a' + props.index + '-' + i2} actionval={y} actionindex={i2} stepindex={props.index} steps={props.steps} stepsjson={props.stepsjson} backToStep={props.backToStep} backToHomeScreen={props.backToHomeScreen} />
                        )
                      })
                      : null}
                  </>
              }
            </>
            : null
          }
        </>
        : null
      }
    </View>
)
};

export default React.memo(ChatBot);
