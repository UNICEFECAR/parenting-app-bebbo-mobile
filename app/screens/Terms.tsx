import basicPagesData from '@assets/translations/appOfflineData/basicPages';
import useToGetOfflineData from '@assets/translations/appOfflineData/useToGetOfflineData';
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
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import HTML from 'react-native-render-html';
import { useAppDispatch, useAppSelector } from '../../App';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { BasicPagesEntity, BasicPagesSchema } from '../database/schema/BasicPagesSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../database/schema/ConfigSettingsSchema';
import { setAllTermsData } from '../redux/reducers/utilsSlice';
import { Heading1w } from '../styles/typography';
import { appConfig } from '../types/apiConstants';



type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoadingScreen'
>;

type Props = {
  navigation: TermsNavigationProp;
};
const Terms = ({navigation}: Props) => {
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
      async function fetchData() {
        let Entity:any;
        // Entity = Entity as TaxonomyEntity
        const basicData = await useToGetOfflineData(languageCode,dispatch,BasicPagesSchema,Entity as BasicPagesEntity,basicPagesData,setAllTermsData);
      // console.log(stateArticleData,"artData--",artData.length);
        // setArticleData(stateArticleData)
      // console.log("basicpagesData--",basicData);
        setLoading(false);
     
      }
      fetchData()
    },[languageCode])
  );
  const termsdata = useAppSelector(
    (state: any) => state.utilsData.terms.body,
  );
  
  const privacydata = useAppSelector(
    (state: any) => state.utilsData.privacypolicy.body,
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
    }
  ];
  const acceptTerms = async () => {
   
    let acceptTermsRes = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "acceptTerms","true");
    let userIsOnboarded = await dataRealmCommon.updateSettings<ConfigSettingsEntity>(ConfigSettingsSchema, "userIsOnboarded","true");
  
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoadingScreen',
          params: {apiJsonData: apiJsonData, prevPage: 'Terms'},
        },
      ],
    });
  };

  return (
    <>
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
    </>
  );
};

export default Terms;
