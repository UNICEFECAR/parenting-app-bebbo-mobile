import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
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
import PlannedVaccines from '@components/vaccination/PlannedVaccines';
import PrevPlannedVaccines from '@components/vaccination/PrevPlannedVaccines';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import {
    Heading2w,
    Heading3,
    Heading4Regular
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

  const [isMeasured, setIsMeasured] = useState(false);
  const [isVaccineMeasured, setIsVaccineMeasured] = useState(false);
  const isMeasuredOptions = [
    {title: t('vcIsMeasuredOption1')},
    {title: t('vcIsMeasuredOption2')},
  ];
  const defaultMeasured = {title: ''};
  const getCheckedMeasureItem = (checkedItem: typeof isMeasuredOptions[0]) => {
    console.log(checkedItem);
    setIsMeasured(checkedItem == isMeasuredOptions[0] ? true : false);
  };
  const getCheckedVaccineItem = (checkedItem: typeof isMeasuredOptions[0]) => {
    console.log(checkedItem);
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
  React.useEffect(() => {
    if (route.params?.weight) {
      console.log(route.params?.weight);
    }
    if (route.params?.height) {
      console.log(route.params?.height);
    }
  }, [route.params?.weight,route.params?.height ]);
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
          }}>
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
        <ScrollView style={{padding: 15, flex: 9, paddingBottom: 30}}>
        <FormInputGroup onPress={showmeasureDatepicker}>
          <Heading3>{t('hcdateText')}</Heading3>
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
        <Heading3>{t('vcChildMeasureQ')}</Heading3>
            <ToggleRadios
              options={isMeasuredOptions}
              defaultValue={defaultMeasured}
              tickbgColor={headerColor}
              tickColor={'#FFF'}
              getCheckedItem={getCheckedMeasureItem}
            />

            <View>
              {
                isMeasured ? <>
                <View style={{margin: 30}}>
          <Heading3>{t('growthScreenenterMeasuresText')}</Heading3>
          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={() => {
                navigation.navigate('AddNewChildWeight',{
                  prevRoute:"AddChildHealthCheckup",
                  headerColor,
                  backgroundColor
                });
              }}
              style={{
                backgroundColor: '#FFF',
                padding: 20,
                flex: 1,
                flexDirection: 'row',
              }}>
              <Heading3>{t('growthScreenwText')}</Heading3>
              <Heading4Regular>{t('growthScreenkgText')}</Heading4Regular>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate('AddNewChildHeight',{
                  prevRoute:"AddChildHealthCheckup",
                  headerColor,
                  backgroundColor
                });
              }}
              style={{
                backgroundColor: '#FFF',
                padding: 20,
                flex: 1,
                flexDirection: 'row',
              }}>
              <Heading3>{t('growthScreenhText')}</Heading3>
              <Heading4Regular>{t('growthScreencmText')}</Heading4Regular>
            </Pressable>
          </View>
        </View>
                </>
                :null
              }
            </View>
        <Heading3>{t('hcChildVaccineQ')}</Heading3>
        <View style={{flexDirection: 'row'}}>
        <ToggleRadios
              options={isMeasuredOptions}
              defaultValue={defaultMeasured}
              tickbgColor={headerColor}
              tickColor={'#FFF'}
              getCheckedItem={getCheckedVaccineItem}
            />
        </View>
        {
          isVaccineMeasured? <View><Heading3>{t('vcPlanned')}</Heading3>
          <PlannedVaccines />
          <Heading3>{t('vcPrev')}</Heading3>
          <PrevPlannedVaccines /></View>:null
        }
        <View>
          <Heading3>{'Doctor Remark or Comment'}}</Heading3>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="always"
            value={''}
            // onChangeText={queryText => handleSearch(queryText)}
            placeholder={t('growthScreenenterDoctorRemarkTextPlaceHolder')}
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          />
        </View>
        <View>
          <Text>{t('growthScreennewGrowthBottomText')}</Text>
        </View>
        <View style={{width: '100%', marginTop: 30}}>
          <ButtonPrimary
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
                {t('hcDeleteWarning')}
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
        </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default AddChildHealthCheckup;
