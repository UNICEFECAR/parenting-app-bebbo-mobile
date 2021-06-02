import {StackNavigationProp} from '@react-navigation/stack';
import { put } from '@redux-saga/core/effects';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {View, Text, Button, useWindowDimensions, ScrollView, Pressable, Alert} from 'react-native';
import HTML from 'react-native-render-html';
import { useAppDispatch, useAppSelector } from '../../App';
import {RootStackParamList} from '../navigation/types';
import { fetchOnloadAPI } from '../redux/sagaMiddleware/sagaActions';
import CheckBox from '../styles/Checkbox';
// import Checkbox from '../styles/Checkbox';
import { ButtonText, Container, Header, HeaderText } from '../styles/style';
import { appConfig } from '../types/apiConstants';
type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: TermsNavigationProp;
};
export function retryOnloadAlert(){
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
//   let onLoadApiArray;
//   let failedApiObj = errorArr;
//   const apiJsonData = [
//     {apiEndpoint:appConfig.articles,method:'get',postdata:{childAge:'all',childGender:'all',parentGender:'all',Seasons:'all'}},
//     {apiEndpoint:appConfig.dailyMessages,method:'get',postdata:{}},
//     {apiEndpoint:appConfig.basicPages,method:'get',postdata:{}}
//   ]
//   if(failedApiObj) {
//     onLoadApiArray = apiJsonData.filter((f: { apiEndpoint: any; }) =>
//       failedApiObj.some((d: any) => d.apiEndpoint == f.apiEndpoint)
//     );
//   }else {
//     onLoadApiArray = apiJsonData;
//   }
//   console.log("onLoadApiArray--",onLoadApiArray);
//   const output = yield put(fetchOnloadAPI(onLoadApiArray));
//   return output;
// }
export const onLoadApiSuccess =() => {
  //hide loading and redirect on next screen code here
  console.log("onLoadApiSuccess");
}
const Terms = ({navigation}: Props) => {
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
    dispatch(fetchOnloadAPI(apiJsonData))
  }
  return (
    <>
      <Container>
        <Header>
          <HeaderText>{t('termsandconditionheader')}</HeaderText>
        </Header>
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
                                              label={t('tAndCCheckbox1')}
                                              checkedValue={false}
                                              // style={{alignSelf: "center"}}
                                            />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop:14, alignItems: 'center' }}>
                                          <CheckBox
                                              label={t('tAndCCheckbox2')}
                                              extralabel = {t('tAndCPrivacyPolicy')}
                                              goToPrivacy = {goToPrivacyPolicy}
                                              checkedValue = {false}
                                            />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 14, alignItems: 'center' }}>
                                          <CheckBox
                                              label={t('tAndCCheckbox3')}
                                              checkedValue = {true}
                                            />
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
      <Pressable style={{backgroundColor: '#00AEEF', padding: 10}} onPress={() => Alert.alert('Coming Soon',"Work in Progress",)}>
            <ButtonText>I accept terms and conditions</ButtonText>
      </Pressable>
      <Pressable style={{backgroundColor: '#00AEEF', padding: 10}} onPress={() => callSagaApi()}>
            <ButtonText>Call saga</ButtonText>
      </Pressable>
      </Container>
      </>
  );
};

export default Terms;
