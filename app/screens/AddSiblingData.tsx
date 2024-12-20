
// import { bothChildGender, regexpEmojiPresentation } from '@assets/translations/appOfflineData/apiConstants';
import { appConfig } from '../instance';
import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonRow, ButtonText, ButtonUpperCaseText } from '@components/shared/ButtonGlobal';
import { ChildAddTop, FormContainer1, FormInputBox, LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import TextInputML from '@components/shared/TextInputML';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { bgcolorWhite2, primaryColor } from '@styles/style';
import { dobMax } from '@types/types';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { userRealmCommon } from '../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../database/schema/ChildDataSchema';
import { addChild, getNewChild } from '../services/childCRUD';
import { validateForm } from '../services/Utils';
import { Heading1Centerw, ShiftFromTop20, ShiftFromTop5, SideSpacing25 } from '@styles/typography';
import useNetInfoHook from '../customHooks/useNetInfoHook';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeDrawerNavigator'
>;

type Props = {
  route: any;
  navigation: ChildSetupNavigationProp;
};
const styles = StyleSheet.create({
  containerView: {
    backgroundColor: bgcolorWhite2,
    flex: 1
  },
  scrollViewStyle: {
    padding: 0,
    paddingTop: 0
  },
  textInputStyle: {
    width: '100%'
  }
})
const AddSiblingData = ({ route, navigation }: Props): any => {
  const netInfo = useNetInfoHook();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { headerTitle } = route.params;
  const { childData } = route.params;
  const uuid = childData != null ? childData.uuid : '';
  const createdAt = childData != null ? childData.createdAt : null;
  const relationship = childData != null ? childData.relationship : '';
  const editScreen = childData != null ? true : false;
  const childAge = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  let genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );

  genders = genders.map((v: any) => ({ ...v, title: v.name })).filter(function (e: any) {
    return e.id != appConfig.bothChildGender;
  });
  const [birthDate, setBirthDate] = useState<Date>();
  const [plannedTermDate, setPlannedTermDate] = useState<Date>();
  const [isPremature, setIsPremature] = useState<string>('false');
  const [isExpected, setIsExpected] = useState<string>('false');
  const [defaultGenderValue, setDefaultGenderValue] = useState<any>(null);
  const sendData = (data: any): any => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.plannedTermDate);
    const myString = String(data.isPremature);
    setIsPremature(myString);
    setIsExpected(String(data.isExpected));
  };
  const isFutureDate = (date: Date): any => {
    return new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
  };
  const [name, setName] = React.useState('');
  useFocusEffect(
    React.useCallback(() => {
      if (childData != null && childData.uuid != '') {
        sendData(childData);
        setName(childData.childName);
      }
      setDefaultGenderValue(childData && childData.uuid ? genders.find((item: any) => item.id == childData?.gender) : { title: '' })
    }, [])
  );

  const [gender, setGender] = React.useState(
    childData != null ? childData.gender : 0,
  );
  const getCheckedItem = (checkedItem: typeof genders[0]): any => {
    setGender(checkedItem.id);
  };
  const AddChild = async (): Promise<any> => {
    await userRealmCommon.getData<ChildEntity>(ChildEntitySchema);
    const defaultName = name;
    const insertData: any = editScreen ? await getNewChild(uuid,'', isExpected, plannedTermDate, isPremature, birthDate, name, '', gender, createdAt) : await getNewChild('', '',isExpected, plannedTermDate, isPremature, birthDate, defaultName, '', gender, createdAt)
    const childSet: Array<any> = [];
    childSet.push(insertData);
    addChild(languageCode, editScreen, 1, childSet, dispatch, navigation, childAge, null, null, netInfo,false,true,'');
  }
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  return <>
    <View style={styles.containerView}>

      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <OnboardingContainer>
          <View>
            <OnboardingHeading>
              <ChildAddTop>
                <Heading1Centerw>{headerTitle}</Heading1Centerw>
                <ShiftFromTop5>
                  <Pressable
                    onPress={(): any => {
                      navigation.goBack();
                    }}>
                    <Icon name="ic_close" size={20} color="#000" />
                  </Pressable>
                </ShiftFromTop5>
              </ChildAddTop>
            </OnboardingHeading>
            <ChildDate sendData={sendData} childData={childData} dobMax={dobMax} prevScreen="Onboarding" />
            <ShiftFromTop20>
              <LabelText>{t('childNameTxt')}</LabelText>
              <FormInputBox>
                <TextInputML
                  style={styles.textInputStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                  clearButtonMode="always"
                  onChangeText={(value): any => {
                    if (value.replace(/\s/g, "") == "") {
                      setName(value.replace(/\s/g, ''));
                    } else {
                      setName(value.replace(appConfig.regexpEmojiPresentation, ''));
                    }
                  }}
                  value={name}
                  //placeholder={t('childNamePlaceTxt')}
                  //placeholderTextColor={"#77777779"}
                  allowFontScaling={false}
                />
              </FormInputBox>
            </ShiftFromTop20>
            {
              birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ?
                <FormContainer1>
                  <LabelText>{t('genderLabel')}</LabelText>
                  <ToggleRadios
                    options={genders}
                    defaultValue={defaultGenderValue}
                    tickbgColor={headerColor}
                    tickColor={'#FFF'}
                    getCheckedItem={getCheckedItem}
                  />
                </FormContainer1>
                : null}
          </View>
          <ButtonRow>
          <ButtonPrimary
            disabled={birthDate != null && birthDate != undefined && !isFutureDate(birthDate) ? !validateForm(2, birthDate, isPremature, relationship, plannedTermDate, name, gender) : !validateForm(4, birthDate, isPremature, relationship, plannedTermDate, name, gender)}
            onPress={(): any => {
              let validated: any = false;
              if (birthDate != null && birthDate != undefined && !isFutureDate(birthDate)) {
                validated = validateForm(2, birthDate, isPremature, relationship, plannedTermDate, name, gender);
              }
              else if (birthDate != null && birthDate != undefined && isFutureDate(birthDate)) {
                validated = validateForm(4, birthDate, isPremature, relationship, plannedTermDate, name, gender);
              }
              if (validated == true) {
                AddChild();
              }
              else {
                //Alert.alert(validated);
              }


            }}>
            <ButtonUpperCaseText numberOfLines={2}>{t('childSetupListsaveBtnText')}</ButtonUpperCaseText>
          </ButtonPrimary>
        </ButtonRow>

        </OnboardingContainer>
      </ScrollView>
     
    </View>
  </>;
};

export default AddSiblingData;
