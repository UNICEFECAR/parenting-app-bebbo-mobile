import {
  ButtonLinkText,
  ButtonPrimary,
  ButtonRow,
  ButtonText
} from '@components/shared/ButtonGlobal';
import {
  ChildCenterView,
  ChildColArea1,
  ChildColArea2,
  ChildContentArea,
  ChildListingArea,
  ChildListingBox,
  ChildListTitle,
  TitleLinkSm
} from '@components/shared/ChildSetupStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';
import {
  Heading1Centerw,
  Heading3Centerw,
  ShiftFromBottom20
} from '../styles/typography';
import { appConfig } from '../types/apiConstants';
type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddSiblingDataScreen'
>;
type Props = {
  navigation: ChildSetupNavigationProp;
};

const ChildSetupList = ({navigation}: Props) => {
  const {t} = useTranslation();
  // failedApiObj = failedApiObj != "" ? JSON.parse(failedApiObj) : [];
  const apiJsonData = [
    {
      apiEndpoint: appConfig.articles,
      method: 'get',
      postdata: {
        childAge: '43',
        childGender: 'all',
        // childAge: '43',
        // childGender: '40',
        parentGender: 'all',
        Seasons: 'all',
      },
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.taxonomies,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    // {apiEndpoint:appConfig.basicPages,method:'get',postdata:{},saveinDB:true}
  ];
  const childSetup = () => {
    // if(netInfo.isConnected){
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LoadingScreen',
          params: {apiJsonData: apiJsonData, prevPage: 'ChilSetup'},
        },
      ],
    });
    // navigation.navigate('HomeDrawerNavigator')
  };
  // else{
  //   Alert.alert("No Internet Connection.")
  // }

  return (
    <>
      <OnboardingContainer>
        <OnboardingHeading>
          <ChildCenterView>
            <Heading1Centerw>
            {t('childSetupList.header')}
            </Heading1Centerw>
            <Heading3Centerw>
            {t('childSetupList.subHeader')}
            </Heading3Centerw>
          </ChildCenterView>
        </OnboardingHeading>
        <ChildContentArea>
          <ChildListingArea>
            <ChildListingBox>
              <ChildColArea1>
                <ChildListTitle>Child 1</ChildListTitle>
                <Text>Born on 08 july 2020</Text>
              </ChildColArea1>
              <ChildColArea2>
                <TitleLinkSm>Delete</TitleLinkSm>
                <TitleLinkSm>Edit Profile</TitleLinkSm>
              </ChildColArea2>
            </ChildListingBox>

            <ChildListingBox>
              <ChildColArea1>
                <ChildListTitle>Child 2</ChildListTitle>
                <Text>Born on 22 june 2018</Text>
              </ChildColArea1>
              <ChildColArea2>
                <TitleLinkSm>Delete</TitleLinkSm>
                <TitleLinkSm>Edit Profile</TitleLinkSm>
              </ChildColArea2>
            </ChildListingBox>
          </ChildListingArea>
        </ChildContentArea>

        <ButtonRow>
          <ShiftFromBottom20>
            <Pressable
              style={{flexDirection: 'row', justifyContent: 'center'}}
              onPress={() => navigation.navigate('AddSiblingDataScreen')}>
              <OuterIconRow>
                <OuterIconLeft>
                  <Icon name="ic_plus" size={20} color="#FFF" />
                </OuterIconLeft>
                <ButtonLinkText> {t('childSetupList.addSiblingBtn')}</ButtonLinkText>
              </OuterIconRow>
            </Pressable>
          </ShiftFromBottom20>

          <ButtonPrimary
            onPress={() => {
              childSetup();
            }}>
            <ButtonText>{t('childSetupList.continueBtnText')}</ButtonText>
          </ButtonPrimary>
        </ButtonRow>
      </OnboardingContainer>
    </>
  );
};

export default ChildSetupList;
