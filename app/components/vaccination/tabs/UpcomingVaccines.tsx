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
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import { userRealmCommon } from '../../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../../database/schema/ChildDataSchema';
import { setActiveChildData } from '../../../redux/reducers/childSlice';
import { isFutureDate } from '../../../services/childCRUD';
import { formatStringDate, formatStringTime } from '../../../services/Utils';
import {
  ButtonContainerAuto,
  ButtonText,
  ButtonTextMdLine,
  ButtonTextSmLine,
  ButtonTextSmLineL,
  ButtonVaccination
} from '../../shared/ButtonGlobal';
import Icon, { IconViewAlert, IconViewBg } from '../../shared/Icon';

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
    if(createresult?.length>0){
      activeChild.reminders=createresult;
      dispatch(setActiveChildData(activeChild));
      }
    // setActiveChild(languageCode, activeChild.uuid, dispatch, child_age);
  };
  let activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  let reminders = activeChild.reminders;
  // console.log(reminders,"UpcomingHealthCheckup-reminders");
  let vcReminder;
  const vaccineReminders = reminders.filter(
    (item) => item?.reminderType == 'vaccine',
  );
  if (vaccineReminders.length>0) {
    vaccineReminders.forEach((vaccineReminder)=>{
      let today = DateTime.fromJSDate(new Date());
      // let reminderDate = new Date(DateTime.fromMillis(vaccineReminder?.reminderDate));
      let reminderDate = new Date(DateTime.fromMillis(vaccineReminder?.reminderDate));
      
      // let reminderTime = DateTime.fromMillis(vaccineReminder?.reminderTime);
      const hours = new Date(vaccineReminder?.reminderTime).getHours()
      const mins = new Date(vaccineReminder?.reminderTime).getMinutes()
      reminderDate.setHours(hours);
      reminderDate.setMinutes(mins);
      
      // let days = DateTime.fromJSDate(reminderDate).diff(today, 'days').toObject().days;
      // console.log(days,"days")
      if (today.toMillis()<DateTime.fromJSDate(new Date(reminderDate)).toMillis()) {
        console.log('vaccineReminder',vaccineReminder);
        vcReminder = vaccineReminder
      }
    })
    
  }
  // if (vaccineReminder) {
  //   let today = DateTime.fromJSDate(new Date());
  //   let reminderDate = DateTime.fromMillis(vaccineReminder?.reminderDate);

  //   let days = reminderDate.diff(today, 'days').toObject().days;
  //   console.log(Math.round(days), 'Days');
  //   if (Math.round(days) < 0) {
  //     deleteReminder(vaccineReminder.uuid);
  //   }
  // }
 
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  useEffect(() => {
    currentPeriodId == item?.periodID ? setIsOpen(true) : setIsOpen(false);
    const yeas = item?.vaccines.some((el) => {
      return el.isMeasured == true;
    });
    console.log(yeas, 'isMeasuredyeas');
    // open first collapsible in upcoming vaccine period
  }, []);
  const gotoArticle = (pinned_articleID) => {
    if(pinned_articleID!=0){
    navigation.navigate('DetailsScreen', {
      fromScreen: 'VaccinationTab',
      headerColor: headerColor,
      backgroundColor: backgroundColor,
      detailData: pinned_articleID,
    });
  }
  };
  const doneVc = item?.vaccines.filter((item) => {
    return item?.isMeasured;
  });
  // console.log(doneVc.length,"doneVc");
  return (
    <>
      <ToolsListOuter>
        <ToolsListContainer
          style={{
            backgroundColor: backgroundColor,
          }}>
          <ToolsIconView>
            {item?.vaccines.every((el) => {
              return el.isMeasured == true;
            }) ? (
              <RadioActive style={{backgroundColor: 'green', borderRadius: 50}}>
                <Icon name="ic_tick" size={12} color="#FFF" />
              </RadioActive>
            ) : (
              <IconViewAlert>
                          <Icon
                            name="ic_incom"
                            size={24}
                            color="#FFF"
                          />
                        </IconViewAlert>
            )}
          </ToolsIconView>
          <ToolsHeadPress
            onPress={() => {
              setIsOpen(!isOpen);
            }}>
            <ToolsHeadingView>
              <Heading2>{item?.periodName}</Heading2>
              <Heading5>
                {t('vaccinesTxt')}{':'}{item?.vaccines.length}
                {' | '} 
                {t('vaccinesDoneTxt')}{':'}{doneVc ? doneVc.length : 0} {' | '}
                {t('vaccinesPendingTxt')}{':'}{item?.vaccines.length - (doneVc ? doneVc.length : 0)}
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
            {item?.vaccines.map((v, i) => {
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
                        <IconViewAlert>
                          <Icon
                            name="ic_incom"
                            size={24}
                            color="#FFF"
                          />
                        </IconViewAlert>
                      )}
                    </ToolsIconView>
                    <ToolsHeadingView>
                      <Heading4Regular>
                        {v.title}
                        {v.isMeasured ? ' - ' : null}{' '}
                        {v.isMeasured
                          ? 
                          // DateTime.fromJSDate(
                          //     new Date(v.measurementDate),
                          //   ).toFormat('dd/MM/yyyy')
                          formatStringDate(v.measurementDate,luxonLocale)
                          : null}
                      </Heading4Regular>
                      {v.isMeasured ? <Pressable onPress={() => 
                      navigation.navigate('AddChildVaccination', {
                        headerTitle: t('editVcTitle'),
                        vcPeriod: item,
                        editVaccineDate:v.measurementDate,
                      })}>
                          <ButtonTextSmLineL numberOfLines={2}>
                            {t('growthScreeneditText')}
                          </ButtonTextSmLineL>
                        </Pressable>: null}
                      {v?.pinned_article ? (
                        <Pressable
                          onPress={() => gotoArticle(v.pinned_article)}>
                          <ButtonTextSmLineL numberOfLines={2}>
                            {t('vcArticleLink')}
                          </ButtonTextSmLineL>
                        </Pressable>
                      ) : null}
                    </ToolsHeadingView>
                  </FDirRowStart>
                </MainContainer>
              );
            })}

            {/* Set Reminder After Add Time*/}
            {currentPeriodId == item?.periodID ? (
              <MainContainer>
                {vcReminder ? (
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
                          //   new Date(vaccineReminder?.reminderDate),
                          // ).toFormat('dd MMM yyyy')
                          formatStringDate(vcReminder?.reminderDate,luxonLocale)
                          }
                          {','}
                          {
                             formatStringTime(vcReminder?.reminderTime,luxonLocale)
                          // DateTime.fromJSDate(
                          //   new Date(vaccineReminder?.reminderTime),
                          // ).toFormat('hh:mm a')
                          }
                        </Heading4>
                      </ToolsHeadingView>
                      <ToolsActionView>
                        <Pressable
                          onPress={() => {
                            navigation.navigate('AddReminder', {
                              reminderType: 'vaccine', // from remiderType
                              headerTitle: t('vcEditReminderHeading'),
                              buttonTitle: t('vcReminderAddBtn'),
                              titleTxt: t('vcReminderText'),
                              warningTxt: t('vcReminderDeleteWarning'),
                              headerColor: headerColor,
                              editReminderItem: vcReminder,
                            });
                          }}>
                          <ButtonTextSmLine numberOfLines={2}>
                            {t('editCountryLang')}
                          </ButtonTextSmLine>
                        </Pressable>
                      </ToolsActionView>
                    </ToolsHeadView>
                  </FDirRowStart>
                ) : (
                  <Pressable
                    disabled={isFutureDate(activeChild?.birthDate)}
                    onPress={() => {
                      navigation.navigate('AddReminder', {
                        reminderType: 'vaccine', // from remiderType
                        headerTitle: t('vcReminderHeading'),
                        buttonTitle: t('vcReminderAddBtn'),
                        titleTxt: t('vcReminderText'),
                        warningTxt: t('vcReminderDeleteWarning'),
                        headerColor: headerColor,
                      });
                    }}>
                    <ButtonTextMdLine numberOfLines={2}>
                      {t('vcSetReminder')}
                    </ButtonTextMdLine>
                  </Pressable>
                )}
                {/* Set Reminder Link */}
              </MainContainer>
            ) : null}
            {/* add condition for only few vaccines are given in below */}
            {/* {currentPeriodId == item?.periodID &&
            item?.vaccines.some((el) => {
              return el.isMeasured == true;
            }) ? (
              <ShiftFromTopBottom10>
                <Pressable
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={
                    () => console.log(item)
                    // navigation.navigate('AddChildVaccination', {
                    //   headerTitle: t('editVcTitle'),
                    //   vcPeriod: item,
                    // })
                  }>
                  <ButtonTextMdLine numberOfLines={2}>{t('vcEditDataBtn')}</ButtonTextMdLine>
                </Pressable>
              </ShiftFromTopBottom10>
            ) : null} */}
            {/* remaining add condition for all vaccines were not given in below */}
            {currentPeriodId == item?.periodID &&
            item?.vaccines.some((el) => {
              return el.isMeasured == false;
            }) ? (
              <ButtonContainerAuto>
                <ButtonVaccination
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={() =>
                    navigation.navigate('AddChildVaccination', {
                      headerTitle: t('addVcTitle'),
                      vcPeriod: item,
                    })
                  }>
                  <ButtonText numberOfLines={2}>
                  {t('vcAddBtn')}
                  </ButtonText>
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
