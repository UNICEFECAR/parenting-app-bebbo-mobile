import {StackNavigationProp} from '@react-navigation/stack';

import React, { Fragment, useState } from 'react';
import { put } from '@redux-saga/core/effects';
import { useTranslation } from 'react-i18next';
import {View, Text, Button, useWindowDimensions, ScrollView, Pressable, Alert} from 'react-native';
import HTML from 'react-native-render-html';
import { useAppDispatch, useAppSelector } from '../../App';
import {RootStackParamList} from '../navigation/types';

import CheckBox from '@react-native-community/checkbox';
import { fetchAPI } from '../redux/sagaMiddleware/sagaActions';

import { ButtonText, Container, Header, HeaderText } from '../styles/style';
import { appConfig } from '../types/apiConstants';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { Heading1w, Heading2w } from '../styles/typography';
type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoadingScreen'
>;

type Props = {
  navigation: TermsNavigationProp;
};
export function retryAlert(){
  return new Promise((resolve, reject) => {
    Alert.alert('Retry',"All content is not downloaded.Please Retry.",
      [
        {
          text: "Cancel",
          onPress: () => reject("Retry Cancelled"),
          style: "cancel"
        },
        { text: "Retry", onPress: () => resolve("Retry success") }
      ]
    );
  });
}
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
export const onApiSuccess =() => {
  //hide loading and redirect on next screen code here
  console.log("onApiSuccess");
}
const Terms = ({navigation}: Props) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(false);
  const { t } = useTranslation();
  const body = "<p>By using ParentBuddy application you accept these terms. These Terms and Conditions are in line with the Privacy Policy of the application<strong>.</strong></p>\n\n<p>The ParentBuddy is an app providing information and guidance to parents of young children, 0-6 years old, on different aspects of child health and development. It also supports parents to track child’s growth and development and receive relevant information and guidance on how to support them. Lastly, the app enables tracking of vaccination and health check-ups and can send notifications to remind parents of these important events.</p>\n\n<p>All information and guidance in this app serve solely for informational and educational purposes.</p>\n\n<p>The content of this app is not a substitute for health check-ups, medical examinations,assessments or diagnostic procedures. If you are concerned for your child’s health or development, we recommend that you consult your doctor or nurse. If the use of any information contained in the app leads to or causes loss or damage, UNICEF is not and cannot be responsible.</p>";
  const contentWidth = useWindowDimensions().width;
  const goToPrivacyPolicy = () =>{
    navigation.navigate('PrivacyPolicy');
  }
  const dispatch = useAppDispatch();
    
    // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
  const apiJsonData = [
    {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
    // {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
    {apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{}},
    {apiEndpoint:appConfig.basicPages,method:'get',postdata:{}}
  ]
  
  //  apiJsonData.filter((el) => {
  //   return failedApiObj.some((f: any) => {
  //     console.log(f.apiEndpoint,"--",el.apiEndpoint);
  //     return f.apiEndpoint == el.apiEndpoint;
  //   });
  // });
  // const postdata={childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}
  const callSagaApi = () => {
    console.log("terms call");
    dispatch(fetchApi(apiJsonData))
  }
  return (
    <>
      <OnboardingContainer>
        <OnboardingHeading>
          <Heading1w>{t('termsandconditionheader')}</Heading1w>
        </OnboardingHeading>
        <ScrollView contentContainerStyle={{ padding: 24, }}>
          <HTML
              source={{ html: body }}
              // contentWidth={contentWidth}
              baseFontStyle={{ fontSize: 18 }}
              // tagsStyles={htmlStyles}
              // imagesMaxWidth={Dimensions.get('window').width}
              // staticContentMaxWidth={Dimensions.get('window').width}
          />

          <Fragment>
                                <View style={{ marginTop: 20, paddingRight: 40 }}>

                                    {/* checkPrivateData */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox}
                                        onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                      />
                                        <Text>{t('tAndCCheckbox1')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop:14, alignItems: 'center' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox1}
                                        onValueChange={(newValue) => setToggleCheckBox1(newValue)}
                                      />
                                      <Text>{t('tAndCPrivacyPolicy')}</Text>
                                        {/* <CheckBox
                                              label={t('tAndCCheckbox2')}
                                              extralabel = {}
                                              goToPrivacy = {goToPrivacyPolicy}
                                              checkedValue = {false}
                                            /> */}
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 14, alignItems: 'center' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={toggleCheckBox2}
                                        onValueChange={(newValue) => setToggleCheckBox2(newValue)}
                                      />
                                      <Text>{t('tAndCCheckbox3')}</Text>
                                       {/* <CheckBox
                                              label={t('tAndCCheckbox3')}
                                              checkedValue = {true}
                                            /> */}
                                    </View>

                                    {/* checkOtherConditions */}
                                    {/* <View style={{ flexDirection: 'row', marginTop: scale(14), alignItems: 'center' }}>
                                        <Checkbox.Android
                                            status={this?.state?.checkOtherConditions ? 'checked' : 'unchecked'}
                                            onPress={() => { this.setState({ checkOtherConditions: !this.state.checkOtherConditions }); }}
                                            color={colors?.checkboxColor}
                                        />
                                        <View style={{ flex: 1, }}>
                                            <Typography type={TypographyType.bodyRegular} style={{ textAlign: 'left', marginLeft: scale(5) }}>
                                                {translate('privacyPolicyCheckBox')}
                                                <Text style={{ fontWeight: "bold" }} onPress={() => this.props.navigation.navigate('RootModalStackNavigator_PrivacyPolicyScreen')}> {translate('privacyPolicyLinkText')}</Text>
                                            </Typography>
                                        </View>
                                    </View> */}

                                    {/* checkAnonDataAccess */}
                                    {/* <View style={{ flexDirection: 'row', marginTop: scale(14), alignItems: 'center', }}>
                                        <Checkbox.Android
                                            status={this?.state?.checkAnonDataAccess ? 'checked' : 'unchecked'}
                                            onPress={() => { this.onAnonDataAccessPress() }}
                                            color={colors?.checkboxColor}
                                        />
                                        <TouchableWithoutFeedback style={{ padding: 5 }} onPress={() => { this.onAnonDataAccessPress() }}>
                                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1, textAlign: 'left', marginLeft: scale(5) }}>
                                                {translate('dataUsageCheckbox')}
                                            </Typography>
                                        </TouchableWithoutFeedback>
                                    </View> */}
                                </View>

                                {/* ACCEPT BUTTON */}
                                {/* <RoundedButton
                                    text={translate('acceptTermsAndConditions')}
                                    disabled={this?.state?.checkPrivateData && this?.state?.checkOtherConditions ? false : true}
                                    type={RoundedButtonType.purple}
                                    onPress={() => { this.onAcceptButtonClick() }}
                                    style={{ marginTop: scale(20) }}
                                /> */}
                            </Fragment>
            {/* <Button
              title="Go to ChildSetup"
              onPress={() => navigation.navigate('ChildSetup')}
            /> */}
      </ScrollView>
      <Pressable style={{backgroundColor: '#00AEEF', padding: 10,margin:10}} onPress={() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'LoadingScreen'}],
        })
        // navigation.navigate('LoadingScreen')
        
        }}>
            <ButtonText>I accept terms and conditions</ButtonText>
      </Pressable>
      {/* <Pressable style={{backgroundColor: '#00AEEF', padding: 10}} onPress={() => callSagaApi()}>
            <ButtonText>Call saga</ButtonText>
      </Pressable> */}
      </OnboardingContainer>
      </>
  );
};

export default Terms;
