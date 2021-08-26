import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainer,
  ButtonContainerTwo,
  ButtonSecondary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText
} from '@components/shared/ButtonGlobal';
import {
  FormContainer,
  FormContainerFlex,
  FormDateAction,
  FormDateText,
  FormDateText1,
  FormInputBox,
  FormInputGroup,
  FormInputText,
  TextAreaBox
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import { FDirRow, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import {
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
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
import ToggleRadios from '@components/ToggleRadios';
import PlannedVaccines from '@components/vaccination/PlannedVaccines';
import PrevPlannedVaccines from '@components/vaccination/PrevPlannedVaccines';
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
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, Platform, Pressable, SafeAreaView, Text, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../App';
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
import { formatStringDate } from '../../services/Utils';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import analytics from '@react-native-firebase/analytics';
import { GROWTH_MEASUREMENT_ADDED, VACCINE_ADDED } from '@assets/data/firebaseEvents';
import { getMeasuresForDate, isGrowthMeasureExistForDate, isVaccineMeasureExistForDate } from '../../services/measureUtils';
import TakenVaccines from '@components/vaccination/TakenVaccines';
const AddChildVaccination = ({ route, navigation }: any) => {
  const { t } = useTranslation();
  const { headerTitle, vcPeriod, editGrowthItem } = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext.colors.VACCINATION_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editGrowthItem ? editGrowthItem.measurementDate : null,
  );

  const dispatch = useAppDispatch();
  const child_age = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ''
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const [showmeasureDate, setmeasureDateShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [plannedVaccine, setPlannedVaccine] = useState([]);
  const [prevPlannedVaccine, setPrevPlannedVaccine] = useState([]);
  const [takenVaccine, setTakenVaccine] = useState([]);
  const [takenVaccineForPrevPeriod, setTakenVaccineForPrevPeriod] = useState([]);
  const [weightValue, setWeightValue] = useState(
    editGrowthItem ? editGrowthItem.weight : 0,
  );
  const [heightValue, setHeightValue] = useState(
    editGrowthItem ? editGrowthItem.height : 0,
  );
  const [remarkTxt, handleDoctorRemark] = useState<string>(
    editGrowthItem ? editGrowthItem.doctorComment : '',
  );
  const [updateduuid, setUpdateduuid] = useState<string>(
    editGrowthItem ? editGrowthItem.uuid : uuidv4(),
  );
  const isMeasuredOptions = [
    { title: t('vcIsMeasuredOption1') },
    { title: t('vcIsMeasuredOption2') },
  ];
  // const defaultMeasured = {title: ''};
  const [defaultMeasured, setDefaultMeasured] = useState<any>();
  // editGrowthItem
  // ? editGrowthItem.isChildMeasured ?{ title:isMeasuredOptions[0]} : {title:isMeasuredOptions[1]}
  // :
  const [dateTouched, setDateTouched] = useState<Boolean>(false);
  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] = useState(false);
  const handleMeasureConfirm = (event: any) => {
    const date = event;
    console.log("A date has been picked: ", date);
    onmeasureDateChange(event, date);
    setMeasureDatePickerVisibility(false);
  };
  let allVaccinePeriods = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.vaccineData),
  );
  const checkIfMeasuredVaccineExistsForLocale = (vaccineIds) => {
    // console.log(vaccineIds,"checkIfMeasuredVaccineExistsForLocale",allVaccinePeriods)
    return vaccineIds?.filter(vcId => {
      return allVaccinePeriods.some(el => {
        return vcId.vaccineid === el.uuid;
      });
    });
  }
  const getCheckedItem = (checkedItem: typeof isMeasuredOptions[0]) => {
    //  console.log(checkedItem);
    setIsMeasured(checkedItem == isMeasuredOptions[0] ? true : false);
  };
  const onmeasureDateChange = (event: any, selectedDate: any) => {
    // console.log(DateTime.fromJSDate(selectedDate), 'new date', selectedDate);
    setmeasureDateShow(false);
    if (selectedDate) {
      setmeasureDate(DateTime.fromJSDate(selectedDate));
      setDateTouched(true);
      if (editGrowthItem) {
        //form edit not allowed
      } else {
        if (isGrowthMeasureExistForDate(DateTime.fromJSDate(selectedDate), activeChild) || isVaccineMeasureExistForDate(DateTime.fromJSDate(selectedDate), activeChild)) {
          Alert.alert("Alert",
            "Selecting this date will modify existing Measures",
            [
              {
                text: "Ok",
                onPress: () => {
                  const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(selectedDate), activeChild)
                  console.log(existingMeasure, "existingMeasure");
                  setWeightValue(existingMeasure.weight)
                  setHeightValue(existingMeasure.height)
                  handleDoctorRemark(existingMeasure.doctorComment)
                  setIsMeasured(existingMeasure.isChildMeasured);
                  setDefaultMeasured(existingMeasure.isChildMeasured == true ? isMeasuredOptions[0] : isMeasuredOptions[1])
                  let existingMeasuredVaccines = (existingMeasure.vaccineIds || existingMeasure.vaccineIds != '' || existingMeasure.vaccineIds != null) ? checkIfMeasuredVaccineExistsForLocale(JSON.parse(existingMeasure.vaccineIds)) : [];
                  console.log(existingMeasuredVaccines, "existingMeasuredVaccines")
                  if (existingMeasuredVaccines?.length > 0) {
                    existingMeasuredVaccines.forEach(element => {
                      console.log(element);
                      console.log(allVaccinePeriods.find(item => item.uuid == element.vaccineid))
                      element['id'] = allVaccinePeriods.find(item => item.uuid == element.vaccineid).id
                      element['uuid'] = element.vaccineid
                      element['title'] = allVaccinePeriods.find(item => item.uuid == element.vaccineid).title
                      element['isChecked'] = true
                      element['pinned_article'] = allVaccinePeriods.find(item => item.uuid == element.vaccineid).pinned_article
                    });
                    console.log(existingMeasuredVaccines, "existingMeasuredVaccines");
                    setTakenVaccine(existingMeasuredVaccines);
                    setTakenVaccineForPrevPeriod(existingMeasuredVaccines)
                  }

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
          setWeightValue(0);
          setHeightValue(0);
          handleDoctorRemark('');
          setIsMeasured(false);
          setDefaultMeasured(null);
          setTakenVaccine([]);
        }
      }
    }
  };
  const minChildGrwothDate =
    activeChild.birthDate != '' &&
      activeChild.birthDate != null &&
      activeChild.birthDate != undefined
      ? activeChild.birthDate
      : new Date();
  React.useEffect(() => {
    if (route.params?.weight) {
      console.log(route.params?.weight);
      setIsMeasured(true);
      setWeightValue(route.params?.weight);
    }
    if (route.params?.height) {
      console.log(route.params?.height);
      setIsMeasured(true);
      setHeightValue(route.params?.height);
    }
  }, [route.params?.weight, route.params?.height]);
  const isFormDisabled = () => {
    if (measureDate) {
      if (plannedVaccine.length > 0 || prevPlannedVaccine.length > 0 || takenVaccine.length > 0) {
        if (isMeasured) {
          if (heightValue && weightValue) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  const onPlannedVaccineToggle = (checkedVaccineArray: any) => {
    console.log(checkedVaccineArray);
    setPlannedVaccine(checkedVaccineArray);
  };
  const onTakenVaccineToggle = (checkedVaccineArray: any) => {
    console.log(checkedVaccineArray, "onTakenVaccineToggle");
    setTakenVaccine(checkedVaccineArray);
    if (checkedVaccineArray.every((el) => {
      return el.isChecked == false;
    })) {
      setmeasureDate(null)
      setTakenVaccine([]);
      setTakenVaccineForPrevPeriod([])
      setWeightValue(0);
      setHeightValue(0);
      handleDoctorRemark('');
      setIsMeasured(false);
      setDefaultMeasured(null);
    }
  };
  const onPrevPlannedVaccineToggle = (checkedVaccineArray: any) => {
    console.log(checkedVaccineArray);
    setPrevPlannedVaccine(checkedVaccineArray);
  };
  const saveChildMeasures = async () => {
    const modifiedTakenVaccines = takenVaccine.filter(
      item => item['isChecked'] == true
    ).map(({ vaccineid }) => ({ vaccineid }))
    console.log(modifiedTakenVaccines);
    let allVaccines: any = [...plannedVaccine, ...prevPlannedVaccine, ...modifiedTakenVaccines];
    console.log(allVaccines, 'before measurementDate');
    // allVaccines = [...allVaccines].map((v) => ({
    //   ...v,
    //   measurementDate: measureDate?.toMillis(),
    // }));

    // ((v:any) => {
    //   console.log(v);
    //  return {v.measurementDate =measureDate?.toMillis()}
    // });
    // console.log(allVaccines, 'after measureDateUpdate');
    const measurementDateParam = editGrowthItem
      ? dateTouched
        ? measureDate?.toMillis()
        : editGrowthItem.measurementDate
      : measureDate?.toMillis();
    const titleDateInMonthParam = editGrowthItem
      ? dateTouched
        ? measureDate.toFormat('MM')
        : editGrowthItem.titleDateInMonth
      : measureDate.toFormat('MM');

    let updateItem = activeChild?.measures.find((item) => {
      // console.log(item.measurementDate);
      // console.log(DateTime.fromJSDate(new Date(item.measurementDate)).diff(DateTime.fromJSDate(new Date(measureDate)), 'days').toObject().days);
      return item
        ? Math.round(
          DateTime.fromJSDate(new Date(item.measurementDate))
            .diff(DateTime.fromJSDate(new Date(measureDate)), 'days')
            .toObject().days,
        ) == 0
        : null;
    });
    // if date difference is 0 then update else create new
    console.log(updateItem);
    if (updateItem != null) {
      console.log(updateItem.uuid, 'updatethisitem');

      const growthValues = {
        uuid: updateItem.uuid,
        isChildMeasured: isMeasured,
        weight: String(weightValue),
        height: String(heightValue),
        measurementDate: measurementDateParam,
        titleDateInMonth: titleDateInMonthParam.toString(),
        didChildGetVaccines: allVaccines.length > 0 ? true : false,
        vaccineIds: JSON.stringify(allVaccines),
        doctorComment: remarkTxt,
        measurementPlace: 0,
      };
      console.log(growthValues);
      let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
        ChildEntitySchema,
        growthValues,
        'uuid ="' + activeChild.uuid + '"',
      );
      console.log(createresult);
      if (createresult?.length > 0) {
        activeChild.measures = createresult;
        dispatch(setActiveChildData(activeChild));
      }
      // setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
      navigation.goBack();
    } else {
      const growthValues = {
        uuid: updateduuid,
        isChildMeasured: isMeasured,
        weight: String(weightValue),
        height: String(heightValue),
        measurementDate: measurementDateParam,
        titleDateInMonth: titleDateInMonthParam.toString(),
        didChildGetVaccines: allVaccines.length > 0 ? true : false,
        vaccineIds: JSON.stringify(allVaccines),
        doctorComment: remarkTxt,
        measurementPlace: 0, // vaccination happens at doctor's place
      };
      console.log(growthValues, "ADD_VACCINATION");
      let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
        ChildEntitySchema,
        growthValues,
        'uuid ="' + activeChild.uuid + '"',
      );
      console.log(createresult);
      if (createresult?.length > 0) {
        activeChild.measures = createresult;
        dispatch(setActiveChildData(activeChild));
        if (isMeasured) {
          analytics().logEvent(GROWTH_MEASUREMENT_ADDED, { age_id: activeChild?.taxonomyData?.id, measured_at: 'doctor' })
        }
        analytics().logEvent(VACCINE_ADDED, { age_id: activeChild?.taxonomyData?.id, vaccine_id: allVaccines })

      }
      // setActiveChild(languageCode, activeChild.uuid, dispatch, child_age);
      navigation.goBack();
    }
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
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
            <Heading2 numberOfLines={1}>{headerTitle}</Heading2>
          </HeaderTitleView>
          {/* <HeaderActionView>
            <Pressable
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text>{t('growthScreendeletebtnText')}</Text>
            </Pressable>
          </HeaderActionView> */}
        </HeaderRowView>

        <ScrollView style={{ flex: 9 }}>
          <MainContainer>
            <FormInputGroup onPress={() => {
              // setmeasureDateShow(true)
              setmeasureDateShow(true);
              if (Platform.OS == 'ios') {
                setMeasureDatePickerVisibility(true);
              }
            }}
            >
              {/* <FormInputText>
                  {t('vcScreenDateText')}
                </FormInputText> */}
              {Platform.OS != 'ios' ? (
                <FormInputBox>
                  <FormDateText1>
                    <Text>
                      {' '}
                      {measureDate
                        ?
                        // DateTime.fromJSDate(new Date(measureDate)).toFormat(
                        //     'dd/MM/yyyy',
                        //   )
                        formatStringDate(measureDate, luxonLocale)
                        : t('vcScreenenterDateText')}
                    </Text>
                    {showmeasureDate && (
                      <DateTimePicker
                        testID="measureDatePicker"
                        value={
                          editGrowthItem ? new Date(measureDate) : new Date()
                        }
                        mode={'date'}
                        display="default"
                        maximumDate={new Date()}
                        minimumDate={new Date(minChildGrwothDate)}
                        onChange={onmeasureDateChange}
                      />
                    )}
                  </FormDateText1>
                  <FormDateAction>
                    <Icon name="ic_calendar" size={20} color="#000" />
                  </FormDateAction>
                </FormInputBox>
              ) : (
                <FormInputBox>
                  <FormDateText1>
                    <Text>
                      {' '}
                      {measureDate
                        ?
                        // DateTime.fromJSDate(new Date(measureDate)).toFormat(
                        //     'dd/MM/yyyy',
                        //   )
                        formatStringDate(measureDate, luxonLocale)
                        : t('vcScreenenterDateText')}
                    </Text>
                    <DateTimePickerModal
                      isVisible={isMeasureDatePickerVisible}
                      mode="date"
                      onConfirm={handleMeasureConfirm}
                      date={editGrowthItem ? new Date(measureDate) : new Date()}
                      onCancel={() => {
                        // Alert.alert('Modal has been closed.');
                        setMeasureDatePickerVisibility(false);
                      }}
                      maximumDate={new Date()}
                      minimumDate={new Date(minChildGrwothDate)}
                    />

                  </FormDateText1>
                  <FormDateAction>
                    <Icon name="ic_calendar" size={20} color="#000" />
                  </FormDateAction>
                </FormInputBox>
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
            {takenVaccine?.length == 0 ?
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
                onPrevPlannedVaccineToggle={onPrevPlannedVaccineToggle}
              />
            </FormContainerFlex>

            <FormContainerFlex>
              <FormInputText>
                <Heading3>{t('vcChildMeasureQ')}</Heading3>
              </FormInputText>
              <ToggleRadios
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
                          onPress={() => {
                            navigation.navigate('AddNewChildWeight', {
                              prevRoute: 'AddChildVaccination',
                              headerColor,
                              backgroundColor,
                              weightValue: setInitialWeightValues(weightValue),
                            });
                          }}>
                          <FlexFDirRowSpace>
                            <Heading3 style={{ flexShrink: 1 }} numberOfLines={2}>
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
                          onPress={() => {
                            navigation.navigate('AddNewChildHeight', {
                              prevRoute: 'AddChildVaccination',
                              headerColor,
                              backgroundColor,
                              heightValue: setInitialHeightValues(heightValue),
                            });
                          }}>
                          <FlexFDirRowSpace>
                            <Heading3 style={{ flexShrink: 1 }} numberOfLines={2}>
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

            <FormContainer>
              <FormInputText>
                <Heading3>{t('vcDoctorRemark')}</Heading3>
              </FormInputText>
              <TextAreaBox>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ height: 40 }}
                  clearButtonMode="always"
                  defaultValue={remarkTxt}
                  onChangeText={(text) => handleDoctorRemark(text)}
                  placeholder={t('vcDoctorRemarkPlaceHolder')}
                  allowFontScaling={false}
                />
              </TextAreaBox>
            </FormContainer>
          </MainContainer>
        </ScrollView>
        <ButtonContainer>
          <ButtonTertiary
            disabled={isFormDisabled()}
            onPress={(e) => {
              e.stopPropagation();
              saveChildMeasures().then(() => { });
              // navigation.goBack();
            }}>
            <ButtonText numberOfLines={2}>{t('growthScreensaveMeasures')}</ButtonText>
          </ButtonTertiary>
        </ButtonContainer>

        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
          onDismiss={() => {
            setModalVisible(!modalVisible);
          }}>
          <PopupOverlay>
            <ModalPopupContainer>
              <PopupCloseContainer>
                <PopupClose
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
              </PopupCloseContainer>
              <ShiftFromTopBottom10>
                <Heading3Center>{t('vcDeleteWarning')}</Heading3Center>
              </ShiftFromTopBottom10>
              <ButtonContainerTwo>
                <ButtonColTwo>
                  <ButtonSecondaryTint>
                    <ButtonText numberOfLines={2}>{t('growthDeleteOption1')}</ButtonText>
                  </ButtonSecondaryTint>
                </ButtonColTwo>

                <ButtonColTwo>
                  <ButtonSecondary>
                    <ButtonText numberOfLines={2}>{t('growthDeleteOption2')}</ButtonText>
                  </ButtonSecondary>
                </ButtonColTwo>
              </ButtonContainerTwo>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default AddChildVaccination;
