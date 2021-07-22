import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonPrimary, ButtonRow, ButtonText
} from '@components/shared/ButtonGlobal';
import Checkbox, { CheckboxActive, CheckboxItem, CheckboxItemText, FormOuterCheckbox } from '@components/shared/CheckboxStyle';
import { LabelText } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';
import HTML from 'react-native-render-html';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { appConfig } from '../assets/translations/appOfflineData/apiConstants';
import { setAcceptTerms } from '../redux/reducers/utilsSlice';
import { Heading1w } from '../styles/typography';



type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoadingScreen'
>;

type Props = {
  navigation: TermsNavigationProp;
};
const Terms = ({navigation}: Props) => {
  const themeContext = useContext(ThemeContext);
  const headerColor=themeContext.colors.PRIMARY_COLOR;
 
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(true);
  const isButtonDisabled = (toggleCheckBox==false || toggleCheckBox1==false)
  const [loading, setLoading] = useState(true);
  // setLoading(true);
  const {t} = useTranslation();
  // console.log("loading00",loading);
  const goToPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };
  // dispatch(setAllTermsData([{termsId:'1234',termsData:'terms page text'}]));
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   async function fetchData() {
  //     let Entity:any;
  //     // Entity = Entity as TaxonomyEntity
  //     console.log("basicpagesData--",basicData);
  //     setLoading(false);
  //   }
  //   fetchData()
  // },[languageCode]);
  // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
  useFocusEffect(
    React.useCallback(() => {
      setLoading(false);
    },[languageCode])
  );
  const termsdata = useAppSelector(
    (state: any) => state.utilsData.terms.body,
  );
  
  const acceptTermsFlag = useAppSelector(
    (state: any) =>
      state.utilsData.acceptTerms
     );
  //console.log("termsdata--",termsdata);
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
    // {
    //   apiEndpoint: appConfig.childGrowthData,
    //   method: 'get',
    //   postdata: {},
    //   saveinDB: true,
    // },
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
    // {
    //   apiEndpoint: appConfig.pinnedContent,
    //   method: 'get',
    //   postdata: {},
    //   saveinDB: true,
    // },
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
      apiEndpoint: appConfig.childdevGirlPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childdevBoyPinnedContent,
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
        apiEndpoint: appConfig.standardDeviation,
        method: 'get',
        postdata: {},
        saveinDB: true,
      }
    // survey,child dev,vaccine,healthcheckup,growth,activities,
    // pinned for all 4 tools
  ];
  const acceptTerms = async () => {
   
    // let acceptTermsRes = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "acceptTerms","true");
    // let userIsOnboarded = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userIsOnboarded","true");
    
       if(acceptTermsFlag == false)
       {
        dispatch(setAcceptTerms(true));
       }
       navigation.navigate('LoadingScreen', {
        apiJsonData: apiJsonData, 
        prevPage: 'Terms'
      });
    // navigation.reset({
    //   index: 0,
    //   routes: [
    //     {
    //       name: 'LoadingScreen',
    //       params: {apiJsonData: apiJsonData, prevPage: 'Terms'},
    //     },
    //   ],
    // });
  };

  return (
    <>
     <SafeAreaView style={{flex:1}}>
     <FocusAwareStatusBar
        animated={true}
        backgroundColor={headerColor}
       />
      <OnboardingContainer>
      <OverlayLoadingComponent loading={loading} />
        <OnboardingHeading>
          <Heading1w>{t('tNcheader')}</Heading1w>
        </OnboardingHeading>
        <ScrollView contentContainerStyle={{padding: 0}}>
          { termsdata != "" ?
            <HTML
              source={{html: termsdata}}
              baseFontStyle={{fontSize: 16, color: '#ffffff'}}
            />
            : null
          }

          <Fragment>
            <View style={{marginTop: 20, paddingRight: 40}}>
            <FormOuterCheckbox
            onPress={() => {
              setToggleCheckBox(!toggleCheckBox);
            }}>
            <CheckboxItem>
              <View>
                {toggleCheckBox ? (
                  <CheckboxActive>
                    <Icon name="ic_tick" size={12} color="#000" />
                  </CheckboxActive>
                ) : (
                  <Checkbox></Checkbox>
                )}
              </View>
            </CheckboxItem>
            <LabelText>{t('tNccheckbox1')}</LabelText>
          </FormOuterCheckbox>
          <FormOuterCheckbox
            onPress={() => {
              setToggleCheckBox1(!toggleCheckBox1);
            }}>
            <CheckboxItem>
              <View>
                {toggleCheckBox1 ? (
                  <CheckboxActive>
                    <Icon name="ic_tick" size={12} color="#000" />
                  </CheckboxActive>
                ) : (
                  <Checkbox></Checkbox>
                )}
              </View>
            </CheckboxItem>
            <LabelText>{t('tNccheckbox2')} <CheckboxItemText onPress={goToPrivacyPolicy} style={{fontWeight:'bold'}}>{t('tNcprivacyPolicy')}</CheckboxItemText></LabelText>
          </FormOuterCheckbox>
          <FormOuterCheckbox
            onPress={() => {
              setToggleCheckBox2(!toggleCheckBox2);
            }}>
            <CheckboxItem>
              <View>
                {toggleCheckBox2 ? (
                  <CheckboxActive>
                    <Icon name="ic_tick" size={12} color="#000" />
                  </CheckboxActive>
                ) : (
                  <Checkbox></Checkbox>
                )}
              </View>
            </CheckboxItem>
            <LabelText>{t('tNccheckbox3')}</LabelText>
          </FormOuterCheckbox>
              {/* <CheckboxContainer>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={(newValue) => setToggleCheckBox(newValue)}
                  tintColors={{true:'#ffffff', false: '#FFF'}}
                  boxType={'square'}
                  tintColor={'#FFF'}
                  onCheckColor={'#8CAEE4'}
                  onFillColor={'#FFF'}
                  onTintColor={'#FFF'}
                />
                <CheckboxItemText>{t('tNccheckbox1')}</CheckboxItemText>
              </CheckboxContainer> */}

              {/* <CheckboxContainer>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox1}
                  onValueChange={(newValue) => setToggleCheckBox1(newValue)}
                  tintColors={{true: '#ffffff', false: '#d4d4d4'}}
                />
                <CheckboxItemText>{t('tNccheckbox2')}
                 <CheckboxItemText onPress={goToPrivacyPolicy} style={{fontWeight:'bold'}}>{t('tNcprivacyPolicy')}</CheckboxItemText>
                 </CheckboxItemText>
              </CheckboxContainer> */}
              {/* <CheckboxContainer>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox2}
                  onValueChange={(newValue) => setToggleCheckBox2(newValue)}
                  tintColors={{true: '#ffffff', false: '#d4d4d4'}}
                />
                <CheckboxItemText>{t('tNccheckbox3')}</CheckboxItemText>
              </CheckboxContainer> */}
            </View>
          </Fragment>
        </ScrollView>
        <ButtonRow>
          <ButtonPrimary
            disabled={isButtonDisabled}
            onPress={() => {
              acceptTerms();
              // navigation.navigate('LoadingScreen')
            }}>
            <ButtonText>{t('tNcacceptbtn')}</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
      </SafeAreaView>
    </>
  );
};

export default Terms;

