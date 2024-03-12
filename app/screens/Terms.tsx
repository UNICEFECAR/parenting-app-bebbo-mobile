import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonPrimary, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import Checkbox, { CheckboxActive, CheckboxItem, CheckboxItemText, FormOuterCheckbox } from '@components/shared/CheckboxStyle';
import { LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer, { OnboardingshiftHead } from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { appConfig } from '../assets/translations/appOfflineData/apiConstants';
import { setAcceptTerms } from '../redux/reducers/utilsSlice';
import { Heading1w, Heading2Centerw } from '../styles/typography';
import { bgcolorWhite2, primaryColor } from '@styles/style';
import VectorImage from 'react-native-vector-image';
import { bebboLogoShapeNew } from '@dynamicImportsClass/dynamicImports';


type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoadingScreen'
>;

type Props = {
  navigation: TermsNavigationProp;
};
const item = {
  image:bebboLogoShapeNew
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
  scrollViewStyle: {
    padding: 0
  },
  vectorImageView:{
    alignItems:'center',
    justifyContent:'center',
    marginBottom:15,
    marginTop:45,
  }
})
const Terms = ({ navigation }: Props): any => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(true);
  const isButtonDisabled = (toggleCheckBox == false || toggleCheckBox1 == false)
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
                  <LabelText>{t('tNccheckbox2')} <CheckboxItemText onPress={goToTerms} style={styles.checkboxStyle}>{t('tncCheckBoxText')}</CheckboxItemText></LabelText>
                </FormOuterCheckbox>
                <FormOuterCheckbox
                  onPress={(): any => {
                    setToggleCheckBox1(!toggleCheckBox1);
                  }}>
                  <CheckboxItem >
                    <View>
                      {toggleCheckBox1 ? (
                        <CheckboxActive>
                          <Icon name="ic_tick" size={12} color="#fff" />
                        </CheckboxActive>
                      ) : (
                        <Checkbox></Checkbox>
                      )}
                    </View>
                  </CheckboxItem>
                   <LabelText>{t('tNccheckbox2')} <CheckboxItemText onPress={goToPrivacyPolicy} style={styles.checkboxStyle}>{t('tNcprivacyPolicy')}</CheckboxItemText></LabelText>
                </FormOuterCheckbox>
              </View>
            </Fragment>
          </ScrollView>
          <ButtonRow>
            <ButtonPrimary
              disabled={isButtonDisabled}
              onPress={(): any => {
                acceptTerms();
              }}>
              <ButtonText>{t('tNcacceptbtn')}</ButtonText>
            </ButtonPrimary>
          </ButtonRow>
        </OnboardingContainer>
      </View>
    </>
  );
};

export default Terms;

