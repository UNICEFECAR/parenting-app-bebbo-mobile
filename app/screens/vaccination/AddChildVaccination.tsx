import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonColTwo, ButtonContainer, ButtonContainerTwo, ButtonPrimary, ButtonSecondary, ButtonSecondaryTint, ButtonTertiary, ButtonText } from '@components/shared/ButtonGlobal';
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
import { HeaderActionView, HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
    PopupClose,
    PopupCloseContainer,
    PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RadioBoxContainer, RadioInnerBox, RadioOuter } from '@components/shared/radio';
import { ButtonTertiary2 } from '@components/shared/WalkthroughStyle';
import ToggleRadios from '@components/ToggleRadios';
import PlannedVaccines from '@components/vaccination/PlannedVaccines';
import PrevPlannedVaccines from '@components/vaccination/PrevPlannedVaccines';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Heading2,
    Heading2w,
    Heading3,
    Heading3Center,
    Heading4Regular,
    ShiftFromTop15,
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
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components/native';

const AddChildVaccination = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext.colors.VACCINATION_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<Date>();
  const [showmeasure, setmeasureShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMeasured, setIsMeasured] = useState(false);
  const isMeasuredOptions = [
    {title: t('vcIsMeasuredOption1')},
    {title: t('vcIsMeasuredOption2')},
  ];
  const defaultMeasured = {title: ''};
  const getCheckedItem = (checkedItem: typeof isMeasuredOptions[0]) => {
  //  console.log(checkedItem);
    setIsMeasured(checkedItem == isMeasuredOptions[0] ? true : false);
  };
  const onmeasureChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || measureDate;
    setmeasureShow(Platform.OS === 'ios');
    setmeasureDate(currentDate);
  };
  const showmeasureDatepicker = () => {
    setmeasureShow(true);
  };
  React.useEffect(() => {
    if (route.params?.weight) {
     // console.log(route.params?.weight);
    }
    if (route.params?.height) {
      //console.log(route.params?.height);
    }
  }, [route.params?.weight,route.params?.height ]);
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
         
          <ScrollView style={{flex: 9}}>
            <MainContainer>
            <FormInputGroup onPress={showmeasureDatepicker}>
              {/* <Heading3>{t('vcScreenDateText')}</Heading3> */}
              <FormInputBox>
                <FormDateText>
                  <Text>
                    {measureDate
                      ? measureDate.toDateString()
                      : t('vcScreenenterDateText')}
                  </Text>
                </FormDateText>
                <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
              </FormInputBox>
            </FormInputGroup>
            <FormContainerFlex>
            <FormInputText>
              
            <Heading3>{t('vcPlanned')}</Heading3>
            </FormInputText>
            <PlannedVaccines />
            </FormContainerFlex>
            <FormContainerFlex>
              <FormInputText>
            <Heading3>{t('vcPrev')}</Heading3>
            </FormInputText>
            <PrevPlannedVaccines />
            </FormContainerFlex>
            <View>
              {showmeasure && (
                <DateTimePicker
                  testID="measuredatePicker"
                  value={new Date()}
                  mode={'date'}
                  display="default"
                  maximumDate={new Date()}
                  // minimumDate => childDOB
                  onChange={onmeasureChange}
                />
              )}
            </View>
            <FormContainerFlex>
            <FormInputText><Heading3>{t('vcChildMeasureQ')}</Heading3></FormInputText>
            <ToggleRadios
              options={isMeasuredOptions}
              defaultValue={defaultMeasured}
              tickbgColor={headerColor}
              tickColor={'#FFF'}
              getCheckedItem={getCheckedItem}
            />

            
            </FormContainerFlex>
            
              {
                isMeasured ? <>
            <ShiftFromTop15>
              <FormInputText>
          <Heading3>{t('growthScreenenterMeasuresText')}</Heading3>
          </FormInputText>
          <RadioBoxContainer>
          <FDirRow>
            <RadioOuter>
            <RadioInnerBox
              onPress={() => {
                navigation.navigate('AddNewChildWeight',{
                  prevRoute:"AddChildVaccination",
                  headerColor,
                  backgroundColor
                });
              }}
              >
                <FlexFDirRowSpace>
                <Heading3>{t('growthScreenwText')}</Heading3>
              <Heading4Regular>{t('growthScreenkgText')}</Heading4Regular>
              </FlexFDirRowSpace>
            </RadioInnerBox>
            </RadioOuter>
            <RadioOuter>
            <RadioInnerBox
              onPress={() => {
                navigation.navigate('AddNewChildHeight',{
                  prevRoute:"AddChildVaccination",
                  headerColor,
                  backgroundColor
                });
              }}
              >
                <FlexFDirRowSpace>
                <Heading3>{t('growthScreenhText')}</Heading3>
              <Heading4Regular>{t('growthScreencmText')}</Heading4Regular>
              </FlexFDirRowSpace>
            </RadioInnerBox>
            </RadioOuter>
          </FDirRow>
          </RadioBoxContainer>
          </ShiftFromTop15>

                </>
                :null
              }
            
            <FormContainer>
            <FormInputText><Heading3>{t('vcDoctorRemark')}</Heading3></FormInputText>
            <TextAreaBox>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                value={''}
                // onChangeText={queryText => handleSearch(queryText)}
                placeholder={t('vcDoctorRemarkPlaceHolder')}
                
              />
              </TextAreaBox>
            </FormContainer>
            </MainContainer>
          </ScrollView>
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
