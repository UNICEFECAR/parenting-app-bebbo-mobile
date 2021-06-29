import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import PlannedVaccines from '@components/PlannedVaccines';
import PrevPlannedVaccines from '@components/PrevPlannedVaccines';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import {
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup
} from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import { ButtonTertiary2 } from '@components/shared/WalkthroughStyle';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2w,
  Heading3
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
import { ThemeContext } from 'styled-components';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddChildVaccination = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle} = route.params;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.VACCINATION_COLOR;
  const backgroundColor = themeContext.colors.VACCINATION_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<Date>();
  const [showmeasure, setmeasureShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);

  const isMeasured = [
    {title:t('vcIsMeasuredOption1')},
    {title:t('vcIsMeasuredOption2')},
  ];
  const getCheckedItem =(checkedItem:typeof isMeasured[0])=>{
    console.log(checkedItem);
  }
  const onmeasureChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || measureDate;
    setmeasureShow(Platform.OS === 'ios');
    setmeasureDate(currentDate);
  };
  const showmeasureDatepicker = () => {
    setmeasureShow(true);
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <View style={{flex: 1, padding: 15}}>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </View>
            <View style={{flex: 8, padding: 7}}>
              <Heading2w style={{color: '#000'}}>{headerTitle}</Heading2w>
            </View>
            <Pressable
              style={{flex: 1, padding: 15}}
              onPress={() => {
                setModalVisible(true)
              }}>
              <Text>{t('growthScreendeletebtnText')}</Text>
            </Pressable>
          </View>
        </View>
        <View style={{padding:10}}>
        <FormInputGroup onPress={showmeasureDatepicker}>
          <Heading3>{t('vcScreenDateText')}</Heading3>
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
        <Heading3>{t('vcPlanned')}</Heading3>
        <PlannedVaccines/>
        <Heading3>{t('vcPrev')}</Heading3>
        <PrevPlannedVaccines/>
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
        <Heading3>{t('vcChildMeasureQ')}</Heading3>
        <ToggleRadios options={isMeasured} tickbgColor={headerColor} tickColor={"#FFF"} getCheckedItem={getCheckedItem}/>
        <View>
          <Heading3>{t('vcDoctorRemark')}</Heading3>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            value={''}
            // onChangeText={queryText => handleSearch(queryText)}
            placeholder={t('vcDoctorRemarkPlaceHolder')}
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          />
        </View>
       
        <View style={{width: '100%', marginTop: 30}}>
          <ButtonPrimary
          style={{backgroundColor:"#FFF"}}
            onPress={() => {
              navigation.goBack();
            }}>
            <ButtonText>{t('growthScreensaveMeasures')}</ButtonText>
          </ButtonPrimary>
        </View>
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
                {'Do you want to delete child Vaccination details?'}
              </Heading3>
              <View style={{flexDirection:'row',justifyContent:'space-between',padding:10}}>
              <ButtonTertiary2 style={{marginRight:5}}>
                <ButtonText>{'Cancel'}</ButtonText>
              </ButtonTertiary2>
              <ButtonTertiary2>
                <ButtonText>{'Confirm'}</ButtonText>
              </ButtonTertiary2>
              </View>
            </ModalPopupContainer>
          </PopupOverlay>
        </Modal>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddChildVaccination;
