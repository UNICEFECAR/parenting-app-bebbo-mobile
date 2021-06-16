import {
  ButtonPrimary, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import {
  CheckboxContainer,
  CheckboxItemText
} from '@components/shared/CheckboxStyle';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import CheckBox from '@react-native-community/checkbox';
import { useNetInfo } from '@react-native-community/netinfo';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView, useWindowDimensions, View
} from 'react-native';
import HTML from 'react-native-render-html';
import { useAppDispatch } from '../../App';
import { Heading1w } from '../styles/typography';
import { appConfig } from '../types/apiConstants';



type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoadingScreen'
>;

type Props = {
  navigation: TermsNavigationProp;
};

// function* retryApis(errorArr: any[]){
//   console.log("in retry",errorArr);
//   let onApiArray;
//   let failedApiObj = errorArr;
//   const apiJsonData = [
//     {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
//     {apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{}},
//     {apiEndpoint:appConfig.basicPages,method:'get',postdata:{}}
//   ]
//   if(failedApiObj) {
//     onApiArray = apiJsonData.filter((f: { apiEndpoint: any; }) =>
//       failedApiObj.some((d: any) => d.apiEndpoint == f.apiEndpoint)
//     );
//   }else {
//     onApiArray = apiJsonData;
//   }
//   console.log("onApiArray--",onApiArray);
//   const output = yield put(fetchAPI(onApiArray));
//   return output;
// }
// export const onApiSuccess2 =() => {
//   //hide loading and redirect on next screen code here
//   console.log("onApiSuccess");
// }
const Terms = ({navigation}: Props) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(false);
  const netInfo = useNetInfo();
  const {t} = useTranslation();
  const body =
    '<p>By using ParentBuddy application you accept these terms. These Terms and Conditions are in line with the Privacy Policy of the application<strong>.</strong></p>\n\n<p>The ParentBuddy is an app providing information and guidance to parents of young children, 0-6 years old, on different aspects of child health and development. It also supports parents to track child’s growth and development and receive relevant information and guidance on how to support them. Lastly, the app enables tracking of vaccination and health check-ups and can send notifications to remind parents of these important events.</p>\n\n<p>All information and guidance in this app serve solely for informational and educational purposes.</p>\n\n<p>The content of this app is not a substitute for health check-ups, medical examinations,assessments or diagnostic procedures. If you are concerned for your child’s health or development, we recommend that you consult your doctor or nurse. If the use of any information contained in the app leads to or causes loss or damage, UNICEF is not and cannot be responsible.</p>';
  const contentWidth = useWindowDimensions().width;
  const goToPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };
  const dispatch = useAppDispatch();
  // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
  const apiJsonData = [
    {
      apiEndpoint: appConfig.videoArticles,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.dailyMessages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.basicPages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
  ];

  //  apiJsonData.filter((el) => {
  //   return failedApiObj.some((f: any) => {
  //     console.log(f.apiEndpoint,"--",el.apiEndpoint);
  //     return f.apiEndpoint == el.apiEndpoint;
  //   });
  // });
  // const postdata={childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}
  const acceptTerms = () => {
    ///if(netInfo.isConnected){
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoadingScreen',
          params: {apiJsonData: apiJsonData, prevPage: 'Terms'},
        },
      ],
    });
    // }
    // else{
    //   Alert.alert("No Internet Connection.")
    // }
  };

  return (
    <>
      <OnboardingContainer>
        <OnboardingHeading>
          <Heading1w>{t('termsandconditionheader')}</Heading1w>
        </OnboardingHeading>
        <ScrollView contentContainerStyle={{padding: 0}}>
          <HTML
            source={{html: body}}
            baseFontStyle={{fontSize: 16, color: '#ffffff'}}
          />

          <Fragment>
            <View style={{marginTop: 20, paddingRight: 40}}>
              <CheckboxContainer>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                  tintColors={{true: '#8CAEE4', false: '#FFF'}}
                  boxType={'square'}
                  tintColor={'#FFF'}
                  onCheckColor={'#8CAEE4'}
                  onFillColor={'#FFF'}
                  onTintColor={'#FFF'}
                />
                <CheckboxItemText>{t('tAndCCheckbox1')}</CheckboxItemText>
              </CheckboxContainer>

              <CheckboxContainer>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox1}
                  onValueChange={(newValue) => setToggleCheckBox1(newValue)}
                  tintColors={{true: '#ffffff', false: '#d4d4d4'}}
                />
                <CheckboxItemText>{t('tAndCPrivacyPolicy')}</CheckboxItemText>
              </CheckboxContainer>
              <CheckboxContainer>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox2}
                  onValueChange={(newValue) => setToggleCheckBox2(newValue)}
                  tintColors={{true: '#ffffff', false: '#d4d4d4'}}
                />
                <CheckboxItemText>{t('tAndCCheckbox3')}</CheckboxItemText>
              </CheckboxContainer>
            </View>
          </Fragment>
        </ScrollView>
        <ButtonRow>
          <ButtonPrimary
            onPress={() => {
              acceptTerms();
              // navigation.navigate('LoadingScreen')
            }}>
            <ButtonText>I accept terms and conditions</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default Terms;
