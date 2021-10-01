import { GROWTH_MEASUREMENT_ADDED } from '@assets/data/firebaseEvents';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainer,
  ButtonContainerTwo,
  ButtonDelPress,
  ButtonPrimary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText,
  ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import {
  FormContainer,
  FormDateAction,
  FormDateText,
  FormInputBox,
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
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import {
  RadioBoxContainer,
  RadioInnerBox,
  RadioOuter
} from '@components/shared/radio';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import analytics from '@react-native-firebase/analytics';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3,
  Heading3Center,
  Heading4Regular,
  ShiftFromTopBottom10
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemeContext } from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../App';
import {
  maxCharForRemarks,
  measurementPlaces
} from '../../assets/translations/appOfflineData/apiConstants';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../database/schema/ChildDataSchema';
import { setActiveChildData } from '../../redux/reducers/childSlice';
import {
  setInitialHeightValues,
  setInitialWeightValues
} from '../../services/growthService';
import { getMeasuresForDate, isAnyMeasureExistForDate, isGrowthMeasureExistForDate, isVaccineMeasureExistForDate } from '../../services/measureUtils';
import { formatStringDate } from '../../services/Utils';

type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildgrowth = ({ route, navigation }: any) => {
  const { t } = useTranslation();
  const { headerTitle, editMeasurementDate } = route.params;
  const [showDelete, setShowDelete] = useState<Boolean>(false);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] = useState(false);
  const handleMeasureConfirm = (event: any) => {
    const date = event;
    console.log("A date has been picked: ", date);
    onmeasureDateChange(event, date);
    setMeasureDatePickerVisibility(false);
  };
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editMeasurementDate ? editMeasurementDate : null,
  );
  const [showmeasureDate, setmeasureDateShow] = useState<Boolean>(false);
  const [dateTouched, setDateTouched] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [updateduuid, setUpdateduuid] = useState<string>(uuidv4());
  const measurePlaces = measurementPlaces([
    t('growthScreendoctorMeasurePlace'),
    t('growthScreenhomeMeasurePlace'),
  ]);
  // measurePlaces =  measurePlaces.map((v) => ({ ...v, title: v.title }))
  const [weightValue, setWeightValue] = useState(0);
  const [heightValue, setHeightValue] = useState(0);
  const [remarkTxt, handleDoctorRemark] = useState<string>('');
  const [measurePlace, setMeasurePlace] = useState<number>();
  const [defaultMeasurePlace, setDefaultMeasurePlace] = useState<any>(null);
  useEffect(() => {
    console.log(editMeasurementDate,"editMeasurementDate");
    // find growthmeasures for date, if exist show growthmeasures with delete enabled.
    if (editMeasurementDate) {
      setShowDelete(true)
      const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editMeasurementDate)), activeChild)
      console.log(existingMeasure,"existingMeasure");
      setmeasureDate(DateTime.fromJSDate(new Date(editMeasurementDate)));
      setWeightValue(existingMeasure?.weight)
      setHeightValue(existingMeasure?.height)
      handleDoctorRemark(existingMeasure?.doctorComment)
      setDefaultMeasurePlace(measurePlaces[existingMeasure.measurementPlace])
      setMeasurePlace(existingMeasure.measurementPlace)
      // setdeleteid =existingMeasure.uuid
    }
  }, [editMeasurementDate])




  //set initvalue here for edit
  const onmeasureDateChange = (event: any, selectedDate: any) => {
    console.log(DateTime.fromJSDate(selectedDate), 'new date', selectedDate);
    setmeasureDateShow(false);
    if (selectedDate) {
      setmeasureDate(DateTime.fromJSDate(selectedDate));
      setDateTouched(true);
      if (editMeasurementDate) {
        setShowDelete(true)
        if (isGrowthMeasureExistForDate(DateTime.fromJSDate(selectedDate), activeChild)) {
          //data already exist, reset measuredate it to edit measures’ date, 
          //Dont allow to select date for which measures already exist
          Alert.alert(t('alertForModifyMeasures'),
            t('alertForExistingMeasuresTitle'),
            [
              {
                text: t('alertForModifyMeasuresOk'),
                onPress: () => {
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
          // allow date to modify for this measure
          if (isVaccineMeasureExistForDate(DateTime.fromJSDate(selectedDate), activeChild)) {
            //  add measure where only vacccines were added.
            // allow adding growth values for that vaccine measure
            console.log("in else only if vaccines exist")
          } else {
            // add new measure
          }
        }
      } else {
        if (isGrowthMeasureExistForDate(DateTime.fromJSDate(selectedDate), activeChild)) {
          Alert.alert(t('alertForModifyMeasures'),
            t('alertForModifyMeasuresTitle'),
            [
              {
                text: t('alertForModifyMeasuresOk'),
                onPress: () => {
                  const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(selectedDate), activeChild)
                  console.log(existingMeasure);
                  setWeightValue(existingMeasure.weight)
                  setHeightValue(existingMeasure.height)
                  handleDoctorRemark(existingMeasure.doctorComment)
                  setMeasurePlace(existingMeasure.measurementPlace)
                  setDefaultMeasurePlace(measurePlaces[existingMeasure.measurementPlace])
                  setShowDelete(true)
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
          // measure do not exist for a date
          // allow changing date for already measured measure
        }
      }


    }
  };
  const getCheckedGrowthPlace = (checkedItem: any) => {
    // console.log(checkedItem);
    setMeasurePlace(checkedItem.id);
    // setDefaultMeasurePlace(measurePlaces[checkedItem.id])
  };
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const dispatch = useAppDispatch();
  const child_age = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ''
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : [],
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  // console.log(activeChild,"in add new");
  // const getDefaultGrowthPlace = () => {
  //   return editGrowthItem
  //     ? measurePlaces[editGrowthItem.measurementPlace]
  //     : measurePlaces[measurePlace];

  //   // if in edit mode return value else return null
  // };

  const isFormFilled = () => {
    // console.log(measureDate, measurePlace, heightValue, weightValue);
    if (measureDate) {
      if (measurePlace != null) {
        if (measurePlace == 0) {
          if (heightValue && weightValue) {
            return false;
          } else {
            return true;
          }
        } else {
          if (heightValue && weightValue) {
            return false;
          } else {
            return true;
          }
          // doctor remark not required for measurement at home
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  const minChildGrwothDate =
    activeChild.birthDate != '' &&
      activeChild.birthDate != null &&
      activeChild.birthDate != undefined
      ? activeChild.birthDate
      : new Date();
  // console.log(minChildGrwothDate);
  React.useEffect(() => {
    if (route.params?.weight) {
      // console.log(route.params?.weight, 'from route');
      setWeightValue(route.params?.weight);
    }
    if (route.params?.height) {
      // console.log(route.params?.height);
      setHeightValue(route.params?.height);
    }
  }, [route.params?.weight, route.params?.height]);
  const deleteGrowth = async () => {
    // delete measure at measurementdate got from param
    console.log(editMeasurementDate, "deleteGrowth")
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
    if (editMeasurementDate) {
      //
      const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editMeasurementDate)), activeChild)

      if (isVaccineMeasureExistForDate(DateTime.fromJSDate(new Date(editMeasurementDate)), activeChild)) {
        //  update measure where only vacccines were added.
        // allow adding growth values for that vaccine measure

        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: false,
          weight: "",
          height: "",
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: "",
          measurementPlace: existingMeasure.measurementPlace,
        };
        console.log(growthValues, 'updateInDeleteMeasure');
        let updateresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValues,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(updateresult, '..updateresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (updateresult?.length > 0) {
          activeChild.measures = updateresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        navigation.goBack();

        console.log("in else only if vaccines exist")
      } else {
        // delete measure
        //delete measure obj
        let deleteresult = await userRealmCommon.deleteChildMeasures<ChildEntity>(
          ChildEntitySchema,
          existingMeasure,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(deleteresult, '..deleteresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (deleteresult) {
          activeChild.measures = deleteresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        navigation.goBack();
      }
    } else {
      const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild)

      if (isVaccineMeasureExistForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild)) {
        //  update measure where only vacccines were added.
        // allow adding growth values for that vaccine measure

        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: false,
          weight: "",
          height: "",
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: "",
          measurementPlace: existingMeasure.measurementPlace,
        };
        console.log(growthValues, 'updateInDeleteMeasure');
        let updateresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValues,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(updateresult, '..updateresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (updateresult?.length > 0) {
          activeChild.measures = updateresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        navigation.goBack();

        console.log("in else only if vaccines exist")
      } else {
        // delete measure
        //delete measure obj
        let deleteresult = await userRealmCommon.deleteChildMeasures<ChildEntity>(
          ChildEntitySchema,
          existingMeasure,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(deleteresult, '..deleteresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (deleteresult) {
          activeChild.measures = deleteresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        navigation.goBack();
      }
    }

  }
  const saveChildMeasures = async () => {
    // console.log(dateTouched,"dateTouched",measureDate);

    const measurementDateParam = editMeasurementDate
      ? dateTouched
        ? measureDate?.toMillis()
        : editMeasurementDate
      : measureDate?.toMillis();
    const titleDateInMonthParam = editMeasurementDate
      ? dateTouched
        ? measureDate.toFormat('MM')
        : editMeasurementDate
      : measureDate.toFormat('MM');
    if (editMeasurementDate) {
      const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(editMeasurementDate)), activeChild)
      console.log(existingMeasure, "inEdit");
      // if editMeasurementDate is not existingMeasure.mesurementDate , then remove growth from existingMeasure and add it to newMeasure
      if (editMeasurementDate != measureDate.toMillis() && existingMeasure.didChildGetVaccines == true) {
        const growthValues = {
          uuid: uuidv4(),
          isChildMeasured: true,
          weight: String(weightValue),
          height: String(heightValue),
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: false,
          vaccineIds: '',
          doctorComment: remarkTxt,
          measurementPlace: measurePlace,
        };
        console.log(growthValues, 'add new SaveMeasure');
        let updateresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValues,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(updateresult, '..updateresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (updateresult?.length > 0) {
          activeChild.measures = updateresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        const growthValuesForVaccineMeasured = {
          uuid: existingMeasure.uuid,
          isChildMeasured: false,
          weight: '',
          height: '',
          measurementDate: existingMeasure.measurementDate,
          titleDateInMonth: existingMeasure.titleDateInMonth,
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: existingMeasure.doctorComment,
          measurementPlace: existingMeasure.measurementPlace,
        };
        console.log(growthValues);
        let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValuesForVaccineMeasured,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(createresult, '..createresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (createresult?.length > 0) {
          activeChild.measures = createresult;
          dispatch(setActiveChildData(activeChild));
        }
        navigation.goBack();
      } else {
        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: true,
          weight: String(weightValue),
          height: String(heightValue),
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: remarkTxt,
          measurementPlace: measurePlace,
        };
        console.log(growthValues);
        let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValues,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(createresult, '..createresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (createresult?.length > 0) {
          activeChild.measures = createresult;
          dispatch(setActiveChildData(activeChild));
        }
        navigation.goBack();
      }

    } else {

      if (isAnyMeasureExistForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild)) {
        const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(new Date(measureDate?.toMillis())), activeChild)
        console.log(existingMeasure, "inEdit");

        const growthValues = {
          uuid: existingMeasure.uuid,
          isChildMeasured: true,
          weight: String(weightValue),
          height: String(heightValue),
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: existingMeasure.didChildGetVaccines,
          vaccineIds: existingMeasure.vaccineIds,
          doctorComment: remarkTxt,
          measurementPlace: measurePlace,
        };
        console.log(growthValues);
        let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValues,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(createresult, '..createresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (createresult?.length > 0) {
          activeChild.measures = createresult;
          dispatch(setActiveChildData(activeChild));
        }
        navigation.goBack();

      } else {

        // check if blank healthcheckup is done or not?// is there entry exists for that date update or else add?
        const growthValues = {
          uuid: uuidv4(),
          isChildMeasured: true,
          weight: String(weightValue),
          height: String(heightValue),
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: false,
          vaccineIds: '',
          doctorComment: remarkTxt,
          measurementPlace: measurePlace,
        };
        console.log(growthValues, 'addthisitem');
        let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValues,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(createresult, '..createresult..');
        if (createresult?.length > 0) {
          activeChild.measures = createresult;
          dispatch(setActiveChildData(activeChild));
          analytics().logEvent(GROWTH_MEASUREMENT_ADDED, { age_id: activeChild?.taxonomyData?.id, measured_at: measurePlace == 0 ? 'doctor' : 'home' })
        }
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        navigation.goBack();
      }
    }
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView nestedScrollEnabled={true}>
          <HeaderRowView
            style={{
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <HeaderIconView>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </HeaderIconView>
            <HeaderTitleView>
              <Heading2 numberOfLines={1}>{showDelete ? t('growthScreeneditNewBtntxt') : t('growthScreenaddNewBtntxt')}</Heading2>
            </HeaderTitleView>
            {showDelete ? (
              <HeaderActionView>
                <ButtonDelPress
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <ButtonTextSmLine>{t('growthScreendeletebtnText')}</ButtonTextSmLine>
                </ButtonDelPress>
              </HeaderActionView>
            ) : null}
          </HeaderRowView>
          <FlexCol>
          <KeyboardAwareScrollView  bounces={false}>
            <MainContainer>
              <FormInputGroup onPress={() => {
                setmeasureDateShow(true);
                if (Platform.OS == 'ios') {
                  setMeasureDatePickerVisibility(true);
                }
              }}>
                <FormInputText>
                  {t('growthScreendateMeasurementText')}
                </FormInputText>
                {Platform.OS != 'ios' ? (
                  <FormInputBox>
                    <FormDateText>
                      <Text>
                        {' '}
                        {measureDate
                          ?
                          // DateTime.fromJSDate(new Date(measureDate)).toFormat(
                          //     'dd/MM/yyyy',
                          //   )
                          formatStringDate(measureDate, luxonLocale)
                          : t('growthScreenenterDateMeasurementText')}
                      </Text>
                      {showmeasureDate && (
                        <DateTimePicker
                          testID="measureDatePicker"
                          value={
                            editMeasurementDate ? new Date(editMeasurementDate) : new Date()
                          }
                          mode={'date'}
                          display="default"
                          maximumDate={new Date()}
                          minimumDate={new Date(minChildGrwothDate)}
                          onChange={onmeasureDateChange}
                        />
                      )}
                    </FormDateText>
                    <FormDateAction>
                      <Icon name="ic_calendar" size={20} color="#000" />
                    </FormDateAction>
                  </FormInputBox>
                ) : (
                  <FormInputBox>
                    <FormDateText>
                      <Text>
                        {' '}
                        {measureDate
                          ?
                          // DateTime.fromJSDate(new Date(measureDate)).toFormat(
                          //     'dd/MM/yyyy',
                          //   )
                          formatStringDate(measureDate, luxonLocale)
                          : t('growthScreenenterDateMeasurementText')}
                      </Text>
                      {/* <DateTimePicker
                    testID="measureDatePicker"
                    value={editGrowthItem ? new Date(measureDate) : new Date()}
                    mode={'date'}
                    display="default"
                    maximumDate={new Date()}
                    minimumDate={new Date(minChildGrwothDate)}
                    onChange={onmeasureDateChange}
                    style={{backgroundColor: 'white', flex: 1}}
                  /> */}
                      <DateTimePickerModal
                        isVisible={isMeasureDatePickerVisible}
                        mode="date"
                        onConfirm={handleMeasureConfirm}
                        date={editMeasurementDate ? new Date(editMeasurementDate) : new Date()}
                        onCancel={() => {
                          // Alert.alert('Modal has been closed.');
                          setMeasureDatePickerVisibility(false);
                        }}
                        maximumDate={new Date()}
                        minimumDate={new Date(minChildGrwothDate)}
                      />
                    </FormDateText>

                    <FormDateAction>
                      <Icon name="ic_calendar" size={20} color="#000" />
                    </FormDateAction>
                  </FormInputBox>

                )}
              </FormInputGroup>
              <View></View>
              <FormContainer>
                <FormInputText>
                  <Heading3>{t('growthScreenwhereMeasured')}</Heading3>
                </FormInputText>

                <ToggleRadios
                  options={measurePlaces}
                  defaultValue={defaultMeasurePlace}
                  tickbgColor={headerColor}
                  tickColor={'#000'}
                  getCheckedItem={getCheckedGrowthPlace}
                />
              </FormContainer>

              <FormContainer>
                <FormInputText>
                  {t('growthScreenenterMeasuresText')}
                </FormInputText>
                <RadioBoxContainer>
                  <FDirRow>
                    <RadioOuter>
                      <RadioInnerBox
                        onPress={() => {
                          navigation.navigate('AddNewChildWeight', {
                            prevRoute: 'AddNewChildgrowth',
                            headerColor,
                            backgroundColor,
                            weightValue: setInitialWeightValues(weightValue),
                          });
                        }}>
                        <FlexFDirRowSpace>
                          <Heading3>
                            {weightValue ? weightValue : t('growthScreenwText')}
                          </Heading3>
                          <Heading4Regular>
                            {t('growthScreenkgText')}
                          </Heading4Regular>
                        </FlexFDirRowSpace>
                      </RadioInnerBox>
                    </RadioOuter>
                    <RadioOuter>
                      <RadioInnerBox
                        onPress={() => {
                          navigation.navigate('AddNewChildHeight', {
                            prevRoute: 'AddNewChildgrowth',
                            headerColor,
                            backgroundColor,
                            heightValue: setInitialHeightValues(heightValue),
                          });
                        }}>
                        <FlexFDirRowSpace>
                          <Heading3>
                            {heightValue ? heightValue : t('growthScreenhText')}
                          </Heading3>
                          <Heading4Regular>
                            {t('growthScreencmText')}
                          </Heading4Regular>
                        </FlexFDirRowSpace>
                      </RadioInnerBox>
                    </RadioOuter>
                  </FDirRow>
                </RadioBoxContainer>
              </FormContainer>


              <FormContainer>
                <FormInputText>
                  {t('growthScreenenterDoctorRemarkText')}
                </FormInputText>
                
                  <TextAreaBox>
                    <TextInput style={{flex:1}}
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={maxCharForRemarks}
                      clearButtonMode="always"
                      defaultValue={remarkTxt}
                      multiline={true}
                      onChangeText={(text) => handleDoctorRemark(text)}
                      placeholder={t(
                        'growthScreenenterDoctorRemarkTextPlaceHolder',
                      )}
                      allowFontScaling={false}
                    />
                  </TextAreaBox>
               
              </FormContainer>

              <ShiftFromTopBottom10>
                <Text>{t('growthScreennewGrowthBottomText')}</Text>
              </ShiftFromTopBottom10>
            </MainContainer>
            <ButtonContainer>
            <ButtonTertiary
              disabled={isFormFilled()}
              onPress={(e) => {
                e.stopPropagation();
                saveChildMeasures().then(() => { });
              }}>
              <ButtonText numberOfLines={2}>{t('growthScreensaveMeasures')}</ButtonText>
            </ButtonTertiary>
          </ButtonContainer>
                        </KeyboardAwareScrollView>
          </FlexCol>
          
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisible(false);
            }}
            onDismiss={() => {
              setModalVisible(false);
            }}>
            <PopupOverlay>
              <ModalPopupContainer>
                <PopupCloseContainer>
                  <PopupClose
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    <Icon name="ic_close" size={16} color="#000" />
                  </PopupClose>
                </PopupCloseContainer>
                <ShiftFromTopBottom10>
                  <ModalPopupContent>
                    <Heading3Center>{t('growthDeleteWarning')}</Heading3Center>
                  </ModalPopupContent>
                </ShiftFromTopBottom10>
                <ButtonContainerTwo>
                  <ButtonColTwo>
                    <ButtonSecondaryTint
                      onPress={() => {
                        setModalVisible(false);
                      }}>
                      <ButtonText numberOfLines={2}>{t('growthDeleteOption1')}</ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonPrimary
                      onPress={() => {
                        deleteGrowth();
                      }}>
                      <ButtonText>{t('growthDeleteOption2')}</ButtonText>
                    </ButtonPrimary>
                  </ButtonColTwo>
                </ButtonContainerTwo>
              </ModalPopupContainer>
            </PopupOverlay>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildgrowth;
