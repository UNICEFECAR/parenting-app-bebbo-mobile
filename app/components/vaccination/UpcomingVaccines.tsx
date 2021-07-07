import { MainContainer } from '@components/shared/Container';
import { FlexDirRow,FDirRow, FDirRowStart, FlexDirRowEnd } from '@components/shared/FlexBoxStyle';
import { ToolsActionView, ToolsHeadingView, ToolsHeadPress, ToolsHeadView, ToolsIconView, ToolsListContainer,ToolsListOuter } from '@components/shared/ToolsStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading4, Heading4Regular, Heading5, ShiftFromTop5, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { ButtonPrimary, ButtonText,ButtonTextSmLineL, ButtonTextMd, ButtonTextMdLine, ButtonTextSmLine, ButtonLinkPress, ButtonVaccination, ButtonContainerAuto } from '../shared/ButtonGlobal';
import Icon from '../shared/Icon';

const UpcomingVaccines = (props: any) => {
  const {item, headerColor, backgroundColor} = props;
  // console.log(item);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const themeContext = useContext(ThemeContext);
  const reminderColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = () => {
    navigation.navigate('DetailsScreen', {
      fromScreen: 'ChildDevelopment',
      headerColor: artHeaderColor,
      backgroundColor: artBackgroundColor,
    });
  };
  return (
    <>
      <ToolsListOuter>
        <ToolsListContainer
          style={{
            backgroundColor: backgroundColor,
          }}>
            <ToolsIconView>
            <Icon
              name="ic_incom"
              size={20}
              color="#FFF"
              style={{backgroundColor: 'red', borderRadius: 150}}
            />  
            </ToolsIconView>
            <ToolsHeadPress
            style={{
              
            }}
            onPress={() => {
              setIsOPen(!isOPen);
            }}>
            <ToolsHeadingView>
            <Heading2 style={[{textAlignVertical: 'center'}]}>
                {item.title}
              </Heading2>
              <Heading5>
                {item.totalVc} {t('vaccinesTxt')},{item.doneVc}{' '}
                {t('vaccinesDoneTxt')} | {item.totalVc - item.doneVc}{' '}
                {t('vaccinesPendingTxt')}
              </Heading5>
            </ToolsHeadingView>
            <ToolsActionView>
            <Icon
                style={{alignSelf: 'center'}}
                name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
                size={10}
                color="#000"
              />
            </ToolsActionView>
            </ToolsHeadPress>
        </ToolsListContainer>
        {isOPen ? (
          <>
          <MainContainer>
            <FDirRowStart>
            <ToolsIconView>
              <Icon
                name="ic_incom"
                size={20}
                color="#FFF"
                style={{backgroundColor: 'red', borderRadius: 150}}
              />
            </ToolsIconView>
            <ToolsHeadingView>
            <Heading4Regular>
                    Diphtheria, tetanus, pertussis, polio, influenzae type b-
                    the second dose
                  </Heading4Regular>
                  
                  <Pressable onPress={gotoArticle}>
                    <ButtonTextSmLineL>
                      {t('vcArticleLink')}
                    </ButtonTextSmLineL>
                  </Pressable>
                  
            </ToolsHeadingView>
            </FDirRowStart>
          </MainContainer>
          <MainContainer>
            <FDirRowStart>
            <ToolsIconView>
              <Icon
                name="ic_incom"
                size={20}
                color="#FFF"
                style={{backgroundColor: 'red', borderRadius: 150}}
              />
            </ToolsIconView>
            <ToolsHeadingView>
            <Heading4Regular>
            Bacteria Streptococus pnuemoniae - the second dose
                  </Heading4Regular>
                  
                  <Pressable onPress={gotoArticle}>
                    <ButtonTextSmLineL>
                      {t('vcArticleLink')}
                    </ButtonTextSmLineL>
                  </Pressable>
                  
            </ToolsHeadingView>
            </FDirRowStart>
          </MainContainer>

          {/* Set Reminder After Add Time*/}
          <MainContainer>
          <FDirRowStart>
            <ToolsIconView>
            <Icon
                    name="ic_time"
                    size={20}
                    color="#FFF"
                    style={{backgroundColor: reminderColor, borderRadius: 50}}
                  />
            </ToolsIconView>
            <ToolsHeadView>

            
            <ToolsHeadingView>
            <Heading4Regular>{t('hcHasReminder')}</Heading4Regular>
                  <Heading4>{new Date().toDateString()}</Heading4>
            </ToolsHeadingView>
            <ToolsActionView>
              
            <Pressable onPress={() => {
                  navigation.navigate('AddReminder', {
                    reminderType:"Vaccination",
                    headerTitle: t('vcEditReminderHeading'),
                    buttonTitle:t('vcReminderAddBtn'),
                    titleTxt:t('vcReminderText'),
                    warningTxt:t('vcReminderDeleteWarning'),
                    headerColor:headerColor,
                  })
                }}>
                  <ButtonTextSmLine>
                    {t('editCountryLang')}
                  </ButtonTextSmLine>
                </Pressable>
                
            </ToolsActionView>
            </ToolsHeadView>
            </FDirRowStart>
          {/* Set Reminder After Add Time*/}
          {/* Set Reminder Link*/}
          {/* <ButtonLinkPress onPress={()=>{
                  navigation.navigate('AddReminder', {
                    reminderType:"Vaccination",
                    headerTitle: t('vcReminderHeading'),
                    buttonTitle:t('vcReminderAddBtn'),
                    titleTxt:t('vcReminderText'),
                    warningTxt:t('vcReminderDeleteWarning'),
                    headerColor:headerColor,
                  })
                }}>
                  <ButtonTextMdLine>
                    {t('vcSetReminder')}
                  </ButtonTextMdLine>
                </ButtonLinkPress> */}
          {/* Set Reminder Link*/}
          
          </MainContainer>
           <ShiftFromTopBottom10>
           <Pressable onPress={() =>
                    navigation.navigate('AddChildVaccination', {
                      headerTitle: t('editVcTitle'),
                    })
                  }>
                  <ButtonTextMdLine>
                    {t('vcEditDataBtn')}
                  </ButtonTextMdLine>
                </Pressable>
           </ShiftFromTopBottom10>
           <ButtonContainerAuto>
           <ButtonVaccination
                  onPress={() =>
                    navigation.navigate('AddChildVaccination', {
                      headerTitle: t('addVcTitle'),
                    })
                  }>
                  <ButtonText>{t('vcAddBtn')}</ButtonText>
                </ButtonVaccination>
                </ButtonContainerAuto>
          </>
        ) : null}
      </ToolsListOuter>
    </>
  );
};
export default UpcomingVaccines;

// const styles = StyleSheet.create({
//   item: {
//     padding: 10,
    
//   },
// });
