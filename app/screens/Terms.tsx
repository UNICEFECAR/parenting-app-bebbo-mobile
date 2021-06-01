import {StackNavigationProp} from '@react-navigation/stack';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {View, Text, Button, useWindowDimensions, ScrollView, Pressable, Alert} from 'react-native';
import HTML from 'react-native-render-html';
import {RootStackParamList} from '../navigation/types';
import CheckBox from '../components/Checkbox';
// import Checkbox from '../styles/Checkbox';
import { ButtonText, Container, Header, HeaderText } from '../styles/style';
type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: TermsNavigationProp;
};
const Terms = ({navigation}: Props) => {
  const { t } = useTranslation();
  const body = "<p>By using ParentBuddy application you accept these terms. These Terms and Conditions are in line with the Privacy Policy of the application<strong>.</strong></p>\n\n<p>The ParentBuddy is an app providing information and guidance to parents of young children, 0-6 years old, on different aspects of child health and development. It also supports parents to track child’s growth and development and receive relevant information and guidance on how to support them. Lastly, the app enables tracking of vaccination and health check-ups and can send notifications to remind parents of these important events.</p>\n\n<p>All information and guidance in this app serve solely for informational and educational purposes.</p>\n\n<p>The content of this app is not a substitute for health check-ups, medical examinations,assessments or diagnostic procedures. If you are concerned for your child’s health or development, we recommend that you consult your doctor or nurse. If the use of any information contained in the app leads to or causes loss or damage, UNICEF is not and cannot be responsible.</p>";
  const contentWidth = useWindowDimensions().width;
  const goToPrivacyPolicy = () =>{
    navigation.navigate('PrivacyPolicy');
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
      <Pressable style={{backgroundColor: '#00AEEF', padding: 10,margin:10}} onPress={() => navigation.navigate('ChildSetup')}>
            <ButtonText>I accept terms and conditions</ButtonText>
      </Pressable>
      </Container>
      </>
  );
};

export default Terms;
