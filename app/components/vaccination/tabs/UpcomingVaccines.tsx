import { MainContainer } from '@components/shared/Container';
import { FDirRowStart } from '@components/shared/FlexBoxStyle';
import { RadioActive } from '@components/shared/radio';
import {
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
  Heading5,
  ShiftFromTopBottom10
} from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../../App';
import {
  ButtonContainerAuto,
  ButtonLinkPress,
  ButtonText,
  ButtonTextMdLine,
  ButtonTextSmLine,
  ButtonTextSmLineL,
  ButtonVaccination
} from '../../shared/ButtonGlobal';
import Icon from '../../shared/Icon';

const UpcomingVaccines = (props: any) => {
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
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const isFutureDate = (date: Date) => {
    return (
      new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    );
  };
  useEffect(() => {
    currentPeriodId == item.periodID ? setIsOpen(true) : setIsOpen(false);
    const yeas = item.vaccines.some((el) => {
      return el.isMeasured == true;
    });
    console.log(yeas, 'isMeasuredyeas');
    // open first collapsible in upcoming vaccine period
  }, []);
  const gotoArticle = (pinned_articleID) => {
    // navigation.navigate('DetailsScreen', {
    //   fromScreen: 'ChildDevelopment',
    //   headerColor: artHeaderColor,
    //   backgroundColor: artBackgroundColor,
    // });
  };
  const doneVc = item.vaccines.filter((item) => {
    return item.isMeasured;
  })
  // console.log(doneVc.length,"doneVc");
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
              <Heading2>{item.periodName}</Heading2>
              <Heading5>
                {item.vaccines.length} {t('vaccinesTxt')}{', '}{doneVc? doneVc.length :0 }{' '}
                {t('vaccinesDoneTxt')} |{' '}
                {item.vaccines.length - (doneVc? doneVc.length :0 )}{' '}
                {t('vaccinesPendingTxt')}
              </Heading5>
            </ToolsHeadingView>
            <ToolsActionView>
              <Icon
                style={{alignSelf: 'center'}}
                name={isOpen ? 'ic_angle_up' : 'ic_angle_down'}
                size={10}
                color="#000"
              />
            </ToolsActionView>
          </ToolsHeadPress>
        </ToolsListContainer>
        {isOpen ? (
          <>
            {item.vaccines.map((v, i) => {
              return (
                <MainContainer key={i}>
                  <FDirRowStart>
                    <ToolsIconView>
                      {v.isMeasured ? (
                        <RadioActive
                          style={{backgroundColor: 'green', borderRadius: 50}}>
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
                    <ToolsHeadingView>
                      <Heading4Regular>{v.title}</Heading4Regular>
                        {v?.pinned_article ?
                      <Pressable onPress={() => gotoArticle(v.pinned_article)}>
                        <ButtonTextSmLineL>
                          {t('vcArticleLink')}
                        </ButtonTextSmLineL>
                      </Pressable>
                      : null}
                    </ToolsHeadingView>
                  </FDirRowStart>
                </MainContainer>
              );
            })}

            {/* Set Reminder After Add Time*/}
            {currentPeriodId == item.periodID ?   <MainContainer>
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
                      disabled={isFutureDate(activeChild?.birthDate)}
                      onPress={() => {
                        navigation.navigate('AddReminder', {
                          reminderType: 'Vaccination',
                          headerTitle: t('vcEditReminderHeading'),
                          buttonTitle: t('vcReminderAddBtn'),
                          titleTxt: t('vcReminderText'),
                          warningTxt: t('vcReminderDeleteWarning'),
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
              {/* Set Reminder After Add Time*/}
              {/* Set Reminder Link*/}
              <ButtonLinkPress onPress={()=>{
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
                </ButtonLinkPress>
              {/* Set Reminder Link*/}
            </MainContainer> : null}
            {/* add condition for only few vaccines are given in below */}
            {(currentPeriodId == item.periodID && item.vaccines.some((el) => {
              return el.isMeasured == true;
            })) ? (
              <ShiftFromTopBottom10>
                <Pressable
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={() =>
                    console.log(item)
                    // navigation.navigate('AddChildVaccination', {
                    //   headerTitle: t('editVcTitle'),
                    //   vcPeriod: item,
                    // })
                  }>
                  <ButtonTextMdLine>{t('vcEditDataBtn')}</ButtonTextMdLine>
                </Pressable>
              </ShiftFromTopBottom10>
            ) : null}
            {/* remaining add condition for all vaccines were not given in below */}
            {(currentPeriodId == item.periodID && item.vaccines.every((el) => {
              return el.isMeasured == false;
            }))? (
              <ButtonContainerAuto>
                <ButtonVaccination
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={() =>
                    navigation.navigate('AddChildVaccination', {
                      headerTitle: t('addVcTitle'),
                      vcPeriod: item,
                    })
                  }>
                  <ButtonText>{t('vcAddBtn')}</ButtonText>
                </ButtonVaccination>
              </ButtonContainerAuto>
            ) : null}
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
