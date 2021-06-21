import basicPagesData from '@assets/translations/appOfflineData/basicPages';
import useToGetOfflineData from '@assets/translations/appOfflineData/useToGetOfflineData';
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
import { StackNavigationProp } from '@react-navigation/stack';
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import HTML from 'react-native-render-html';
import { useAppDispatch, useAppSelector } from '../../App';
import { BasicPagesEntity, BasicPagesSchema } from '../database/schema/BasicPagesSchema';
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
  const [toggleCheckBox2, setToggleCheckBox2] = useState(false);
  const {t} = useTranslation();
  const goToPrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };
  // dispatch(setAllTermsData([{termsId:'1234',termsData:'terms page text'}]));
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetchData() {
      let Entity:any;
      // Entity = Entity as TaxonomyEntity
      const basicData = useToGetOfflineData(languageCode,dispatch,BasicPagesSchema,Entity as BasicPagesEntity,basicPagesData,setAllTermsData);
      console.log("basicpagesData--",basicData);
    }
    fetchData()
  },[languageCode]);
  // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
  const termsdata = useAppSelector(
    (state: any) => state.utilsData.terms.body,
  );
  const privacydata = useAppSelector(
    (state: any) => state.utilsData.privacypolicy.body,
  );
  console.log("termsdata--",termsdata);
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
  const acceptTerms = () => {
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
        <OnboardingHeading>
          <Heading1w>{t('tNc.header')}</Heading1w>
        </OnboardingHeading>
        <ScrollView contentContainerStyle={{padding: 0}}>
          <HTML
            source={{html: termsdata}}
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
                <CheckboxItemText>{t('tNc.checkbox1')}</CheckboxItemText>
              </CheckboxContainer>

              <CheckboxContainer>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox1}
                  onValueChange={(newValue) => setToggleCheckBox1(newValue)}
                  tintColors={{true: '#ffffff', false: '#d4d4d4'}}
                />
                <CheckboxItemText>{t('tNc.checkbox2')}
                 <CheckboxItemText onPress={goToPrivacyPolicy} style={{fontWeight:'bold'}}>{t('tNc.privacyPolicy')}</CheckboxItemText>
                 </CheckboxItemText>
              </CheckboxContainer>
              <CheckboxContainer>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox2}
                  onValueChange={(newValue) => setToggleCheckBox2(newValue)}
                  tintColors={{true: '#ffffff', false: '#d4d4d4'}}
                />
                <CheckboxItemText>{t('tNc.checkbox3')}</CheckboxItemText>
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
            <ButtonText>{t('tNc.acceptbtn')}</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default Terms;
