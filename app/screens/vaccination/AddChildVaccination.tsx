import { VACCINE_ADDED } from '@assets/data/firebaseEvents';
import { maxCharForRemarks } from '@assets/translations/appOfflineData/apiConstants';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainer,
  ButtonContainerTwo,
  ButtonSecondary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText,
} from '@components/shared/ButtonGlobal';
import {
  FormContainerFlex,
  FormDateAction, FormDateText1,
  FormInputBoxWithoutLine,
  FormInputGroup,
  FormInputText,
  TextAreaBox
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import { FDirRow, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import {
  HeaderActionView,
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon, { IconML } from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import {
  RadioBoxContainer,
  RadioInnerBox,
  RadioOuter
} from '@components/shared/radio';
import TextInputML from '@components/shared/TextInputML';
import PlannedVaccines from '@components/vaccination/PlannedVaccines';
import PrevPlannedVaccines from '@components/vaccination/PrevPlannedVaccines';
import TakenVaccines from '@components/vaccination/TakenVaccines';
import DateTimePicker from '@react-native-community/datetimepicker';
import { vaccinationColor } from '@styles/style';
import {
  Heading2,
  Heading3,
  Heading3Center,
  Heading4Regular,
  ShiftFromTop15,
  ShiftFromTopBottom10
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemeContext } from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../database/schema/ChildDataSchema';
import { setActiveChildData } from '../../redux/reducers/childSlice';
import { setAllLocalNotificationGenerateType } from '../../redux/reducers/notificationSlice';
import {
  setInitialHeightValues,
  setInitialWeightValues
} from '../../services/growthService';
import { getMeasuresForDate, isAnyMeasureExistForDate, isGrowthMeasureExistForDate, isVaccineMeasureExistForDate } from '../../services/measureUtils';
import { formatStringDate } from '../../services/Utils';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
import { logEvent } from '../../services/EventSyncService';
import ToggleRadiosBgColor from '@components/ToggleRadiosBgColor';

const styles = StyleSheet.create({
  constinerView: {
    backgroundColor: vaccinationColor,
    flex: 1
  },
  headerActionStyle: {
    padding: 0
  },
  headerRowStyle: {
    backgroundColor: vaccinationColor,
    maxHeight: 50,
  },
  headingFlexShrink: {
    flexShrink: 1
  },
  pressableStyle: {
    paddingLeft: 10,
    paddingRight: 10
  },
  scrollViewStyle: {
    flex: 9
  },
  textInputStyle: {
    flex: 1,
    padding: 10,
    textAlignVertical: 'top'
  }
})
const AddChildVaccination = ({ route, navigation }: any): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const { vcPeriod, editVaccineDate } = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext?.colors.VACCINATION_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editVaccineDate ? editVaccineDate : null,
  );
  const [clicked, setClicked] = useState(false);
  const [editVCDate, seteditVCDate] = useState<DateTime>(editVaccineDate ? editVaccineDate : null);
  const [showmeasureDate, setmeasureDateShow] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [plannedVaccine, setPlannedVaccine] = useState([]);
  const [prevPlannedVaccine, setPrevPlannedVaccine] = useState([]);
  const [takenVaccine, setTakenVaccine] = useState([]);
  const [takenVaccineForPrevPeriod, setTakenVaccineForPrevPeriod] = useState([]);
  const [weightValue, setWeightValue] = useState(0);
  const [heightValue, setHeightValue] = useState(0);
  const [remarkTxt, handleDoctorRemark] = useState<string>('');
  const isMeasuredOptions = [
    { title: t('vcIsMeasuredOption1') },
    { title: t('vcIsMeasuredOption2') },
  ];
  const [defaultMeasured, setDefaultMeasured] = useState<any>();
  const [dateTouched, setDateTouched] = useState<boolean>(false);
  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] = useState(false);
  const dispatch = useAppDispatch();
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const locale = useAppSelector((state: any) => state.selectedCountry?.locale);
  
  const deleteVaccination = async (): Promise<any> => {
    if (editVCDate) {
      const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editVCDate)), activeChild)
      //delete measure obj
      const deleteresult = await userRealmCommon.deleteChildMeasures<ChildEntity>(
        ChildEntitySchema,
        existingMeasure,
        'uuid ="' + activeChild.uuid + '"',
      );
      if (deleteresult) {
        activeChild.measures = deleteresult;
        dispatch(setActiveChildData(activeChild));
        setModalVisible(false);
      }
      navigation.goBack();
    }
  }
  const allVaccinePeriods = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  const checkIfMeasuredVaccineExistsForLocale = (vaccineIds: any): any => {
    return vaccineIds?.filter((vcId: any) => {
      return allVaccinePeriods.some((el: any) => {
        return vcId.uuid === el.uuid;
      });
    });
  }
  useEffect(() => {
    if (editVaccineDate) {
      setShowDelete(true)
      const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editVaccineDate)), activeChild)
      setmeasureDate(DateTime.fromJSDate(new Date(editVaccineDate)));
      seteditVCDate(DateTime.fromJSDate(new Date(editVaccineDate)));
      setIsMeasured(existingMeasure?.isChildMeasured)
      setDefaultMeasured(existingMeasure?.isChildMeasured == true ? isMeasuredOptions[0] : isMeasuredOptions[1])
      setWeightValue(existingMeasure?.weight)
      setHeightValue(existingMeasure?.height)
      handleDoctorRemark(existingMeasure?.doctorComment)
      const existingMeasuredVaccines = checkIfMeasuredVaccineExistsForLocale((existingMeasure?.vaccineIds && existingMeasure?.vaccineIds != '' && existingMeasure?.vaccineIds != null) ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(existingMeasure?.vaccineIds)) : [])
      if (existingMeasuredVaccines?.length > 0) {
        existingMeasuredVaccines?.forEach((element: any) => {
          element['id'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.id
          element['uuid'] = element?.uuid
          element['title'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.title
          element['isMeasured'] = true
          element['pinned_article'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.pinned_article
        });
        setTakenVaccine(existingMeasuredVaccines);
        setTakenVaccineForPrevPeriod(existingMeasuredVaccines)
      }
    }
  }, [editVaccineDate])

  const getCheckedItem = (checkedItem: typeof isMeasuredOptions[0]): any => {
    setIsMeasured(checkedItem == isMeasuredOptions[0] ? true : false);
  };
  const onmeasureDateChange = (event: any, selectedDate: any): any => {
    setmeasureDateShow(false);
    if (selectedDate) {
      setmeasureDate(DateTime.fromJSDate(selectedDate));
      setDateTouched(true);
      if (editVaccineDate) {
        setShowDelete(true)
        //form edit not allowed 
        if (isGrowthMeasureExistForDate(DateTime.fromJSDate(new Date(selectedDate)), activeChild) || isVaccineMeasureExistForDate(DateTime.fromJSDate(new Date(selectedDate)), activeChild)) {
          // Measure data is already available for this date, you can not select this date
          Alert.alert(t('alertForModifyMeasures'),
            t('alertForExistingMeasuresTitle'),
            [
              {
                text: t('alertForModifyMeasuresOk'),
                onPress: (): any => {
                  setmeasureDate(editVaccineDate)
                },
                style: "cancel",
              },
            ],
            {
              cancelable: false,
            })

        } else {
          //allow editing measuredate
        }
      } else {
        if (isGrowthMeasureExistForDate(DateTime.fromJSDate(selectedDate), activeChild) || isVaccineMeasureExistForDate(DateTime.fromJSDate(selectedDate), activeChild)) {
          Alert.alert(t('alertForModifyMeasures'),
            t('alertForModifyMeasuresTitle'),
            [
              {
                text: t('alertForModifyMeasuresOk'),
                onPress: (): any => {
                  const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(selectedDate), activeChild)
                  setShowDelete(true)
                  seteditVCDate(DateTime.fromJSDate(selectedDate));
                  setWeightValue(existingMeasure?.weight)
                  setHeightValue(existingMeasure?.height)
                  handleDoctorRemark(existingMeasure?.doctorComment)
                  setIsMeasured(existingMeasure?.isChildMeasured);
                  setDefaultMeasured(existingMeasure?.isChildMeasured == true ? isMeasuredOptions[0] : isMeasuredOptions[1])
                  const existingMeasuredVaccines = (existingMeasure?.vaccineIds && existingMeasure?.vaccineIds != '' && existingMeasure?.vaccineIds != null) ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(existingMeasure?.vaccineIds)) : [];
                  if (existingMeasuredVaccines?.length > 0) {
                    existingMeasuredVaccines?.forEach((element: any) => {
                      const elementUUID = element.uuid;
                      element['id'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.id
                      element['uuid'] = elementUUID
                      element['title'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.title
                      element['isMeasured'] = true
                      element['pinned_article'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.pinned_article
                    });
                    setTakenVaccine(existingMeasuredVaccines);
                    setTakenVaccineForPrevPeriod(existingMeasuredVaccines)
                  }

                },
                style: "cancel",
              },
            ],
            {
              cancelable: false,
            })
        } else {
          //this is first time add vaccination date selection
        }
      }
    }
  };
  const handleMeasureConfirm = (event: any): any => {
    const date = event;
    onmeasureDateChange(event, date);
    setMeasureDatePickerVisibility(false);
  };
  const minChildGrwothDate =
    activeChild.birthDate != '' &&
      activeChild.birthDate != null &&
      activeChild.birthDate != undefined
      ? activeChild.birthDate
      : new Date();
  React.useEffect(() => {
    if (route.params?.weight) {
      setIsMeasured(true);
      setWeightValue(route.params?.weight);
    }
    if (route.params?.height) {
      setIsMeasured(true);
      setHeightValue(route.params?.height);
    }
  }, [route.params?.weight, route.params?.height]);
  const isFormDisabled = (): any => {
    if (measureDate) {
      const modifiedTakenVaccines = takenVaccine.filter(
        item => item['isMeasured'] == true
      ).map(({ uuid }) => ({ uuid }))
      const allVaccines: any = [...plannedVaccine, ...prevPlannedVaccine, ...modifiedTakenVaccines];
      if (allVaccines.length > 0) {
        if (isMeasured) {
          if (heightValue != 0 && weightValue != 0) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      } else {
        if (isMeasured) {
          if (heightValue != 0 && weightValue != 0) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  };
  const onPlannedVaccineToggle = (checkedVaccineArray: any): any => {
    setPlannedVaccine(checkedVaccineArray);
  };
  const onTakenVaccineToggle = (checkedVaccineArray: any): any => {
    setTakenVaccine(checkedVaccineArray);
    setTakenVaccineForPrevPeriod(checkedVaccineArray);
  };
  const onPrevPlannedVaccineToggle = (checkedVaccineArray: any): any => {
    setPrevPlannedVaccine(checkedVaccineArray);
  };
  const saveChildMeasures = async (): Promise<any> => {
    const modifiedTakenVaccines = takenVaccine.filter(
      item => item['isMeasured'] == true
    ).map(({ uuid }) => ({ uuid }))
    const allVaccines: any = [...plannedVaccine, ...prevPlannedVaccine, ...modifiedTakenVaccines];
    const measurementDateParam = editVaccineDate
      ? dateTouched
        ? measureDate?.toMillis()
        : editVaccineDate
      : measureDate?.toMillis();
    const titleDateInMonthParam = editVaccineDate
      ? dateTouched
        ? measureDate.toFormat('MM')
        : measureDate.toFormat('MM')
      : measureDate.toFormat('MM');
    if (allVaccines.length == 0) {
      Alert.alert(t('alertForModifyMeasures'),
        t('alertForNoTakenVaccinesSelectTitle'),
        [
          {
            text: t('alertForModifyMeasuresOk'),
            onPress: (): any => {
              // setmeasureDate(editVaccineDate)
            },
            style: "cancel",
          },
        ],
        {
          cancelable: false,
        })
      setClicked(false);
    } else {
      if (editVCDate) {
        const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editVCDate)), activeChild)
        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: isMeasured,
          weight: isMeasured ? String(weightValue) : '0',
          height: isMeasured ? String(heightValue) : '0',
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: allVaccines.length > 0 ? true : false,
          vaccineIds: allVaccines.length > 0 ? JSON.stringify(allVaccines) : '',
          doctorComment: remarkTxt,
          measurementPlace: 0,
        };
        const updateresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValues,
          'uuid ="' + activeChild.uuid + '"',
        );
        if (updateresult?.length > 0) {
          activeChild.measures = updateresult;
          dispatch(setActiveChildData(activeChild));
          const localnotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: activeChild.uuid };
          dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
          setModalVisible(false);
        }
        setClicked(false);
        navigation.goBack();
      } else {
        if (isAnyMeasureExistForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild)) {
          const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild)

          const growthValues = {
            uuid: existingMeasure.uuid,
            isChildMeasured: isMeasured,
            weight: isMeasured ? String(weightValue) : '0',
            height: isMeasured ? String(heightValue) : '0',
            measurementDate: measurementDateParam,
            titleDateInMonth: titleDateInMonthParam.toString(),
            didChildGetVaccines: allVaccines.length > 0 ? true : false,
            vaccineIds: allVaccines.length > 0 ? JSON.stringify(allVaccines) : '',
            doctorComment: remarkTxt,
            measurementPlace: 0,
          };
          const createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValues,
            'uuid ="' + activeChild.uuid + '"',
          );
          if (createresult?.length > 0) {
            activeChild.measures = createresult;
            dispatch(setActiveChildData(activeChild));
            const localnotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: activeChild.uuid };
            dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
          }
          setClicked(false);
          navigation.goBack();

        } else {
          // check if blank healthcheckup is done or not?// is there entry exists for that date update or else add?
          const growthValues = {
            uuid: uuidv4(),
            isChildMeasured: isMeasured,
            weight: isMeasured ? String(weightValue) : '0',
            height: isMeasured ? String(heightValue) : '0',
            measurementDate: measurementDateParam,
            titleDateInMonth: titleDateInMonthParam.toString(),
            didChildGetVaccines: allVaccines.length > 0 ? true : false,
            vaccineIds: JSON.stringify(allVaccines),
            doctorComment: remarkTxt,
            measurementPlace: 0,
          };
          const createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
            ChildEntitySchema,
            growthValues,
            'uuid ="' + activeChild.uuid + '"',
          );
          if (createresult?.length > 0) {
            activeChild.measures = createresult;
            dispatch(setActiveChildData(activeChild));
            const localnotiFlagObj = { generateFlag: true, generateType: 'add', childuuid: activeChild.uuid };
            dispatch(setAllLocalNotificationGenerateType(localnotiFlagObj));
            const eventData = { 'name': VACCINE_ADDED, 'params': { age_id: activeChild?.taxonomyData?.id, measured_at: 'doctor' } }
            logEvent(eventData, netInfo.isConnected)
          }
          setClicked(false);
          navigation.goBack();
        }
      }
    }
  };
  const onBackPress = (): any => {
    navigation.goBack();
    return true;
  }
  const disableSave = (): any => {
    if (clicked == true && isFormDisabled() == true) {
      return true;
    }
    else if (isFormDisabled() == true && clicked == false) {
      return true;
    }
    else if (isFormDisabled() == false && clicked == true) {
      return true;
    }
    else if (isFormDisabled() == false && clicked == false) {
      return false;
    }
    else {
      return false;
    }
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    navigation.addListener('gestureEnd', onBackPress);
    return (): any => {
      navigation.removeListener('gestureEnd', onBackPress);
      backHandler.remove()
    };
  }, []);
  return (
    <>
      <View style={styles.constinerView}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <HeaderRowView
          style={styles.headerRowStyle}>
          <HeaderIconView>
            <HeaderIconPress
              onPress={(): any => {
                navigation.goBack();
              }}>
              <IconML name={'ic_back'} color="#000" size={15} />
            </HeaderIconPress>
          </HeaderIconView>
          <HeaderTitleView>
            <Heading2 numberOfLines={1}>{showDelete ? t('editVcTitle') : t('addVcTitle')}</Heading2>
          </HeaderTitleView>
          {showDelete ? <HeaderActionView style={styles.headerActionStyle}>
            <Pressable style={styles.pressableStyle} onPress={(): any => { setModalVisible(true); }}>
              <Icon name={'ic_trash'} size={20} color="#000" />
            </Pressable>
          </HeaderActionView> : null}
        </HeaderRowView>

        <ScrollView style={styles.scrollViewStyle} keyboardShouldPersistTaps={'always'}>
          <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={'always'}>
            <MainContainer>
              <FormInputGroup onPress={(): any => {
                setmeasureDateShow(true);
                if (Platform.OS == 'ios') {
                  setMeasureDatePickerVisibility(true);
                }
              }}
              >
                {Platform.OS != 'ios' ? (
                  <FormInputBoxWithoutLine>
                    <FormDateText1>
                      <Text>
                        {' '}
                        {measureDate
                          ?
                          formatStringDate(measureDate)
                          : t('vcScreenenterDateText')}
                      </Text>
                      {showmeasureDate && (
                        <DateTimePicker
                          testID="measureDatePicker"
                          value={
                            editVaccineDate ? new Date(editVaccineDate) : new Date()
                          }
                          mode={'date'}
                          locale={locale}
                          display="spinner"
                          maximumDate={new Date()}
                          minimumDate={new Date(minChildGrwothDate)}
                          onChange={onmeasureDateChange}
                        />
                      )}
                    </FormDateText1>
                    <FormDateAction>
                      <Icon name="ic_calendar" size={20} color="#000" />
                    </FormDateAction>
                  </FormInputBoxWithoutLine>
                ) : (
                  <FormInputBoxWithoutLine>
                    <FormDateText1>
                      <Text>
                        {' '}
                        {measureDate
                          ?
                          formatStringDate(measureDate)
                          : t('vcScreenenterDateText')}
                      </Text>
                      <DateTimePickerModal
                        isVisible={isMeasureDatePickerVisible}
                        mode="date"
                        locale={locale}
                        onConfirm={handleMeasureConfirm}
                        date={editVaccineDate ? new Date(editVaccineDate) : new Date()}
                        onCancel={(): any => {
                          setMeasureDatePickerVisibility(false);
                        }}
                        maximumDate={new Date()}
                        minimumDate={new Date(minChildGrwothDate)}
                      />

                    </FormDateText1>
                    <FormDateAction>
                      <Icon name="ic_calendar" size={20} color="#000" />
                    </FormDateAction>
                  </FormInputBoxWithoutLine>
                )}
              </FormInputGroup>
              {takenVaccine?.length > 0 ?
                <FormContainerFlex>
                  <FormInputText>
                    <Heading3>{t('vcTaken')}</Heading3>
                  </FormInputText>
                  <TakenVaccines
                    fromScreen={'AddChildVaccination'}
                    takenVaccines={takenVaccine}
                    backgroundActiveColor={headerColor}
                    onTakenVaccineToggle={onTakenVaccineToggle}
                  /></FormContainerFlex>
                : null}
              {vcPeriod?.vaccines.filter((item: any) => {
                return item.isMeasured == false;
              }).length > 0 ?
                <FormContainerFlex>
                  <FormInputText>
                    <Heading3>{t('vcPlanned')}</Heading3>
                  </FormInputText>
                  <PlannedVaccines
                    fromScreen={'AddChildVaccination'}
                    currentPeriodVaccines={vcPeriod?.vaccines}
                    backgroundActiveColor={headerColor}
                    onPlannedVaccineToggle={onPlannedVaccineToggle}
                  />
                </FormContainerFlex>
                : null}
              <FormContainerFlex>
                <FormInputText>
                  <Heading3>{t('vcPrev')}</Heading3>
                </FormInputText>
                <PrevPlannedVaccines
                  fromScreen={'AddChildVaccination'}
                  currentPeriodVaccines={vcPeriod?.vaccines}
                  takenVaccine={takenVaccineForPrevPeriod}
                  backgroundActiveColor={headerColor}
                  isEditScreen={showDelete}
                  onPrevPlannedVaccineToggle={onPrevPlannedVaccineToggle}
                />
              </FormContainerFlex>

              <FormContainerFlex>
                <FormInputText>
                  <Heading3>{t('vcChildMeasureQ')}</Heading3>
                </FormInputText>
                <ToggleRadiosBgColor
                  options={isMeasuredOptions}
                  defaultValue={defaultMeasured}
                  tickbgColor={headerColor}
                  tickColor={'#000'}
                  getCheckedItem={getCheckedItem}
                />
              </FormContainerFlex>

              {isMeasured ? (
                <>
                  <ShiftFromTop15>
                    <FormInputText>
                      <Heading3>{t('growthScreenenterMeasuresText')}</Heading3>
                    </FormInputText>
                    <RadioBoxContainer>
                      <FDirRow>
                        <RadioOuter>
                          <RadioInnerBox
                            onPress={(): any => {
                              navigation.navigate('AddNewChildWeight', {
                                prevRoute: 'AddChildVaccination',
                                headerColor,
                                backgroundColor,
                                weightValue: setInitialWeightValues(weightValue),
                              });
                            }}>
                            <FlexFDirRowSpace>
                              <Heading3 style={styles.headingFlexShrink} numberOfLines={2}>
                                {weightValue
                                  ? weightValue
                                  : t('growthScreenwText')}

                              </Heading3>
                              <Heading4Regular>
                                {t('growthScreenkgText')}
                              </Heading4Regular>
                            </FlexFDirRowSpace>
                          </RadioInnerBox>
                        </RadioOuter>
                        <RadioOuter>
                          <RadioInnerBox
                            onPress={(): any => {
                              navigation.navigate('AddNewChildHeight', {
                                prevRoute: 'AddChildVaccination',
                                headerColor,
                                backgroundColor,
                                heightValue: setInitialHeightValues(heightValue),
                              });
                            }}>
                            <FlexFDirRowSpace>
                              <Heading3 style={styles.headingFlexShrink} numberOfLines={2}>
                                {heightValue
                                  ? heightValue
                                  : t('growthScreenhText')}
                              </Heading3>
                              <Heading4Regular>
                                {t('growthScreencmText')}
                              </Heading4Regular>
                            </FlexFDirRowSpace>
                          </RadioInnerBox>
                        </RadioOuter>
                      </FDirRow>
                    </RadioBoxContainer>
                  </ShiftFromTop15>
                </>
              ) : null}

              <FormContainerFlex>
                <FormInputText>
                  <Heading3>{t('vcDoctorRemark')}</Heading3>
                </FormInputText>

                <TextAreaBox>
                  <TextInputML style={styles.textInputStyle}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={maxCharForRemarks}
                    clearButtonMode="always"
                    defaultValue={remarkTxt}
                    multiline={true}
                    onChangeText={(text): any => handleDoctorRemark(text)}
                    placeholder={t('vcDoctorRemarkPlaceHolder')}
                    placeholderTextColor={"gray"}
                    allowFontScaling={false}

                  />
                </TextAreaBox>

              </FormContainerFlex>

            </MainContainer>
            <ButtonContainer>
              <ButtonTertiary
                disabled={disableSave()}
                onPress={(e): any => {
                  e.stopPropagation();
                  setClicked(true);
                  setTimeout(() => {
                    saveChildMeasures().then(() => { console.log("in then") });
                  }, 0);
                }}>
                <ButtonText numberOfLines={2}>{t('growthScreensaveMeasures')}</ButtonText>
              </ButtonTertiary>
            </ButtonContainer>
          </KeyboardAwareScrollView>
        </ScrollView>


        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={(): any => {
            setModalVisible(false);
          }}
          onDismiss={(): any => {
            setModalVisible(false);
          }}>
          <PopupOverlay>
            <ModalPopupContainer>
              <PopupCloseContainer>
                <PopupClose
                  onPress={(): any => {
                    setModalVisible(false);
                  }}>
                  <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
              </PopupCloseContainer>
              <ShiftFromTopBottom10>
                <Heading3Center>{t('vcDeleteWarning')}</Heading3Center>
              </ShiftFromTopBottom10>
              <ButtonContainerTwo>
                <ButtonColTwo>
                  <ButtonSecondaryTint onPress={(): any => {
                    setModalVisible(false);
                  }}>
                    <ButtonText numberOfLines={2}>{t('growthDeleteOption1')}</ButtonText>
                  </ButtonSecondaryTint>
                </ButtonColTwo>

                <ButtonColTwo>
                  <ButtonSecondary onPress={(): any => {
                    deleteVaccination();
                  }}>
                    <ButtonText numberOfLines={2}>{t('growthDeleteOption2')}</ButtonText>
                  </ButtonSecondary>
                </ButtonColTwo>
              </ButtonContainerTwo>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </View>
    </>
  );
};

export default AddChildVaccination;
