import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonContainer, ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import {
  FormContainer,
  FormDateAction,
  FormDateContainer,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  LabelText,
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import Icon, { IconML } from '@components/shared/Icon';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatStringDate } from '../services/Utils';
import { Heading2w, ShiftFromTop10 } from '@styles/typography';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  BackHandler,
  Platform, Pressable, StyleSheet, Text, View
} from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { addChild, deleteChild, deleteChildNew, getAllChildren, getNewChild, setActiveChild } from '../services/childCRUD';
import { DateTime } from 'luxon';
import { dobMax } from '@types/types';
import {
  HeaderActionView,
  HeaderIconPress,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { regexpEmojiPresentation } from '@assets/translations/appOfflineData/apiConstants';
import TextInputML from '@components/shared/TextInputML';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import { setActiveChildData } from '../redux/reducers/childSlice';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { bgcolorWhite } from '@styles/style';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildProfileScreen'
>;

type Props = {
  route: any;
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  headerActionView: { padding: 0 },
  headerRowView: {
    maxHeight: 50
  },
  headerTitleTextColor: {
    color: bgcolorWhite
  },
  pressableView: { paddingLeft: 10, paddingRight: 10 },
  textInputML: { width: '100%' }

})
const AddExpectingChildProfile = ({ route, navigation }: Props): any => {
  const netInfo = useNetInfoHook();
  const childData = route.params.childData;
  const editScreen = childData && childData.uuid != '' ? true : false;
  const [clicked, setClicked] = useState(false);
  const [showdob, setdobShow] = useState(false);

  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const [name, setName] = React.useState("");
  const { t } = useTranslation();
  const [plannedTermDate, setPlannedTermDate] = React.useState<Date | null>(null);
  const [isDobDatePickerVisible, setDobDatePickerVisibility] = useState(false);
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const ondobChange = (event: any, selectedDate: any): any => {
    const currentDate = selectedDate || plannedTermDate;
    setdobShow(Platform.OS === 'ios');
    setPlannedTermDate(currentDate);
  };
  const showdobDatepicker = (): any => {
    setdobShow(true);
    if (Platform.OS == 'ios') {
      setDobDatePickerVisibility(true);
    }
  };
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  const handleDobConfirm = (event: any): any => {
    const date = event;
    ondobChange(event, date);
    setDobDatePickerVisibility(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      console.log('childList', childList)
      console.log('childData is', childData)
      if (childData?.uuid != '') {
        setName(childData?.childName ? childData?.childName : '');
        setPlannedTermDate(childData?.birthDate != null ? new Date(childData?.birthDate) : null);
      }
    }, [])
  );
  useEffect(() => {
    const backAction = (): any => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);
    return (): any => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove();
    }
  }, []);
  const AddChild = async (): Promise<any> => {
    const insertData: any = editScreen ? await getNewChild(childData?.uuid, "true", null, '', plannedTermDate, name, '', '', childData?.createdAt) : await getNewChild('', "true", null, '', plannedTermDate, name, '', '', null);
    const childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(languageCode, editScreen, 2, childSet, dispatch, navigation, childAge, null, null, netInfo, false);
  }
  const deleteRecord = (index: number, dispatch: any, uuid: string, childList: any): any => {
    return new Promise((resolve, reject) => {
      Alert.alert(t('deleteChildTxt'), t('deleteWarnTxt'), [
        {
          text: t('removeOption1'),
          onPress: (): any => resolve('error'),
          style: 'cancel',
        },
        {
          text: t('removeOption2'),
          onPress: async (): Promise<any> => {
            if (index == 0) {
              const filterList = childList.filter((item: any) => item.uuid != uuid)
              const selectedUuid = filterList[0];
              dispatch(setActiveChildData(selectedUuid))
            }
            await deleteChild(
              navigation,
              languageCode,
              index,
              dispatch,
              'ChildEntity',
              uuid,
              'uuid ="' + uuid + '"',
              resolve,
              reject,
              childAge,
              t,
              childList
            );
            navigation.navigate('ChildProfileScreen')
          }
        },
      ]);
    });
  };
  return <>
    <View style={[styles.flex1, { backgroundColor: bgcolorWhite }]}>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <HeaderRowView
        style={[styles.headerRowView, { backgroundColor: headerColor }]}>
        <HeaderIconView>
          <HeaderIconPress
            onPress={(): any => {
              navigation.goBack();
            }}>
            <IconML name={'ic_back'} color="#FFF" size={15} />
          </HeaderIconPress>
        </HeaderIconView>
        <HeaderTitleView>
          <Heading2w style={styles.headerTitleTextColor} numberOfLines={1}>
            {childData && childData?.uuid != '' && childData?.uuid != null && childData?.uuid != undefined ? t('babyNotificationUpdateBtn') : t('expectChildAddTxt')}
          </Heading2w>
        </HeaderTitleView>
        <HeaderActionView style={styles.headerActionView}>
          {childList?.length > 1 && childData && childData?.uuid != '' ? (
            <Pressable style={styles.pressableView} onPress={(): any => {
              if (childData?.index == undefined) {
                deleteRecord(0, dispatch, childData?.uuid, childList)
              } else {
                deleteRecord(childData?.index, dispatch, childData?.uuid, childList)
              }
            }
            }>
              <Icon name={'ic_trash'} size={20} color="#FFF" />
            </Pressable>
          ) : null}
        </HeaderActionView>
      </HeaderRowView>

      <MainContainer>
        <FormDateContainer>
          <FormInputGroup onPress={showdobDatepicker}>
            <LabelText> {t('expectChildDueDateTxt')}</LabelText>
            <FormInputBox>
              <FormDateText>
                <Text>  {plannedTermDate ? formatStringDate(plannedTermDate) : t('expectChildDueDateTxt')}</Text>
              </FormDateText>
              <FormDateAction>
                <Icon name="ic_calendar" size={20} color="#000" />
              </FormDateAction>
            </FormInputBox>
          </FormInputGroup>
        </FormDateContainer>

        <View>
          {showdob && (
            Platform.OS != 'ios' ? (
              <DateTimePicker
                testID="dobdatePicker"
                minimumDate={new Date(DateTime.local().plus({ days: 1 }).toISODate())}
                maximumDate={new Date(dobMax)}
                value={plannedTermDate != null ? plannedTermDate : new Date()}
                mode={'date'}
                display="spinner"
                onChange={ondobChange}
              />
            ) :
              <DateTimePickerModal
                isVisible={isDobDatePickerVisible}
                mode="date"
                onConfirm={handleDobConfirm}
                date={plannedTermDate != null ? plannedTermDate : new Date(DateTime.local().plus({ days: 1 }).toISODate())}
                onCancel={(): any => {
                  setDobDatePickerVisibility(false);
                }}
                minimumDate={new Date(DateTime.local().plus({ days: 1 }).toISODate())}
                maximumDate={new Date(dobMax)}
              />
          )}
        </View>

        <FormContainer>
          <LabelText>{t('expectPreferNametxt')}</LabelText>
          <FormInputBox>
            <TextInputML
              style={styles.textInputML}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
              clearButtonMode="always"
              onChangeText={(value): any => {
                if (value.replace(/\s/g, "") == "") {
                  setName(value.replace(/\s/g, ''));
                } else {
                  setName(value.replace(regexpEmojiPresentation, ''));
                }
              }}
              value={name}
              placeholder={t('expectPreferNamePlacetxt')}
              placeholderTextColor={"gray"}
              allowFontScaling={false}
            />
          </FormInputBox>
        </FormContainer>

      </MainContainer>
      <ShiftFromTop10>
        <ButtonContainer>
          <ButtonPrimary
            disabled={plannedTermDate == null || plannedTermDate == undefined || name == null || name == undefined || name == "" || clicked ? true : false}
            onPress={(): any => {
              setClicked(true);
              setTimeout(() => {
                AddChild();
              }, 0)
            }}>
            <ButtonText numberOfLines={2}>{childData && childData?.uuid != '' ? t('editProfileBtn') : t('growthScreensaveMeasures')}</ButtonText>
          </ButtonPrimary>
        </ButtonContainer>
      </ShiftFromTop10>
    </View>
  </>;
};

export default AddExpectingChildProfile;
