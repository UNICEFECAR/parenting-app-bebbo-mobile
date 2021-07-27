import { MainContainer } from '@components/shared/Container';
import { Bullets, BulletsView } from '@components/shared/Divider';
import { FDirRowStart, FlexDirRow } from '@components/shared/FlexBoxStyle';
import { RadioActive } from '@components/shared/radio';
import {
  HealthDesc,
  ToolsActionView,
  ToolsHeadingView,
  ToolsHeadPress,
  ToolsHeadView,
  ToolsIconView,
  ToolsListContainer,
  ToolsListOuter
} from '@components/shared/ToolsStyle';
import { useNavigation } from '@react-navigation/native';
import {
  Heading2,
  Heading4,
  Heading4Regular,
  Paragraph,
  ShiftFromBottom15,
  ShiftFromTop15,
  ShiftFromTop5,
  ShiftFromTopBottom10
} from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import {
  ButtonContainerAuto,
  ButtonHealth,
  ButtonText,
  ButtonTextMdLine,
  ButtonTextSmLine,
  ButtonTextSmLineL
} from '../shared/ButtonGlobal';
import Icon from '../shared/Icon';

const UpcomingHealthCheckup = (props: any) => {
  const {item, currentIndex, headerColor, backgroundColor, currentPeriodId} =
    props;
  // console.log(item);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const themeContext = useContext(ThemeContext);
  const reminderColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const gotoArticle = (pinned_articleID) => {
    // navigation.navigate('DetailsScreen', {
    //   fromScreen: 'Articles',
    //   headerColor: artHeaderColor,
    //   backgroundColor: artBackgroundColor,
    // });
  };
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  useEffect(() => {
    currentPeriodId == item.id ? setIsOpen(true) : setIsOpen(false);
    // open first collapsible in upcoming vaccine period
  }, []);
  return (
    <>
      <ToolsListOuter>
        <ToolsListContainer
          style={{
            backgroundColor: backgroundColor,
          }}>
          <ToolsIconView>
            {item.vaccines.some((el) => {
              return el.isMeasured == true;
            }) ? (
              <RadioActive style={{backgroundColor: 'green', borderRadius: 50}}>
                <Icon name="ic_tick" size={12} color="#FFF" />
              </RadioActive>
            ) : (
              <Icon
                name="ic_incom"
                size={20}
                color="#FFF"
                style={{backgroundColor: 'red', borderRadius: 150}}
              />
            )}
          </ToolsIconView>
          <ToolsHeadPress
            onPress={() => {
              setIsOpen(!isOpen);
            }}>
            <ToolsHeadingView>
              <Heading2>{item.title}</Heading2>
              {item.isAdditional ?<Text>{(item?.growthMeasures?.measurementDate)}</Text>: null}
            </ToolsHeadingView>

            <ToolsActionView>
              <FlexDirRow>
                <Icon
                  style={{alignSelf: 'center'}}
                  name={isOpen ? 'ic_angle_up' : 'ic_angle_down'}
                  size={10}
                  color="#000"
                />
              </FlexDirRow>
            </ToolsActionView>
          </ToolsHeadPress>
        </ToolsListContainer>
        {isOpen ? (
          <>
            <MainContainer>
              {item.vaccines.length > 0 ? (
                <FDirRowStart>
                  <ToolsIconView>
                    <Icon name="ic_vaccination" size={20} color="#000" />
                  </ToolsIconView>
                  <ToolsHeadingView>
                    {item.vaccines.some((el) => {
                      return el.isMeasured == true;
                    }) ? (
                      <ShiftFromTop5>
                        <ShiftFromBottom15>
                          <Heading4Regular>
                            {t('hcVaccineText')}
                          </Heading4Regular>
                        </ShiftFromBottom15>
                      </ShiftFromTop5>
                    ) : null}
                    <HealthDesc>
                      {item.vaccines?.map((vaccineItem: any, index: number) => {
                        if (vaccineItem.isMeasured === true) {
                          return (
                            <View key={index}>
                              <BulletsView>
                                <Bullets></Bullets>
                                <Paragraph>{vaccineItem.title}</Paragraph>
                              </BulletsView>
                            </View>
                          );
                        }
                      })}
                    </HealthDesc>
                    {item.vaccines.some((el) => {
                      return el.isMeasured == false;
                    }) ? (
                      <ShiftFromBottom15>
                        <Heading4Regular>{t('hcNoVaccineTxt')}</Heading4Regular>
                      </ShiftFromBottom15>
                    ) : null}
                    <HealthDesc>
                      {item.vaccines?.map((vaccineItem: any, index: number) => {
                        if (vaccineItem.isMeasured === false) {
                          return (
                            <View key={index}>
                              <BulletsView>
                                <Bullets></Bullets>
                                <Paragraph>{vaccineItem.title}</Paragraph>
                              </BulletsView>
                            </View>
                          );
                        }
                      })}
                    </HealthDesc>
                  </ToolsHeadingView>
                </FDirRowStart>
              ) : null}

              <FDirRowStart>
                <ToolsIconView>
                  <Icon name="ic_growth" size={20} color="#000" />
                </ToolsIconView>

                <ToolsHeadingView>
                  <ShiftFromTop5>
                    {item?.growthMeasures?.weight ? (
                    <Heading4Regular>
                      {t('hcMeasureText', {
                        weight: item?.growthMeasures.weight,
                        height: item?.growthMeasures.height,
                      })}
                    </Heading4Regular>
                  ) : (
                    <Heading4Regular>{t('hcNoMeasureTxt')}</Heading4Regular>
                  )}
                  </ShiftFromTop5>
                </ToolsHeadingView>
              </FDirRowStart>

              {item?.growthMeasures?.doctorComment ? (
              <ShiftFromTop15>
                <FDirRowStart>
                  <ToolsIconView>
                    <Icon name="ic_doctor_chk_up" size={20} color="#000" />
                  </ToolsIconView>
                  <ToolsHeadingView>
                    <Heading4Regular>{item?.growthMeasures?.doctorComment}</Heading4Regular>
                  </ToolsHeadingView>
                </FDirRowStart>
              </ShiftFromTop15>
              ) : null} 
              {item?.pinned_article ? (
                <ShiftFromTop15>
                  <Pressable onPress={() => gotoArticle(item.pinned_article)}>
                    <ButtonTextSmLineL>{t('hcArticleLink')}</ButtonTextSmLineL>
                  </Pressable>
                </ShiftFromTop15>
              ) : null}
            </MainContainer>

            {currentPeriodId == item.periodID ? (
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

                <Pressable
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
                  <ButtonTextMdLine style={{textDecorationLine: 'underline'}}>
                    {t('hcReminderbtn')}
                  </ButtonTextMdLine>
                </Pressable>
              </MainContainer>
            ) : null}

{item?.growthMeasures?.uuid ?
            (<ShiftFromTopBottom10>
              <Pressable
                onPress={() =>
                  navigation.navigate('AddChildHealthCheckup', {
                    headerTitle: t('editVcTitle'),
                    // vcPeriod: item,
                  })
                }>
                <ButtonTextMdLine>{t('hcEditBtn')}</ButtonTextMdLine>
              </Pressable>
            </ShiftFromTopBottom10>
             ) : ( 
            <ButtonContainerAuto>
              <ButtonHealth
                onPress={() =>
                  navigation.navigate('AddChildHealthCheckup', {
                    headerTitle: t('hcNewHeaderTitle'),
                    vcPeriod: item,
                  })
                }>
                <ButtonText>{t('hcNewBtn')}</ButtonText>
              </ButtonHealth>
            </ButtonContainerAuto>
            )} 
          </>
        ) : null}
      </ToolsListOuter>
    </>
  );
};
export default UpcomingHealthCheckup;

// const styles = StyleSheet.create({
//   item: {
//     padding: 10,
//     color: '#000',
//     backgroundColor: '#FFF',
//   },
// });
