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
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../database/schema/ChildDataSchema';
import { setActiveChildData } from '../../redux/reducers/childSlice';
import { isFutureDate } from '../../services/childCRUD';
import { formatStringDate, formatStringTime } from '../../services/Utils';
import {
  ButtonContainerAuto,
  ButtonHealth,
  ButtonText,
  ButtonTextMdLine,
  ButtonTextSmLine,
  ButtonTextSmLineL
} from '../shared/ButtonGlobal';
import Icon, { IconViewBg } from '../shared/Icon';

const UpcomingHealthCheckup = (props: any) => {
  const { item, currentIndex, childAgeIndays, headerColor, backgroundColor, currentPeriodId } =
    props;
  console.log(item, "UpcomingHealthCheckup")
  // console.log(childAgeIndays,item.vaccination_opens,item.vaccination_ends,item.title)
  // console.log(currentPeriodId,"currentPeriodId");
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const themeContext = useContext(ThemeContext);
  const reminderColor = themeContext.colors.CHILDDEVELOPMENT_COLOR;
  const artHeaderColor = themeContext.colors.ARTICLES_COLOR;
  const artBackgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
  const deleteReminder = async (hcuuid) => {
    const languageCode = useAppSelector(
      (state: any) => state.selectedCountry.languageCode,
    );
    const dispatch = useAppDispatch();

    const child_age = useAppSelector((state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != ''
        ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
        : [],
    );
    let createresult = await userRealmCommon.deleteChildReminders<ChildEntity>(
      ChildEntitySchema,
      hcuuid,
      'uuid ="' + activeChild.uuid + '"',
    );
    // console.log(createresult,"ReminderDeleted");
    if (createresult?.length > 0) {
      activeChild.reminders = createresult;
      dispatch(setActiveChildData(activeChild));
    }
    // setActiveChild(languageCode, activeChild.uuid, dispatch, child_age);
  };
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  let reminders = activeChild.reminders;
  // console.log(reminders,"UpcomingHealthCheckup-reminders");
  let hcReminder: any;
  const healthCheckupReminders = reminders.filter(
    (item) => item?.reminderType == 'healthCheckup',
  );
  if (healthCheckupReminders.length > 0) {
    healthCheckupReminders.forEach((healthCheckupReminder) => {
      let today = DateTime.fromJSDate(new Date());
      // let reminderDate = new Date(DateTime.fromMillis(healthCheckupReminder?.reminderDate));
      let reminderDate = new Date(DateTime.fromMillis(healthCheckupReminder?.reminderDate));

      // let reminderTime = DateTime.fromMillis(healthCheckupReminder?.reminderTime);
      const hours = new Date(healthCheckupReminder?.reminderTime).getHours()
      const mins = new Date(healthCheckupReminder?.reminderTime).getMinutes()
      reminderDate.setHours(hours);
      reminderDate.setMinutes(mins);

      // let days = DateTime.fromJSDate(reminderDate).diff(today, 'days').toObject().days;
      // console.log(days,"days")
      if (today.toMillis() < DateTime.fromJSDate(new Date(reminderDate)).toMillis()) {
        console.log('healthCheckupReminder', healthCheckupReminder);
        hcReminder = healthCheckupReminder
      }
    })

  }

  // console.log(healthCheckupReminder,"healthCheckupReminder",);

  const gotoArticle = (pinned_articleID) => {
    if (pinned_articleID != 0) {
      navigation.navigate('DetailsScreen', {
        fromScreen: 'HealthCheckupsTab',
        headerColor: artHeaderColor,
        backgroundColor: artBackgroundColor,
        detailData: pinned_articleID,
      });
    }
  };

  const allVaccineData = useAppSelector((state: any) =>
    JSON.parse(state.utilsData.vaccineData),
  );
  const getVaccineName = (vaccineID) => {
    return allVaccineData?.find((v) => v.uuid == vaccineID)?.title;
  };
  useEffect(() => {
    currentPeriodId == item?.id ? setIsOpen(true) : setIsOpen(false);
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
            {item?.growthMeasures?.didChildGetVaccines ||
              item?.growthMeasures?.isChildMeasured || item?.growthMeasures.doctorComment ? (
              <RadioActive style={{ backgroundColor: 'green' }}>
                <Icon name="ic_tick" size={12} color="#FFF" />
              </RadioActive>
            ) : (
              <Icon name="ic_plus" size={20} color="#000" />
              // <IconViewAlert>
              // <Icon
              //   name="ic_incom"
              //   size={24}
              //   color="#FFF"
              // /></IconViewAlert>
            )}
          </ToolsIconView>
          <ToolsHeadPress
            onPress={() => {
              setIsOpen(!isOpen);
            }}>
            <ToolsHeadingView>
              <Heading2>{item?.title}</Heading2>
              {item?.growthMeasures?.didChildGetVaccines ||
                item?.growthMeasures?.isChildMeasured || item?.isAdditional ? (
                <Text>{item?.growthMeasures?.measurementDate}</Text>
              ) : null}
            </ToolsHeadingView>

            <ToolsActionView>
              <FlexDirRow>
                <Icon
                  style={{ alignSelf: 'center' }}
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

              <FDirRowStart>
                <ToolsIconView>
                  <Icon name="ic_vaccination" size={20} color="#000" />
                </ToolsIconView>
                <ToolsHeadingView>

                  {item?.growthMeasures?.uuid ? (
                    <ShiftFromTop5>
                      <ShiftFromBottom15>
                        <Heading4Regular>
                          {item?.growthMeasures?.didChildGetVaccines ? t('hcVaccineText') : t('hcNoVaccineTxt')}
                        </Heading4Regular>
                      </ShiftFromBottom15>
                    </ShiftFromTop5>
                  ) :
                    (<ShiftFromTop5>
                      <ShiftFromBottom15>
                        <Heading4Regular>
                          {t('hcNoVaccineTxt')}
                        </Heading4Regular>
                      </ShiftFromBottom15>
                    </ShiftFromTop5>)
                  }

                  {item?.growthMeasures?.didChildGetVaccines ?

                    <HealthDesc>
                      {item?.growthMeasures?.measuredVaccineIds?.map(
                        (vaccineItem: any, index: number) => {
                          if (vaccineItem) {
                            return (
                              <View key={index}>
                                <BulletsView>
                                  <Bullets></Bullets>
                                  <Paragraph>
                                    {getVaccineName(vaccineItem?.uuid)}
                                  </Paragraph>
                                </BulletsView>
                              </View>
                            );
                          }
                        },
                      )}
                    </HealthDesc> : null}
                </ToolsHeadingView>
              </FDirRowStart>


              <FDirRowStart>
                <ToolsIconView>
                  <Icon name="ic_growth" size={20} color="#000" />
                </ToolsIconView>

                <ToolsHeadingView>
                  <ShiftFromTop5>
                    {
                      item?.growthMeasures?.weight && item?.growthMeasures?.measurementPlace == 0 ? (
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
                      <Heading4Regular>
                        {item?.growthMeasures?.doctorComment}
                      </Heading4Regular>
                    </ToolsHeadingView>
                  </FDirRowStart>
                </ShiftFromTop15>
              ) : null}
              {item?.pinned_article ? (
                <ShiftFromTop15>
                  <Pressable onPress={() => gotoArticle(item?.pinned_article)}>
                    <ButtonTextSmLineL numberOfLines={2}>{t('hcArticleLink')}</ButtonTextSmLineL>
                  </Pressable>
                </ShiftFromTop15>
              ) : null}
            </MainContainer>

            {currentPeriodId == item?.id ? (
              <MainContainer>
                {hcReminder ? (
                  <FDirRowStart>
                    <ToolsIconView>
                      <IconViewBg>
                        <Icon
                          name="ic_time"
                          size={20}
                          color="#FFF"

                        />
                      </IconViewBg>
                    </ToolsIconView>
                    <ToolsHeadView>
                      <ToolsHeadingView>
                        <Heading4Regular>{t('hcHasReminder')}</Heading4Regular>
                        <Heading4>
                          {
                            // DateTime.fromJSDate(
                            //   new Date(healthCheckupReminder?.reminderDate),
                            // ).toFormat('dd MMM yyyy')
                            formatStringDate(hcReminder?.reminderDate, luxonLocale)
                          }
                          {','}
                          {
                            // DateTime.fromJSDate(
                            //   new Date(healthCheckupReminder?.reminderTime),
                            // ).toFormat('hh:mm a')
                            formatStringTime(hcReminder?.reminderTime, luxonLocale)
                          }
                        </Heading4>
                      </ToolsHeadingView>
                      <ToolsActionView>
                        <Pressable
                          disabled={isFutureDate(activeChild?.birthDate)}
                          onPress={() => {
                            navigation.navigate('AddReminder', {
                              reminderType: 'healthCheckup', // from remiderType
                              headerTitle: t('vcEditReminderHeading'),
                              buttonTitle: t('hcReminderAddBtn'),
                              titleTxt: t('hcReminderText'),
                              warningTxt: t('hcReminderDeleteWarning'),
                              headerColor: headerColor,
                              editReminderItem: hcReminder,
                            });
                          }}>
                          <ButtonTextSmLine numberOfLines={2}>
                            {t('editCountryLang')}
                          </ButtonTextSmLine>
                        </Pressable>
                      </ToolsActionView>
                    </ToolsHeadView>
                  </FDirRowStart>
                ) : isFutureDate(activeChild?.birthDate) ? null : (
                  <Pressable
                    disabled={isFutureDate(activeChild?.birthDate)}
                    onPress={() => {
                      navigation.navigate('AddReminder', {
                        reminderType: 'healthCheckup', // from remiderType
                        headerTitle: t('vcReminderHeading'),
                        buttonTitle: t('hcReminderAddBtn'),
                        titleTxt: t('hcReminderText'),
                        warningTxt: t('hcReminderDeleteWarning'),
                        headerColor: headerColor,
                      });
                    }}>
                    <ButtonTextMdLine numberOfLines={2}>
                      {t('hcReminderbtn')}
                    </ButtonTextMdLine>
                  </Pressable>
                )}
                {/* Set Reminder Link */}
              </MainContainer>
            ) : null}
            {/* <Text>{item?.vaccination_opens},{item?.vaccination_ends},{childAgeIndays}</Text> */}
            {/* // perios's open and end contains curent child age in daays */}
            {item?.vaccination_opens <= childAgeIndays && item?.vaccination_ends > childAgeIndays ? (
              item?.growthMeasures?.uuid ? (
                <ShiftFromTopBottom10>
                  <Pressable
                    onPress={
                      () => { }
                      // navigation.navigate('AddChildHealthCheckup', {
                      //   headerTitle: t('hcEditHeaderTitle'),
                      //   // vcPeriod: item,
                      // })
                    }>
                    <ButtonTextMdLine numberOfLines={2}>{t('hcEditBtn')}</ButtonTextMdLine>
                  </Pressable>
                </ShiftFromTopBottom10>
              ) : (
                <ButtonContainerAuto>
                  <ButtonHealth
                    disabled={isFutureDate(activeChild?.birthDate)}
                    onPress={() =>
                      navigation.navigate('AddChildHealthCheckup', {
                        headerTitle: t('hcNewHeaderTitle'),
                        vcPeriod: item,
                      })
                    }>
                    <ButtonText numberOfLines={2}>{t('hcNewBtn')}</ButtonText>
                  </ButtonHealth>
                </ButtonContainerAuto>
              )
            ) : null}
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
