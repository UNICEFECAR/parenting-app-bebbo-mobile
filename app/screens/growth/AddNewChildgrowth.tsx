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
import { FDirRow, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import {
  HeaderActionView,
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
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View
} from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildgrowth = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<Date>();
  const [showmeasureDate, setmeasureDateShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const measurementPlaces = [
    {title: t('growthScreendoctorMeasurePlace')},
    {title: t('growthScreenhomeMeasurePlace')},
  ];
  const onmeasureDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || measureDate;
    setmeasureDateShow(Platform.OS === 'ios');
    setmeasureDate(currentDate);
  };
  const getCheckedGrowthPlace = (checkedItem: typeof measurementPlaces[0]) => {
    console.log(checkedItem);
  };
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const getDefaultGrowthPlace = () => {
    return null;
    // if in edit mode return value else return null
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
      // console.log(route.params?.weight);
    }
    if (route.params?.height) {
      // console.log(route.params?.height);
    }
  }, [route.params?.weight, route.params?.height]);
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
          <HeaderActionView>
            <Pressable
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text>{t('growthScreendeletebtnText')}</Text>
            </Pressable>
          </HeaderActionView>
        </HeaderRowView>
        <MainContainer>
          <FormInputGroup onPress={() => setmeasureDateShow(true)}>
            {/* <FormInputText>{t('growthScreendateMeasurementText')}</FormInputText> */}
            <FormInputBox>
              <FormDateText>
                <Text>
                  {' '}
                  {measureDate
                    ? measureDate.toDateString()
                    : t('growthScreenenterDateMeasurementText')}
                </Text>
              </FormDateText>
              <FormDateAction>
                <Icon name="ic_calendar" size={20} color="#000" />
              </FormDateAction>
            </FormInputBox>
          </FormInputGroup>
          <FormContainer>
            <FormInputText>
              <Heading3>{t('growthScreenwhereMeasured')}</Heading3>
            </FormInputText>

            <ToggleRadios
              options={measurementPlaces}
              defaultValue={getDefaultGrowthPlace()}
              tickbgColor={headerColor}
              tickColor={'#FFF'}
              getCheckedItem={getCheckedGrowthPlace}
            />
          </FormContainer>

          <View>
            {showmeasureDate && (
              <DateTimePicker
                testID="measureDatePicker"
                value={new Date()}
                mode={'date'}
                display="default"
                maximumDate={new Date()}
                minimumDate={new Date(minChildGrwothDate)}
                onChange={onmeasureDateChange}
              />
            )}
          </View>

          <FormContainer>
            <FormInputText>{t('growthScreenenterMeasuresText')}</FormInputText>
            <RadioBoxContainer>
              <FDirRow>
                <RadioOuter>
                  <RadioInnerBox
                    onPress={() => {
                      navigation.navigate('AddNewChildWeight', {
                        prevRoute: 'AddNewChildgrowth',
                        headerColor,
                        backgroundColor,
                      });
                    }}>
                    <FlexFDirRowSpace>
                      <Heading3>{t('growthScreenwText')}</Heading3>
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
                      });
                    }}>
                    <FlexFDirRowSpace>
                      <Heading3>{t('growthScreenhText')}</Heading3>
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
                clearButtonMode="always"
                value={''}
                // onChangeText={queryText => handleSearch(queryText)}
                placeholder={t('growthScreenenterDoctorRemarkTextPlaceHolder')}
              />
            </TextAreaBox>
          </FormContainer>
          <ShiftFromTopBottom10>
            <Text>{t('growthScreennewGrowthBottomText')}</Text>
          </ShiftFromTopBottom10>
        </MainContainer>

        <ButtonContainer>
          <ButtonTertiary
            onPress={() => {
              navigation.goBack();
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
                <Heading3Center>{t('growthDeleteWarning')}</Heading3Center>
              </ShiftFromTopBottom10>
              <ButtonContainerTwo>
                <ButtonColTwo>
                  <ButtonSecondaryTint>
                    <ButtonText>{t('growthDeleteOption1')}</ButtonText>
                  </ButtonSecondaryTint>
                </ButtonColTwo>

                <ButtonColTwo>
                  <ButtonPrimary>
                    <ButtonText>{t('growthDeleteOption2')}</ButtonText>
                  </ButtonPrimary>
                </ButtonColTwo>
              </ButtonContainerTwo>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildgrowth;
