import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainer,
  ButtonContainerTwo,
  ButtonPrimary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText
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
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3,
  Heading3Center,
  Heading4Regular,
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
import {
  maxCharForRemarks,
  measurementPlaces
} from '../../assets/translations/appOfflineData/apiConstants';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../database/schema/ChildDataSchema';
import { setActiveChild } from '../../services/childCRUD';
import { setInitialHeightValues, setInitialWeightValues } from '../../services/growthService';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildgrowth = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle, editGrowthItem} = route.params;
  // if (editGrowthItem) {
  // console.log('editGrowthItem', editGrowthItem);
  // }
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editGrowthItem
      ? DateTime.fromFormat((editGrowthItem.measurementDate),"dd'.'MM'.'yyyy")
      : null,
  );
  const [showmeasureDate, setmeasureDateShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateduuid, setUpdateduuid] = useState<string>(
    editGrowthItem ? editGrowthItem.uuid : uuidv4(),
  );
  const measurePlaces = measurementPlaces([
    t('growthScreendoctorMeasurePlace'),
    t('growthScreenhomeMeasurePlace'),
  ]);
  const [weightValue, setWeightValue] = useState(
    editGrowthItem ? editGrowthItem.weight : 0,
  );
  const [heightValue, setHeightValue] = useState(
    editGrowthItem ? editGrowthItem.height : 0,
  );
  const [remarkTxt, handleDoctorRemark] = useState<string>(
    editGrowthItem ? editGrowthItem.doctorComment : '',
  );
  const [measurePlace, setMeasurePlace] = useState<number>(
    editGrowthItem ? editGrowthItem.measurementPlace : null,
  );
  //set initvalue here for edit
  const onmeasureDateChange = (event: any, selectedDate: any) => {
    console.log(DateTime.fromJSDate(selectedDate), 'new date', selectedDate);
    setmeasureDateShow(false);
    if(selectedDate){
      setmeasureDate(DateTime.fromJSDate(selectedDate));
    }
   
  };
  const getCheckedGrowthPlace = (checkedItem: any) => {
    // console.log(checkedItem);
    setMeasurePlace(checkedItem.id);
  };
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const dispatch = useAppDispatch();
  const child_age = useAppSelector(
    (state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != '' ?JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age:[],
  );
  // console.log(activeChild,"in add new");
  const getDefaultGrowthPlace = () => {
    return editGrowthItem
      ? measurePlaces[editGrowthItem.measurementPlace]
      : null;
    // if in edit mode return value else return null
  };
 
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
  const saveChildMeasures = async () => {
    let updateItem = activeChild?.measures.find((item) => {
      return item
        ? Math.round(
            DateTime.fromMillis(item.measurementDate).diff(measureDate, 'days')
              .days,
          ) == 0
        : null;
    });
    // if date difference is 0 then update else create new
    console.log(updateItem);
    if (updateItem != null) {
      console.log(updateItem.uuid, 'updatethisitem');

      const growthValues = {
        uuid: updateItem.uuid,
        isChildMeasured: true,
        weight: String(weightValue),
        height: String(heightValue),
        measurementDate: measureDate?.toMillis(),
        titleDateInMonth: measureDate?.toFormat('MM'),
        didChildGetVaccines: false,
        vaccineIds: '',
        doctorComment: remarkTxt,
        measurementPlace: measurePlace,
      };
      console.log(growthValues);
      let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
        ChildEntitySchema,
        growthValues,
        'uuid ="' + activeChild.uuid + '"',
      );
      console.log(createresult);
      setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
      navigation.goBack();
    } else {
      const growthValues = {
        uuid: updateduuid,
        isChildMeasured: true,
        weight: String(weightValue),
        height: String(heightValue),
        measurementDate: measureDate?.toMillis(),
        titleDateInMonth: measureDate?.toFormat('MM'),
        didChildGetVaccines: false,
        vaccineIds: '',
        doctorComment: remarkTxt,
        measurementPlace: measurePlace,
      };
      console.log(growthValues);
      let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
        ChildEntitySchema,
        growthValues,
        'uuid ="' + activeChild.uuid + '"',
      );
      console.log(createresult);
      setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
      navigation.goBack();
    }
    // }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
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
              <Heading2>{headerTitle}</Heading2>
            </HeaderTitleView>
            {editGrowthItem ? (
              <HeaderActionView>
                <Pressable
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <Text>{t('growthScreendeletebtnText')}</Text>
                </Pressable>
              </HeaderActionView>
            ) : null}
          </HeaderRowView>
          <FlexCol>
            <MainContainer>
              <FormInputGroup onPress={() => setmeasureDateShow(true)}>
                <FormInputText>
                  {t('growthScreendateMeasurementText')}
                </FormInputText>
                <FormInputBox>
                  <FormDateText>
                    <Text>
                      {' '}
                      {measureDate
                        ? measureDate.toFormat("dd.MM.yyyy")
                        : t('growthScreenenterDateMeasurementText')}
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
              <FormContainer>
                <FormInputText>
                  <Heading3>{t('growthScreenwhereMeasured')}</Heading3>
                </FormInputText>

                <ToggleRadios
                  options={measurePlaces}
                  defaultValue={getDefaultGrowthPlace()}
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
                  <TextInput
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
                  />
                </TextAreaBox>
              </FormContainer>

              <ShiftFromTopBottom10>
                <Text>{t('growthScreennewGrowthBottomText')}</Text>
              </ShiftFromTopBottom10>
            </MainContainer>
          </FlexCol>
          <ButtonContainer>
            <ButtonTertiary
              disabled={isFormFilled()}
              onPress={(e) => {
                e.stopPropagation();
                saveChildMeasures().then(() => {});
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
                      <ButtonText>{t('growthDeleteOption1')}</ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonPrimary
                      onPress={() => {
                        setModalVisible(false);
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
