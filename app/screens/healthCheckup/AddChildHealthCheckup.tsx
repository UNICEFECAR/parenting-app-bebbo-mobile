import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonColTwo, ButtonContainer, ButtonContainerTwo, ButtonPrimary, ButtonSecondaryTint, ButtonTertiary, ButtonText } from '@components/shared/ButtonGlobal';
import {
  FormContainerFlex,
  FormContainerFlex1,
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  FormInputText,
  TextAreaBox
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import { FDirRow, FlexCol, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
import { HeaderActionView, HeaderIconView, HeaderRowView, HeaderTitleView } from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { RadioBoxContainer, RadioInnerBox, RadioOuter } from '@components/shared/radio';
import ToggleRadios from '@components/ToggleRadios';
import PlannedVaccines from '@components/vaccination/PlannedVaccines';
import PrevPlannedVaccines from '@components/vaccination/PrevPlannedVaccines';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2, Heading3,
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
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddChildHealthCheckup = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.HEALTHCHECKUP_COLOR;
  const backgroundColor = themeContext.colors.HEALTHCHECKUP_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<Date>();
  const [showmeasure, setmeasureShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [weightValue,setWeightValue] = useState();
  const [heightValue,setHeightValue] = useState();
  const [isMeasured, setIsMeasured] = useState(false);
  const [isVaccineMeasured, setIsVaccineMeasured] = useState(false);
  const isMeasuredOptions = [
    {title: t('vcIsMeasuredOption1')},
    {title: t('vcIsMeasuredOption2')},
  ];
  const defaultMeasured = {title: ''};
  const getCheckedMeasureItem = (checkedItem: typeof isMeasuredOptions[0]) => {
    //console.log(checkedItem);
    setIsMeasured(checkedItem == isMeasuredOptions[0] ? true : false);
  };
  const getCheckedVaccineItem = (checkedItem: typeof isMeasuredOptions[0]) => {
    //console.log(checkedItem);
    setIsVaccineMeasured(checkedItem == isMeasuredOptions[0] ? true : false);
  };
  const onmeasureChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || measureDate;
    setmeasureShow(Platform.OS === 'ios');
    setmeasureDate(currentDate);
  };
  const showmeasureDatepicker = () => {
    setmeasureShow(true);
  };
  const setInitialWeightValues = (weightValue:any)=>{
    console.log(weightValue)
    let w = (weightValue + "").split(".");
    if(weightValue && w[1].length==1){
      return {weight:Number(w[0]) ,weight1:(Number(w[1])*10)}
    } else {
      return {weight:Number(w[0]) ,weight1:(Number(w[1]))}
    }
    // console.log(weight,weight1)
  }
  const setInitialHeightValues = (heightValue:any)=>{
    console.log(heightValue)
    let w = (heightValue + "").split(".");
    if(heightValue && w[1].length==1){
      return {height:Number(w[0]) ,height1:(Number(w[1])*10)}
    } else {
      return {height:Number(w[0]) ,height1:(Number(w[1]))}
    }
    // console.log(height,height1)
  }
  React.useEffect(() => {
    if (route.params?.weight) {
      console.log(route.params?.weight);
      setWeightValue(route.params?.weight);
    }
    if (route.params?.height) {
      console.log(route.params?.height);
      setHeightValue(route.params?.height)
    }
  }, [route.params?.weight,route.params?.height ]);
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <FlexCol>
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
                setModalVisible(true)
              }}>
                <Text>{t('growthScreendeletebtnText')}</Text>
              </Pressable>
              </HeaderActionView>
              </HeaderRowView>
        
        <ScrollView style={{flex: 9}}>
        <MainContainer>
        <FormInputGroup onPress={showmeasureDatepicker}>
          {/* <FormInputText>
          <Heading3>{t('hcdateText')}</Heading3>
          </FormInputText> */}


          <FormInputBox>
            <FormDateText>
              <Text>
                {measureDate
                  ? measureDate.toDateString()
                  : t('hcenterDateText')}
              </Text>
            </FormDateText>
            <FormDateAction>
              <Icon name="ic_calendar" size={20} color="#000" />
            </FormDateAction>
          </FormInputBox>
        </FormInputGroup>
        
        
        <View>
          {showmeasure && (
            <DateTimePicker
              testID="measuredatePicker"
              value={new Date()}
              mode={'date'}
              display="default"
              onChange={onmeasureChange}
            />
          )}
        </View>
        <FormContainerFlex>
          <FormInputText>
        <Heading3>{t('vcChildMeasureQ')}</Heading3>
        </FormInputText>
            <ToggleRadios
              options={isMeasuredOptions}
              defaultValue={defaultMeasured}
              tickbgColor={headerColor}
              tickColor={'#000'}
              getCheckedItem={getCheckedMeasureItem}
            />
 </FormContainerFlex>
            <View>
              {
                isMeasured ? <>
                <View>
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
                  prevRoute:"AddChildHealthCheckup",
                  headerColor,
                  backgroundColor,
                  weightValue:setInitialWeightValues(weightValue)
                });
              }}
             >
               <FlexFDirRowSpace>
              <Heading3>{weightValue ? weightValue :t('growthScreenwText')}</Heading3>
              <Heading4Regular>{t('growthScreenkgText')}</Heading4Regular>
              </FlexFDirRowSpace>
            </RadioInnerBox>
            </RadioOuter>
            <RadioOuter>
            <RadioInnerBox
              onPress={() => {
                navigation.navigate('AddNewChildHeight',{
                  prevRoute:"AddChildHealthCheckup",
                  headerColor,
                  backgroundColor,
                  heightValue:setInitialHeightValues(heightValue)
                });
              }}
              >
                <FlexFDirRowSpace>
              <Heading3>{heightValue ? heightValue :t('growthScreenhText')}</Heading3>
              <Heading4Regular>{t('growthScreencmText')}</Heading4Regular>
              </FlexFDirRowSpace>
            </RadioInnerBox>
            </RadioOuter>
            </FDirRow>
          </RadioBoxContainer>
          </ShiftFromTop15>
        </View>
       
                </>
                :null
              }
            </View>
            <FormContainerFlex>
              <FormInputText>
        <Heading3>{t('hcChildVaccineQ')}</Heading3>
        </FormInputText>
        
        <ToggleRadios
              options={isMeasuredOptions}
              defaultValue={defaultMeasured}
              tickbgColor={headerColor}
              tickColor={'#000'}
              getCheckedItem={getCheckedVaccineItem}
            />

        
        </FormContainerFlex>
        {
          isVaccineMeasured? 
          <FormContainerFlex1>
            <ShiftFromTop15>
            <FormInputText>
            <Heading3>{t('vcPlanned')}</Heading3>
            </FormInputText>
          <PlannedVaccines />
          </ShiftFromTop15>
          <ShiftFromTop15>
          <FormInputText>
          <Heading3>{t('vcPrev')}</Heading3>
          </FormInputText>
          <PrevPlannedVaccines />
          </ShiftFromTop15>
          </FormContainerFlex1>
          :null
        }
        <FormContainerFlex>
          <FormInputText>
          <Heading3>{'Doctor Remark or Comment'}}</Heading3>
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
        </FormContainerFlex>
        <ShiftFromTopBottom10>
          <Text>{t('growthScreennewGrowthBottomText')}</Text>
        </ShiftFromTopBottom10>

       
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
                <Heading3Center>{t('hcDeleteWarning')}</Heading3Center>
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
        </FlexCol>
      </SafeAreaView>
    </>
  );
};

export default AddChildHealthCheckup;