import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonContainer, ButtonPrimary, ButtonTertiary, ButtonText } from '@components/shared/ButtonGlobal';
import {
    FormDateAction,
    FormDateText,
    FormInputBox,
    FormInputGroup,FormInputText,FormContainer, TextAreaBox
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import { FDirRow, Flex1, FlexDirRowSpace, FlexFDirRowSpace } from '@components/shared/FlexBoxStyle';
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
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
    Heading2w,
    Heading3, Heading4Regular, ShiftFromTop10,ShiftFromTopBottom10
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
  const [dobDate, setdobDate] = useState<Date>();
  const [showdob, setdobShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const measurementPlaces = [
    {title:t('growthScreendoctorMeasurePlace')},
    {title:t('growthScreenhomeMeasurePlace')},
  ];
  const ondobChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dobDate;
    setdobShow(Platform.OS === 'ios');
    setdobDate(currentDate);
  };
  const getCheckedItem =(checkedItem:typeof measurementPlaces[0])=>{
   // console.log(checkedItem);
  }
  const showdobDatepicker = () => {
    setdobShow(true);
  };
  React.useEffect(() => {
    if (route.params?.weight) {
     // console.log(route.params?.weight);
    }
    if (route.params?.height) {
     // console.log(route.params?.height);
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
              setModalVisible(true)
            }}>
            <Text>{t('growthScreendeletebtnText')}</Text>
          </Pressable>
        </HeaderActionView>
          </HeaderRowView>
       <MainContainer>
        <FormInputGroup onPress={showdobDatepicker}>
          {/* <FormInputText>{t('growthScreendateMeasurementText')}</FormInputText> */}
          <FormInputBox>
            <FormDateText>
              <Text>
                {' '}
                {dobDate
                  ? dobDate.toDateString()
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

        <ToggleRadios options={measurementPlaces} defaultValue={measurementPlaces[0]} tickbgColor={headerColor} tickColor={"#FFF"} getCheckedItem={getCheckedItem}/>

        </FormContainer>
        
        <View>
          {showdob && (
            <DateTimePicker
              testID="dobdatePicker"
              value={new Date()}
              mode={'date'}
              display="default"
              maximumDate={new Date()}
              // minimumDate => childDOB
              onChange={ondobChange}
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
                navigation.navigate('AddNewChildWeight',{
                  prevRoute:"AddNewChildgrowth",
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
                  prevRoute:"AddNewChildgrowth",
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
        </FormContainer>
        
        <FormContainer>
          <FormInputText>{t('growthScreenenterDoctorRemarkText')}</FormInputText>
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
              <Heading3>
                {t('growthDeleteWarning')}
              </Heading3>
              <View style={{flexDirection:'row',justifyContent:'space-between',padding:10}}>
              <ButtonTertiary2 style={{marginRight:5}}>
                <ButtonText>{t('growthDeleteOption1')}</ButtonText>
              </ButtonTertiary2>
              <ButtonTertiary2>
                <ButtonText>{t('growthDeleteOption2')}</ButtonText>
              </ButtonTertiary2>
              </View>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildgrowth;
