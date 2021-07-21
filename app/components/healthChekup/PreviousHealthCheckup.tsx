import { MainContainer } from '@components/shared/Container';
import { Bullets, BulletsView } from '@components/shared/Divider';
import { FDirRowStart, FlexDirRow } from '@components/shared/FlexBoxStyle';
import { HealthDesc, ToolsActionView, ToolsHeadingView, ToolsHeadPress, ToolsHeadView, ToolsIconView, ToolsListContainer, ToolsListOuter } from '@components/shared/ToolsStyle';
import { useNavigation } from '@react-navigation/native';
import { Heading2, Heading4, Heading4Regular, Paragraph, ShiftFromBottom15, ShiftFromTop15, ShiftFromTop5, ShiftFromTopBottom10 } from '@styles/typography';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { ButtonContainerAuto, ButtonHealth, ButtonText, ButtonTextMdLine, ButtonTextSmLine, ButtonTextSmLineL } from '../shared/ButtonGlobal';
import Icon from '../shared/Icon';

const PreviousHealthCheckup = (props: any) => {
  const {item, headerColor, backgroundColor} = props;
  console.log(item,"PreviousHealthCheckup");
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isOPen, setIsOPen] = useState<Boolean>(false);
  const themeContext = useContext(ThemeContext);
  const reminderColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = () => {
    // navigation.navigate('DetailsScreen', {
    //   fromScreen: 'Articles',
    //   headerColor: artHeaderColor,
    //   backgroundColor: artBackgroundColor,
    // });
  };
  return (
    <>
      <ToolsListOuter>
      <ToolsListContainer
          style={{
            backgroundColor: backgroundColor,
          }}>
          <ToolsIconView>
            {/* {item.measures ? (
              item.givenVaccines.length == 0 ? ( */}
                <Icon
                  name="ic_incom"
                  size={20}
                  color="#FFF"
                  style={{backgroundColor: 'red', borderRadius: 50}}
                />
              {/* ) : ( */}
                {/* <RadioActive
                  style={{backgroundColor: 'green', borderRadius: 50}}>
                  <Icon name="ic_tick" size={12} color="#FFF" />
                </RadioActive> */}
              {/* ) */}
            {/* ) : item.givenVaccines.length > 0 ? ( */}
              {/* <RadioActive style={{backgroundColor: 'green', borderRadius: 50}}>
                <Icon name="ic_tick" size={12} color="#FFF" />
              </RadioActive> */}
            {/* ) : ( */}
              {/* <Icon name="ic_plus" size={20} color="#000" /> */}
            {/* )} */}
          </ToolsIconView>
          <ToolsHeadPress
            onPress={() => {
              setIsOPen(!isOPen);
            }}>
              <ToolsHeadingView>
              
              <Heading2>
              {item?.title}
              </Heading2>
              
            </ToolsHeadingView>
            <ToolsActionView>
              <FlexDirRow>
              <Icon
                style={{alignSelf: 'center'}}
                name={isOPen ? 'ic_angle_up' : 'ic_angle_down'}
                size={10}
                color="#000"
              />
              </FlexDirRow>
            </ToolsActionView>
          </ToolsHeadPress>
        </ToolsListContainer>
        {isOPen ? (
          <>
          <MainContainer>
            <FDirRowStart>
            <ToolsIconView>
            <Icon name="ic_vaccination" size={20} color="#000" />
            </ToolsIconView>
            <ToolsHeadingView>
            <ShiftFromTop5>
              <ShiftFromBottom15>
              {/* {item.givenVaccines.length > 0 ? ( */}
                      <Heading4Regular>{t('hcVaccineText')}</Heading4Regular>
                      {/* ) : ( */}
                    <Heading4Regular>{t('hcNoVaccineTxt')}</Heading4Regular>
                    {/* )} */}
                  </ShiftFromBottom15> 
                  </ShiftFromTop5> 
                  <HealthDesc>
                  {item.vaccines?.map((vaccineItem: any, index: number) => {
                  return (
                    
                       <View key={index} >
                      <BulletsView>
                        <Bullets></Bullets>
                      <Paragraph>{vaccineItem?.title}</Paragraph>
                      </BulletsView>
                    </View>
                  );
                })}
                  </HealthDesc>
                  </ToolsHeadingView>
            </FDirRowStart>
            <FDirRowStart>
            <ToolsIconView>
              <Icon name="ic_growth" size={20} color="#000" />
            </ToolsIconView>
            
            <ToolsHeadingView>
            <ShiftFromTop5>
            {/* {item.measures?.weight ? (
                    <Heading4Regular>
                      {t('hcMeasureText', {
                        weight: item.measures?.weight,
                        height: item.measures?.height,
                      })}
                    </Heading4Regular>
                  ) : (
                    <Heading4Regular>{t('hcNoMeasureTxt')}</Heading4Regular>
                  )} */}
                  </ShiftFromTop5>
            </ToolsHeadingView>
            
            </FDirRowStart>
            
            {/* {item.doctorRemarks ? ( */}
              <ShiftFromTop15>
            <FDirRowStart>
            <ToolsIconView>
              <Icon name="ic_doctor_chk_up" size={20} color="#000" />
            </ToolsIconView>
            <ToolsHeadingView>
              
            <Heading4Regular>{item?.doctorRemarks}</Heading4Regular>
            
            </ToolsHeadingView>
            
            </FDirRowStart>
            
            </ShiftFromTop15>
 {/* ) : null} */}
 <ShiftFromTop15>
 <Pressable onPress={gotoArticle}>
                  <ButtonTextSmLineL>
                  {t('hcArticleLink')}
                  </ButtonTextSmLineL>
                </Pressable>
                </ShiftFromTop15>
            </MainContainer>

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
              
            <Pressable
                onPress={() => {
                  navigation.navigate('AddReminder', {
                    reminderType: 'HealthCheckup',
                    headerTitle: t('vcEditReminderHeading'),
                    buttonTitle: t('hcReminderAddBtn'),
                    titleTxt: t('hcReminderText'),
                    warningTxt: t('hcReminderDeleteWarning'),
                    headerColor: headerColor,
                  });
                }}>
                <ButtonTextSmLine>
                {t('editCountryLang')}
                </ButtonTextSmLine>
              </Pressable>
                
            </ToolsActionView>
            </ToolsHeadView>
            </FDirRowStart>
            {/* Set Reminder Link */}

            {/* <Pressable
                onPress={() => {
                  navigation.navigate('AddReminder', {
                    reminderType: 'HealthCheckup',
                    headerTitle: t('vcReminderHeading'),
                    buttonTitle: t('hcReminderAddBtn'),
                    titleTxt: t('hcReminderText'),
                    warningTxt: t('hcReminderDeleteWarning'),
                    headerColor: headerColor,
                  });
                }}>
                <Text style={{textDecorationLine: 'underline'}}>
                  {t('hcReminderbtn')}
                </Text>
              </Pressable> */}

            </MainContainer>

            {/* {item.measures?.weight ||
                item.measures?.height ||
                item.givenVaccines.length > 0 ? ( */}
                  <ShiftFromTopBottom10>
           <Pressable
                    onPress={() =>
                      navigation.navigate('AddChildVaccination', {
                        headerTitle: t('editVcTitle'),
                      })
                    }>
                  <ButtonTextMdLine>
                  {t('hcEditBtn')}
                  </ButtonTextMdLine>
                </Pressable>
                </ShiftFromTopBottom10>
                 {/* ) : ( */}
                  <ButtonContainerAuto>
                  <ButtonHealth
                    onPress={() =>
                      navigation.navigate('AddChildHealthCheckup', {
                        headerTitle: t('hcNewHeaderTitle'),
                      })
                    }>
                    <ButtonText>{t('hcNewBtn')}</ButtonText>
                  </ButtonHealth>
                  </ButtonContainerAuto>
                {/* )} */}

          </>
        ) : null}
      </ToolsListOuter>
    </>
  );
};
export default PreviousHealthCheckup;

// const styles = StyleSheet.create({
//   item: {
//     padding: 10,
//     color: '#000',
//     backgroundColor: '#FFF',
//   },
// });
