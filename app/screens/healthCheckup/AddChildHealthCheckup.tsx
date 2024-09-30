import { GROWTH_MEASUREMENT_ADDED, HEALTH_CHECKUP_ENTERED, VACCINE_ADDED } from '@assets/data/firebaseEvents';
import { maxCharForRemarks } from '@assets/translations/appOfflineData/apiConstants';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainer,
  ButtonContainerTwo,
  ButtonPrimary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText,
} from '@components/shared/ButtonGlobal';
import {
  FormContainerFlex, FormDateAction, FormDateText1,
  FormInputBoxWithoutLine,
  FormInputGroup,
  FormInputText,
  TextAreaBox
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import {
  FDirRow,
  FlexCol,
  FlexFDirRowSpace
} from '@components/shared/FlexBoxStyle';
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
import ToggleRadiosBgColor from '@components/ToggleRadiosBgColor';
import PlannedVaccines from '@components/vaccination/PlannedVaccines';
import PrevPlannedVaccines from '@components/vaccination/PrevPlannedVaccines';
import TakenVaccines from '@components/vaccination/TakenVaccines';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import {
  Alert,
  BackHandler,
  Modal,
  Platform, Pressable, StyleSheet, Text,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemeContext } from 'styled-components/native';
import { v4 as uuid } from 'uuid';
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
import { getAllHealthCheckupPeriods } from '../../services/healthCheckupService';
import { getMeasuresForDate, isGrowthMeasureExistForDate, isVaccineMeasureExistForDate } from '../../services/measureUtils';
import { formatStringDate } from '../../services/Utils';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
import { logEvent } from '../../services/EventSyncService';
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  flex9: { flex: 9 },
  maxHeight: { maxHeight: 50 },
  overflowHidden: { overflow: 'hidden' },
  padding0: { padding: 0 },
  padding10: { paddingLeft: 10, paddingRight: 10 },
  textInputMl: { flex: 1, padding: 10, textAlignVertical: 'top' }

})
const AddChildHealthCheckup = ({ route, navigation }: any): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const { vcPeriod, editMeasurementDate } = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.HEALTHCHECKUP_COLOR;
  const backgroundColor = themeContext?.colors.HEALTHCHECKUP_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editMeasurementDate ? editMeasurementDate : null,
  );
  const [editHCDate, seteditHCDate] = useState<any>(editMeasurementDate ? editMeasurementDate : null);
  const [takenVaccine, setTakenVaccine] = useState([]);
  const [takenVaccineForPrevPeriod, setTakenVaccineForPrevPeriod] = useState([]);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showmeasureDate, setmeasureDateShow] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [isVaccineMeasured, setIsVaccineMeasured] = useState(false);
  const [plannedVaccine, setPlannedVaccine] = useState([]);
  const [prevPlannedVaccine, setPrevPlannedVaccine] = useState([]);
  const [weightValue, setWeightValue] = useState(0);
  const [heightValue, setHeightValue] = useState(0);
  const [remarkTxt, handleDoctorRemark] = useState<string>('');
  const [dateTouched, setDateTouched] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [clicked, setClicked] = useState(false);
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );

  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] = useState(false);
  const onBackPress = (): any => {
    navigation.goBack();
    return true;
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
  const deleteHealthCheckup = async (): Promise<any> => {
    if (editHCDate) {
      const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editHCDate)), activeChild)
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
  const [defaultMeasured, setDefaultMeasured] = useState<any>();
  const [defaultVaccineMeasured, setDefaultVaccineMeasured] = useState<any>();
  const isMeasuredOptions = [
    { title: t('vcIsMeasuredOption1') },
    { title: t('vcIsMeasuredOption2') },
  ];
  const getCheckedItem = (checkedItem: typeof isMeasuredOptions[0]): any => {
    setIsMeasured(checkedItem == isMeasuredOptions[0] ? true : false);
  };
  const getCheckedIsVaccineMeaured = (
    checkedItem: typeof isMeasuredOptions[0],
  ): any => {
    setIsVaccineMeasured(checkedItem == isMeasuredOptions[0] ? true : false);
  };
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
    if (editMeasurementDate) {
      setShowDelete(true)
      const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editMeasurementDate)), activeChild)
      setmeasureDate(DateTime.fromJSDate(new Date(editMeasurementDate)));
      seteditHCDate(DateTime.fromJSDate(new Date(editMeasurementDate)));
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
        setTakenVaccineForPrevPeriod(existingMeasuredVaccines);
        setIsVaccineMeasured(existingMeasuredVaccines?.length > 0 ? true : false);
        setDefaultVaccineMeasured(existingMeasuredVaccines?.length > 0 ? isMeasuredOptions[0] : isMeasuredOptions[1])

      } else {
        setIsVaccineMeasured(existingMeasuredVaccines?.didChildGetVaccines ? true : false);
        setDefaultVaccineMeasured(existingMeasuredVaccines?.didChildGetVaccines ? isMeasuredOptions[0] : isMeasuredOptions[1])
      }
    }
  }, [editMeasurementDate])

  const onmeasureDateChange = (event: any, selectedDate: any): any => {
    setmeasureDateShow(false);
    if (selectedDate) {
      setmeasureDate(DateTime.fromJSDate(selectedDate));
      setDateTouched(true);

      if (editMeasurementDate) {
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
                  setmeasureDate(editMeasurementDate)
                },
                style: "cancel",
              },
            ],
            {
              cancelable: false,
              // onDismiss: () =>
              //   Alert.alert(
              //     "This alert was dismissed by tapping outside of the alert dialog."
              //   ),
            })

        } else {
          //allow editing measuredate
        }
      } else {
        const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(selectedDate)), activeChild)
        if (existingMeasure) {
          Alert.alert(t('alertForModifyMeasures'),
            t('alertForModifyMeasuresTitle'),
            [
              {
                text: t('alertForModifyMeasuresOk'),
                onPress: (): any => {
                  setShowDelete(true);
                  setWeightValue(existingMeasure?.weight)
                  seteditHCDate(DateTime.fromJSDate(new Date(selectedDate)));
                  setHeightValue(existingMeasure?.height)
                  handleDoctorRemark(existingMeasure?.doctorComment)
                  setIsMeasured(existingMeasure?.isChildMeasured);
                  setDefaultMeasured(existingMeasure?.isChildMeasured == true ? isMeasuredOptions[0] : isMeasuredOptions[1])
                  const existingMeasuredVaccines = (existingMeasure?.vaccineIds && existingMeasure?.vaccineIds != '' && existingMeasure?.vaccineIds != null) ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(existingMeasure?.vaccineIds)) : [];
                  if (existingMeasuredVaccines?.length > 0) {
                    existingMeasuredVaccines?.forEach((element: any) => {
                      element['id'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.id
                      element['uuid'] = element?.uuid
                      element['title'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.title
                      element['isMeasured'] = true
                      element['pinned_article'] = allVaccinePeriods.find((item: any) => item.uuid == element?.uuid)?.pinned_article
                    });
                    setTakenVaccine(existingMeasuredVaccines);
                    setTakenVaccineForPrevPeriod(existingMeasuredVaccines);
                    setIsVaccineMeasured(existingMeasuredVaccines?.length > 0 ? true : false);
                    setDefaultVaccineMeasured(existingMeasuredVaccines?.length > 0 ? isMeasuredOptions[0] : isMeasuredOptions[1])
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
          //change title to add and remove delete
        }
      }
    }
  };
  const handleMeasureConfirm = (event: any): any => {
    const date = event;
    onmeasureDateChange(event, date);
    setMeasureDatePickerVisibility(false);
  };




  const onTakenVaccineToggle = (checkedVaccineArray: any): any => {
    setTakenVaccine(checkedVaccineArray);
    setTakenVaccineForPrevPeriod(checkedVaccineArray);
  };
  const minChildGrwothDate =
    activeChild.birthDate != '' &&
      activeChild.birthDate != null &&
      activeChild.birthDate != undefined
      ? activeChild.birthDate
      : new Date();
  React.useEffect(() => {
    if (route.params?.weight) {
      setWeightValue(route.params?.weight);
    }
    if (route.params?.height) {
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
  const onPrevPlannedVaccineToggle = (checkedVaccineArray: any): any => {
    setPrevPlannedVaccine(checkedVaccineArray);
  };
  const saveChildMeasures = async (): Promise<any> => {
    const modifiedTakenVaccines = takenVaccine.filter(
      item => item['isMeasured'] == true
    ).map(({ uuid }) => ({ uuid }))
    const allVaccines: any = [...plannedVaccine, ...prevPlannedVaccine, ...modifiedTakenVaccines];
    const measurementDateParam = editMeasurementDate
      ? dateTouched
        ? measureDate?.toMillis()
        : editMeasurementDate
      : measureDate?.toMillis();
    const titleDateInMonthParam = editMeasurementDate
      ? dateTouched
        ? measureDate.toFormat('MM')
        : measureDate.toFormat('MM')
      : measureDate.toFormat('MM');
    if (isVaccineMeasured == true && allVaccines.length == 0) {
      Alert.alert(t('alertForModifyMeasures'),
        t('alertForNoTakenVaccinesSelectTitle'),
        [
          {
            text: t('alertForModifyMeasuresOk'),
            onPress: (): any => {
              // setmeasureDate(editMeasurementDate)
            },
            style: "cancel",
          },
        ],
        {
          cancelable: false,
        })
      setClicked(false);
    } else {
      if (editHCDate) {
        const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editHCDate)), activeChild)
        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: isMeasured,
          weight: isMeasured ? String(weightValue) : '0',
          height: isMeasured ? String(heightValue) : '0',
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: isVaccineMeasured ? allVaccines.length > 0 ? true : false : false,
          vaccineIds: isVaccineMeasured ? allVaccines.length > 0 ? JSON.stringify(allVaccines) : '' : '',
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
        if (isGrowthMeasureExistForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild) || isVaccineMeasureExistForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild)) {
          const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild)
          const growthValues = {
            uuid: existingMeasure.uuid,
            isChildMeasured: isMeasured,
            weight: isMeasured ? String(weightValue) : '0',
            height: isMeasured ? String(heightValue) : '0',
            measurementDate: measurementDateParam,
            titleDateInMonth: titleDateInMonthParam.toString(),
            didChildGetVaccines: isVaccineMeasured ? allVaccines.length > 0 ? true : false : false,
            vaccineIds: isVaccineMeasured ? allVaccines.length > 0 ? JSON.stringify(allVaccines) : '' : false,
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
            uuid: uuid(),
            isChildMeasured: isMeasured,
            weight: isMeasured ? String(weightValue) : '0',
            height: isMeasured ? String(heightValue) : '0',
            measurementDate: measurementDateParam,
            titleDateInMonth: titleDateInMonthParam.toString(),
            didChildGetVaccines: isVaccineMeasured ? allVaccines.length > 0 ? true : false : false,
            vaccineIds: isVaccineMeasured ? allVaccines.length > 0 ? JSON.stringify(allVaccines) : '' : '',
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
            if (isMeasured) {
              const eventData = { 'name': GROWTH_MEASUREMENT_ADDED, 'params': { age_id: activeChild?.taxonomyData?.id, measured_at: 'doctor' } }
              logEvent(eventData, netInfo.isConnected)
            }
            if (isVaccineMeasured) {
              const eventData = { 'name': VACCINE_ADDED, 'params': { age_id: activeChild?.taxonomyData?.id, vaccine_id: allVaccines } }
              logEvent(eventData, netInfo.isConnected)
            }
            const eventData = { 'name': HEALTH_CHECKUP_ENTERED, 'params': { age_id: activeChild?.taxonomyData?.id } }
            logEvent(eventData, netInfo.isConnected)
          }
          setClicked(false);
          navigation.goBack();
        }
      }
    }

  };
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
  const { previousPeriods } = getAllHealthCheckupPeriods();
  const isAllVaccinesMeasured = (): any => {
    // previousPeriods.shift();	
    //remove first period which is the current period	
    let allPreviousPendingVaccines: any[] = [];
    previousPeriods.forEach((period:any) => {
      period.vaccines.forEach((vItem: any) => {
        allPreviousPendingVaccines.push(vItem);
      });
    });
    if (vcPeriod?.vaccines.length > 0) {
      allPreviousPendingVaccines = [...allPreviousPendingVaccines, ...vcPeriod.vaccines];
    }
    const isAllMeasured = [...allPreviousPendingVaccines].every((el) => {
      return el.isMeasured == true;
    })
    return isAllMeasured;
  }
  const renderVaccineSection = (): any => {
    return (
      <>
        <FormContainerFlex>
          <FormInputText>
            <Heading3>{t('hcChildVaccineQ')}</Heading3>
          </FormInputText>
          <ToggleRadiosBgColor
            options={isMeasuredOptions}
            defaultValue={defaultVaccineMeasured}
            tickbgColor={headerColor}
            tickColor={'#000'}
            getCheckedItem={getCheckedIsVaccineMeaured}
          />
        </FormContainerFlex>
        {isVaccineMeasured ? (
          <FormContainerFlex>
            {takenVaccine?.length > 0 ?
              (<ShiftFromTop15>
                <FormInputText>
                  <Heading3>{t('vcTaken')}</Heading3>
                </FormInputText>
                <TakenVaccines
                  fromScreen={'AddChildHealthCheckup'}
                  takenVaccines={takenVaccine}
                  backgroundActiveColor={headerColor}
                  onTakenVaccineToggle={onTakenVaccineToggle}
                />
              </ShiftFromTop15>) : null}
            {vcPeriod?.vaccines.filter((item: any) => {
              return item.isMeasured == false;
            }).length > 0 ? <ShiftFromTop15>
              <FormInputText>
                <Heading3>{t('vcPlanned')}</Heading3>
              </FormInputText>
              <PlannedVaccines
                fromScreen={'AddChildHealthCheckup'}
                backgroundActiveColor={headerColor}
                currentPeriodVaccines={vcPeriod?.vaccines}
                onPlannedVaccineToggle={onPlannedVaccineToggle}
              />
            </ShiftFromTop15> : null}
            <FormContainerFlex>
              <FormInputText>
                <Heading3>{t('vcPrev')}</Heading3>
              </FormInputText>
              <PrevPlannedVaccines
                fromScreen={'AddChildHealthCheckup'}
                backgroundActiveColor={headerColor}
                takenVaccine={takenVaccineForPrevPeriod}
                currentPeriodVaccines={vcPeriod?.vaccines}
                isEditScreen={showDelete}
                onPrevPlannedVaccineToggle={onPrevPlannedVaccineToggle}
              />
            </FormContainerFlex>
          </FormContainerFlex>
        ) : null}
      </>
    )
  }
  return (
    <>
      <View style={[styles.flex1, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <FlexCol>
          <HeaderRowView
            style={[styles.maxHeight, {
              backgroundColor: headerColor,
            }]}>
            <HeaderIconView>
              <HeaderIconPress
                onPress={(): any => {
                  navigation.goBack();
                }}>
                <IconML name={'ic_back'} color="#000" size={15} />
              </HeaderIconPress>
            </HeaderIconView>
            <HeaderTitleView>
              <Heading2>{showDelete ? t('hcEditHeaderTitle') : t('hcNewHeaderTitle')}</Heading2>
            </HeaderTitleView>
            {showDelete ?
              <HeaderActionView style={styles.padding0}>
                <Pressable style={styles.padding10} onPress={(): any =>
                  setModalVisible(true)
                }>
                  <Icon name={'ic_trash'} size={20} color="#000" />
                </Pressable>
              </HeaderActionView>
              : null
            }
          </HeaderRowView>

          <ScrollView style={styles.flex9} keyboardShouldPersistTaps={'always'}>
            <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps={'always'}>
              <MainContainer>
                <FormInputGroup onPress={(): any => {
                  setmeasureDateShow(true);
                  if (Platform.OS == 'ios') {
                    setMeasureDatePickerVisibility(true);
                  }
                }}>
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
                              editMeasurementDate ? new Date(editMeasurementDate) : new Date()
                            }
                            mode={'date'}
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
                          onConfirm={handleMeasureConfirm}
                          date={editMeasurementDate ? new Date(editMeasurementDate) : new Date()}
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

                <View></View>
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
                <View>
                  {isMeasured ? (
                    <>
                      <ShiftFromTop15>
                        <FormInputText>
                          <Heading3>
                            {t('growthScreenenterMeasuresText')}
                          </Heading3>
                        </FormInputText>
                        <RadioBoxContainer>
                          <FDirRow>
                            <RadioOuter>
                              <RadioInnerBox
                                onPress={(): any => {
                                  navigation.navigate('AddNewChildWeight', {
                                    prevRoute: 'AddChildHealthCheckup',
                                    headerColor,
                                    backgroundColor,
                                    weightValue:
                                      setInitialWeightValues(weightValue),
                                  });
                                }}>
                                <FlexFDirRowSpace>
                                  <Heading3>
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
                                    prevRoute: 'AddChildHealthCheckup',
                                    headerColor,
                                    backgroundColor,
                                    heightValue:
                                      setInitialHeightValues(heightValue),
                                  });
                                }}>
                                <FlexFDirRowSpace>
                                  <Heading3>
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
                </View>
                {editHCDate ? isAllVaccinesMeasured() ? takenVaccine.length > 0 ? renderVaccineSection() : null : renderVaccineSection() :
                  (isAllVaccinesMeasured() ? null :
                    renderVaccineSection())}

                <FormContainerFlex>
                  <FormInputText>
                    {t('growthScreenenterDoctorRemarkText')}
                  </FormInputText>

                  <TextAreaBox>
                    <TextInputML style={styles.textInputMl}
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={maxCharForRemarks}
                      clearButtonMode="always"
                      defaultValue={remarkTxt}
                      multiline={true}
                      onChangeText={(text:any): any => handleDoctorRemark(text)}
                      placeholder={t(
                        'growthScreenenterDoctorRemarkTextPlaceHolder',
                      )}
                      placeholderTextColor={"#77777779"}
                      allowFontScaling={false}
                    />
                  </TextAreaBox>

                </FormContainerFlex>

                <ShiftFromTopBottom10>
                  <Text>{t('growthScreennewGrowthBottomText')}</Text>
                </ShiftFromTopBottom10>
              </MainContainer>
              <ButtonContainer>
                <ButtonTertiary
                  disabled={disableSave()}
                  onPress={(e:any): any => {
                    e.stopPropagation();
                    setClicked(true);
                    setTimeout(() => {
                      saveChildMeasures();
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
                  <Heading3Center>{t('hcDeleteWarning')}</Heading3Center>
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
                    <ButtonPrimary onPress={(): any => {
                      deleteHealthCheckup();
                    }}>
                      <ButtonText numberOfLines={2}>{t('growthDeleteOption2')}</ButtonText>
                    </ButtonPrimary>
                  </ButtonColTwo>
                </ButtonContainerTwo>
              </ModalPopupContainer>
            </PopupOverlay>
          </Modal>
        </FlexCol>
      </View>
    </>
  );
};

export default AddChildHealthCheckup;