import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonPrimary, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import Checkbox, { CheckboxActive, CheckboxItem, CheckboxItemText, FormOuterCheckbox } from '@components/shared/CheckboxStyle';
import { LabelTCText, LabelText, LinkContainer, LinkText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer, { OnboardingshiftHead } from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { appConfig } from '../assets/translations/appOfflineData/apiConstants';
import { setAcceptTerms } from '../redux/reducers/utilsSlice';
import { Heading1w, Heading2Centerw, SideRightSpacing20, SideSpacing20 } from '../styles/typography';
import { bgcolorWhite2, primaryColor } from '@styles/style';
import VectorImage from 'react-native-vector-image';
import { activityLogo, adviceLogo, bebboLogoShapeNew, toolsLogo } from '@dynamicImportsClass/dynamicImports';
import FeatureTCView from '@components/shared/FeaturesTCView';
import { FontWeight } from '@shopify/react-native-skia';


type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: TermsNavigationProp;
};
const item = {
  image: bebboLogoShapeNew,
  advice: adviceLogo,
  tools: toolsLogo,
  activity: activityLogo
};
const styles = StyleSheet.create({
  checkboxStyle: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  },

  containerView: {
    backgroundColor: primaryColor,
    flex: 1
  },
  containerView2: {
    marginTop: 20,
    paddingRight: 40
  },
  privacyText:{
    color:'#1CABE2',
    fontWeight: "700"
  },
  scrollViewStyle: {
    padding: 0
  },
  vectorImageView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    marginTop: 45,
  },

})
const Terms = ({ navigation }: Props): any => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(true);
  const isButtonDisabled = (toggleCheckBox == false)
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const goToPrivacyPolicy = (): any => {
    navigation.navigate('PrivacyPolicy');
  };
  const goToTerms = (): any => {
    navigation.navigate('TermsPage');
  };
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      setLoading(false);
    }, [languageCode])
  );
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        navigation.dispatch((state: any) => {
          // Remove the home route from the stack
          const routes = state.routes.filter((r: any) => r.name !== 'LoadingScreen');

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      }, 500);
    }, [])
  );
  const acceptTermsFlag = useAppSelector(
    (state: any) =>
      state.utilsData.acceptTerms
  );
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
      apiEndpoint: appConfig.activities,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.surveys,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestones,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childDevelopmentData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.vaccinations,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthCheckupData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.vaccinePinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childGrowthPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthcheckupPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.faqPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestoneRelatedArticle,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.standardDeviation,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.faqs,
      method: 'get',
      postdata: {},
      saveinDB: true,
    }
    // survey,child dev,vaccine,healthcheckup,growth,activities,
    // pinned for all 4 tools
  ];
  const acceptTerms = async (): Promise<any> => {
    if (acceptTermsFlag == false) {
      dispatch(setAcceptTerms(true));
    }
    navigation.navigate('LoadingScreen', {
      apiJsonData: apiJsonData,
      prevPage: 'Terms'
    });
  };

  return (
    <>
      <View style={styles.containerView}>
        <FocusAwareStatusBar
          animated={true}
          backgroundColor={headerColor}
        />
        <OnboardingContainer>
          <OverlayLoadingComponent loading={loading} />

          <View style={styles.vectorImageView}>
            <VectorImage source={item.image} />
          </View>

          <OnboardingshiftHead>
            <Heading2Centerw>{t('discoverBebo')}</Heading2Centerw>
          </OnboardingshiftHead>
          <ScrollView contentContainerStyle={styles.scrollViewStyle}>
            <Fragment>
              <View style={styles.containerView2}>
                <FeatureTCView
                  title={t('walkthroughTextstitle3').toString()}
                  subTitle={t('walkthroughTextssubtitle3').toString()}
                  iconname={item.advice}
                />
                <FeatureTCView
                  title={t('walkthroughTextstitle2').toString()}
                  subTitle={t('walkthroughTextssubtitle2').toString()}
                  iconname={item.tools}
                />
                <FeatureTCView
                  title={t('walkthroughTextstitle1').toString()}
                  subTitle={t('walkthroughTextssubtitle1').toString()}
                  iconname={item.activity}
                />

              </View>
            </Fragment>
          </ScrollView>
          <ButtonRow>
            <FormOuterCheckbox
              onPress={(): any => {
                setToggleCheckBox(!toggleCheckBox);
              }}>
              <CheckboxItem>
                <View>
                  {toggleCheckBox ? (
                    <CheckboxActive>
                      <Icon name="ic_tick" size={12} color="#fff" />
                    </CheckboxActive>
                  ) : (
                    <Checkbox></Checkbox>
                  )}
                </View>
              </CheckboxItem>

              {/* <LabelText>
                {t('tNccheckbox2')}{' '}
                <LinkContainer>
                <Text style={{fontSize:16}}>
                <TouchableOpacity onPress={goToPrivacyPolicy}>
                    <LinkText>Privacy Policy</LinkText>
                   
                  </TouchableOpacity>
                  {' '}
                  and{' '}
                </Text>
                 
                  <Text style={{fontSize:16,marginBottom:-20}}>
                  <TouchableOpacity onPress={goToTerms}>
                    <LinkText>Terms and Conditions</LinkText>
                   
                  </TouchableOpacity>
                  {' '} of the
                
                  </Text>
                 
                 
                </LinkContainer>
               application.
              </LabelText> */}
              <SideRightSpacing20>
              <LabelText>
              {t('tNccheckbox2')}{' '}
            
                <LabelText onPress={goToPrivacyPolicy} style={styles.privacyText}>
                  Privacy Policy {' '}
                </LabelText>
                and {' '}
                <LabelText onPress={goToTerms} style={styles.privacyText}>
                  Terms and conditions {' '}
                </LabelText>
                of the application.
              </LabelText>
              </SideRightSpacing20>
      
              {/* <LabelText>{t('tNccheckbox2')} <CheckboxItemText onPress={goToTerms} style={styles.checkboxStyle}>{t('tncCheckBoxText')}</CheckboxItemText></LabelText> */}
            </FormOuterCheckbox>
            <ButtonPrimary
              disabled={isButtonDisabled}
              onPress={(): any => {
                acceptTerms();
              }}>
              <ButtonText numberOfLines={2}>{t('continueCountryLang')}</ButtonText>
            </ButtonPrimary>
          </ButtonRow>
        </OnboardingContainer>
      </View>
    </>
  );
};

export default Terms;

