import { MainContainer } from '@components/shared/Container';
import { FDirRowStart } from '@components/shared/FlexBoxStyle';
import { RadioActive } from '@components/shared/radio';
import {
  ToolsActionView,
  ToolsHeadingView,
  ToolsHeadPress,
  ToolsIconView,
  ToolsIconView1,
  ToolsListContainer,
  ToolsListOuter,
} from '@components/shared/ToolsStyle';
import { useNavigation } from '@react-navigation/native';
import { greenColor } from '@styles/style';
import { Heading2, Heading4, Heading4Regular, Heading5 } from '@styles/typography';
import { DateTime } from 'luxon';
import  React,{ useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../../../App';
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
const styles=StyleSheet.create({
  alignCenter:{alignSelf: 'center' },
  radioActive:{backgroundColor: greenColor, borderRadius: 50 },
  textNoLine:{ textDecorationLine: "none" },
  toolsIconOuterView:{ alignItems: "flex-end", flex: 1 },
  vaccineOuterView:{ flex: 6, flexDirection: "row" }
 })
const UpcomingVaccines = (props: any):any => {
  const {item, headerColor, backgroundColor, currentPeriodId} =props;
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const reminders = activeChild.reminders;
  let vcReminder: any;
  const vaccineReminders = reminders.filter(
    (item:any) => item?.reminderType == 'vaccine',
  );
  if (vaccineReminders.length>0) {
    vaccineReminders.forEach((vaccineReminder:any)=>{
      const today = DateTime.fromJSDate(new Date());
      const reminderDate = new Date(DateTime.fromMillis(vaccineReminder?.reminderDate));
      const hours = new Date(vaccineReminder?.reminderTime).getHours()
      const mins = new Date(vaccineReminder?.reminderTime).getMinutes()
      reminderDate.setHours(hours);
      reminderDate.setMinutes(mins);
      if (today.toMillis()<DateTime.fromJSDate(new Date(reminderDate)).toMillis()) {
      vcReminder = vaccineReminder
      }
    })
    
  }
  useEffect(() => {
    currentPeriodId == item?.periodID ? setIsOpen(true) : setIsOpen(false);
    // open first collapsible in upcoming vaccine period
  }, []);
  const gotoArticle = (pinned_articleID:any):any => {
    if(pinned_articleID!=0){
    navigation.navigate('DetailsScreen', {
      fromScreen: 'VaccinationTab',
      headerColor: headerColor,
      backgroundColor: backgroundColor,
      detailData: pinned_articleID,
    });
  }
  };
  const doneVc = item?.vaccines.filter((item:any) => {
    return item?.isMeasured;
  });
   return (
    <>
      <ToolsListOuter>
        <ToolsListContainer
          style={{
            backgroundColor: backgroundColor
          }}>
          <ToolsIconView>
            {item?.vaccines.every((el:any) => {
              return el.isMeasured == true;
            }) ? (
              <RadioActive style={styles.radioActive}>
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
            onPress={():any => {
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
                style={styles.alignCenter}
                name={isOpen ? 'ic_angle_up' : 'ic_angle_down'}
                size={10}
                color="#000"
              />
            </ToolsActionView>
          </ToolsHeadPress>
        </ToolsListContainer>
        {isOpen ? (
          <>
            {item?.vaccines.map((v:any, i:any) => {
              return (
                <MainContainer key={i}>
                  <FDirRowStart>     
                    <View style={styles.vaccineOuterView}>
                    <ToolsIconView>
                      {v.isMeasured ? (
                        <RadioActive
                          style={styles.radioActive}>
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
                           formatStringDate(v.measurementDate)
                          : null}
                      </Heading4Regular>
                      {v?.pinned_article ? (
                        <Pressable
                          onPress={():any => gotoArticle(v.pinned_article)}>
                          <ButtonTextSmLineL numberOfLines={2}>
                            {t('vcArticleLink')}
                          </ButtonTextSmLineL>
                        </Pressable>
                      ) : null}
                    </ToolsHeadingView>
                    </View>
                    <View  style={styles.toolsIconOuterView}>
                    {v.isMeasured ? <Pressable onPress={():any =>navigation.navigate('AddChildVaccination', {
                        headerTitle: t('editVcTitle'),
                        vcPeriod: item,
                        editVaccineDate:v.measurementDate,
                      })}>
                    <ToolsIconView1>
                           <ButtonTextSmLineL numberOfLines={2} style={styles.textNoLine}><Icon
                      name="ic_edit"
                      size={16}
                      color="#000"
                    /></ButtonTextSmLineL>
                    </ToolsIconView1>
                    </Pressable>: null}
                    </View>
                  </FDirRowStart>
                </MainContainer>
              );
            })}

            {/* Set Reminder After Add Time*/}
            {currentPeriodId == item?.periodID ? (
              <MainContainer>
                {vcReminder ? (
                  <FDirRowStart>
                     <View style={styles.vaccineOuterView}>
                    <ToolsIconView>
                    <IconViewBg>
                      <Icon
                        name="ic_time"
                        size={20}
                        color="#FFF"
                        
                      />
                      </IconViewBg>
                    </ToolsIconView>
                      <ToolsHeadingView>
                        <Heading4Regular>{t('vcHasScheduled')}</Heading4Regular>
                        <Heading4>
                          {
                          formatStringDate(vcReminder?.reminderDate)
                          }
                          {','}
                          {
                             formatStringTime(vcReminder?.reminderTime)
                          }
                        </Heading4>
                      </ToolsHeadingView>
                    
                    </View>
                    <View  style={styles.toolsIconOuterView}>
                    <Pressable
                          onPress={():any => {
                            navigation.navigate('AddReminder', {
                              reminderType: 'vaccine', // from remiderType
                              headerTitle: t('vcEditReminderHeading'),
                              buttonTitle: t('vcReminderAddBtn'),
                              titleTxt: t('vcReminderText'),
                              titleTxt2: t('vcDefinedReminderText'),
                              warningTxt: t('vcReminderDeleteWarning'),
                              headerColor: headerColor,
                              editReminderItem: vcReminder,
                            });
                          }}>
                      <ToolsIconView1>
                          <ButtonTextSmLine numberOfLines={2} style={styles.textNoLine}>
                          <Icon name="ic_edit" size={16} color="#000" />
                          </ButtonTextSmLine>
                      </ToolsIconView1>
                      </Pressable>
                      </View>
                  </FDirRowStart>
                ) : (
                  <Pressable
                    disabled={isFutureDate(activeChild?.birthDate)}
                    onPress={():any => {
                      navigation.navigate('AddReminder', {
                        reminderType: 'vaccine', // from remiderType
                        headerTitle: t('vcReminderHeading'),
                        buttonTitle: t('vcReminderAddBtn'),
                        titleTxt: t('vcReminderText'),
                        titleTxt2: t('vcDefinedReminderText'),
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
            {currentPeriodId == item?.periodID &&
            item?.vaccines.some((el:any) => {
              return el.isMeasured == false;
            }) ? (
              <ButtonContainerAuto>
                <ButtonVaccination
                  disabled={isFutureDate(activeChild?.birthDate)}
                  onPress={():any =>
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
