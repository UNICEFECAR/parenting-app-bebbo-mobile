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
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header3Text } from '@styles/style';
import {
  Heading2w,
  Heading3, Heading4Regular
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
    console.log(checkedItem);
  }
  const showdobDatepicker = () => {
    setdobShow(true);
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
        <FormInputGroup onPress={showdobDatepicker}>
          <Header3Text>{t('growthScreendateMeasurementText')}</Header3Text>
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
        <Header3Text>{t('growthScreenwhereMeasured')}</Header3Text>
       
        <ToggleRadios options={measurementPlaces} defaultValue={measurementPlaces[0]} tickbgColor={headerColor} tickColor={"#FFF"} getCheckedItem={getCheckedItem}/>

        <View>
          {showdob && (
            <DateTimePicker
              testID="dobdatePicker"
              value={new Date()}
              mode={'date'}
              display="default"
              onChange={ondobChange}
            />
          )}
        </View>
        <View style={{margin: 30}}>
          <Header3Text>{t('growthScreenenterMeasuresText')}</Header3Text>
          <View style={{flexDirection: 'row'}}>
            <Pressable
              onPress={() => {
                navigation.navigate('AddNewChildWeight');
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
                navigation.navigate('AddNewChildHeight',{onReturn:(item)=>{
                  console.log(item);
                }});
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
        <View>
          <Header3Text>{t('growthScreenenterDoctorRemarkText')}</Header3Text>
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
