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
import {
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View
} from 'react-native';
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
const AddChildVaccination = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle, vcPeriod, editGrowthItem} = route.params;
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
  const [showmeasureDate, setmeasureDateShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const [plannedVaccine, setPlannedVaccine] = useState([]);
  const [prevPlannedVaccine, setPrevPlannedVaccine] = useState([]);
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
    {title: t('vcIsMeasuredOption1')},
    {title: t('vcIsMeasuredOption2')},
  ];
  const defaultMeasured = {title: ''};
  const [dateTouched, setDateTouched] = useState<Boolean>(false);
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
      setWeightValue(route.params?.weight);
    }
    if (route.params?.height) {
      console.log(route.params?.height);
      setHeightValue(route.params?.height);
    }
  }, [route.params?.weight, route.params?.height]);
  const isFormDisabled = () => {
    if (measureDate) {
      if (plannedVaccine.length > 0 || prevPlannedVaccine.length > 0) {
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
    // console.log(checkedVaccineArray);
    setPlannedVaccine(checkedVaccineArray);
  };
  const onPrevPlannedVaccineToggle = (checkedVaccineArray: any) => {
    // console.log(checkedVaccineArray);
    setPrevPlannedVaccine(checkedVaccineArray);
  };
  const saveChildMeasures = async () => {
    let allVaccines:any = [...plannedVaccine, ...prevPlannedVaccine];
    console.log(allVaccines,"before measurementDate");
    allVaccines = [...allVaccines].map(v => ({...v, measurementDate: measureDate?.toMillis()}));
    
    // ((v:any) => {
    //   console.log(v);
    //  return {v.measurementDate =measureDate?.toMillis()}
    // });
    console.log(allVaccines,"after measureDateUpdate");
    const measurementDateParam = editGrowthItem ? ((dateTouched) ? measureDate?.toMillis() : editGrowthItem.measurementDate):measureDate?.toMillis()
    const titleDateInMonthParam = editGrowthItem ? ((dateTouched) ? measureDate.toFormat('MM') : editGrowthItem.titleDateInMonth):measureDate.toFormat('MM')
 
    let updateItem = activeChild?.measures.find((item) => {
      // console.log(item.measurementDate);
      // console.log(DateTime.fromJSDate(new Date(item.measurementDate)).diff(DateTime.fromJSDate(new Date(measureDate)), 'days').toObject().days);
      return item
        ? Math.round(
          DateTime.fromJSDate(new Date(item.measurementDate)).diff(DateTime.fromJSDate(new Date(measureDate)), 'days').toObject().days
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
        easurementDate: measurementDateParam,
        titleDateInMonth:titleDateInMonthParam.toString(),
        didChildGetVaccines: true,
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
      if(createresult?.length>0){
        activeChild.measures=createresult;
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
        easurementDate: measurementDateParam,
        titleDateInMonth:titleDateInMonthParam.toString(),
        didChildGetVaccines: true,
        vaccineIds: JSON.stringify(allVaccines),
        doctorComment: remarkTxt,
        measurementPlace: 0, // vaccination happens at doctor's place
      };
      console.log(growthValues);
      let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
        ChildEntitySchema,
        growthValues,
        'uuid ="' + activeChild.uuid + '"',
      );
      console.log(createresult);
      if(createresult?.length>0){
        activeChild.measures=createresult;
        dispatch(setActiveChildData(activeChild));
        }
      // setActiveChild(languageCode, activeChild.uuid, dispatch, child_age);
      navigation.goBack();
    }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
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
            <Heading2>{headerTitle}</Heading2>
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

        <ScrollView style={{flex: 9}}>
          <MainContainer>
            <FormInputGroup onPress={() => setmeasureDateShow(true)}>
              {/* <FormInputText>
                  {t('vcScreenDateText')}
                </FormInputText> */}
              <FormInputBox>
                <FormDateText>
                  <Text>
                    {' '}
                    {measureDate
                      ? DateTime.fromJSDate(new Date(measureDate)).toFormat(
                          'dd/MM/yyyy',
                        )
                      : t('vcScreenenterDateText')}
                  </Text>
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBox>
            </FormInputGroup>
            <View>
              {showmeasureDate && (
                <DateTimePicker
                  testID="measureDatePicker"
                  value={editGrowthItem ? new Date(measureDate) : new Date()}
                  mode={'date'}
                  display="default"
                  maximumDate={new Date()}
                  minimumDate={new Date(minChildGrwothDate)}
                  onChange={onmeasureDateChange}
                />
              )}
            </View>
            <FormContainerFlex>
              <FormInputText>
                <Heading3>{t('vcPlanned')}</Heading3>
              </FormInputText>
              <PlannedVaccines
                fromScreen={'AddChildVaccination'}
                currentPeriodVaccines={vcPeriod?.vaccines}
                onPlannedVaccineToggle={onPlannedVaccineToggle}
              />
            </FormContainerFlex>
            <FormContainerFlex>
              <FormInputText>
                <Heading3>{t('vcPrev')}</Heading3>
              </FormInputText>
              <PrevPlannedVaccines
                fromScreen={'AddChildVaccination'}
                currentPeriodVaccines={vcPeriod?.vaccines}
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
                          onPress={() => {
                            navigation.navigate('AddNewChildHeight', {
                              prevRoute: 'AddChildVaccination',
                              headerColor,
                              backgroundColor,
                              heightValue: setInitialHeightValues(heightValue),
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

            <FormContainer>
              <FormInputText>
                <Heading3>{t('vcDoctorRemark')}</Heading3>
              </FormInputText>
              <TextAreaBox>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{height: 40}}
                  clearButtonMode="always"
                  defaultValue={remarkTxt}
                  onChangeText={(text) => handleDoctorRemark(text)}
                  placeholder={t('vcDoctorRemarkPlaceHolder')}
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
              saveChildMeasures().then(() => {});
              // navigation.goBack();
            }}>
            <ButtonText>{t('growthScreensaveMeasures')}</ButtonText>
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
                    <ButtonText>{t('growthDeleteOption1')}</ButtonText>
                  </ButtonSecondaryTint>
                </ButtonColTwo>

                <ButtonColTwo>
                  <ButtonSecondary>
                    <ButtonText>{t('growthDeleteOption2')}</ButtonText>
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
