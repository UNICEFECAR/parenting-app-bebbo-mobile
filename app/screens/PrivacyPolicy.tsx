import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ChildAddTop } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1w, ShiftFromTop5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import { addSpaceToHtml } from '../services/Utils';
type PrivacyPolicyNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;
type Props = {
  navigation: PrivacyPolicyNavigationProp;
};
const PrivacyPolicy = ({navigation}: Props) => {
  const {t} = useTranslation();
  const privacydata = useAppSelector(
    (state: any) => state.utilsData.privacypolicy.body,
  );
  useFocusEffect(
    React.useCallback(() => {
      // Alert.alert("focuseffect--",JSON.stringify(countryId));
      const backAction = () => {
        // if (userIsOnboarded == true) {
          navigation.goBack()
        // }else {
        //   navigation.goBack()
        // }
        return true;
      };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    navigation.addListener('gestureEnd', backAction);

    return () => {
      navigation.removeListener('gestureEnd', backAction);
      backHandler.remove()
    };
  }, []),
  );
  const body =
  "<div><img width=\"1200\" height=\"675\" alt=\"Bebbo logotype \" data-entity-type=\"file\" data-entity-uuid=\"6e601f8a-9a87-47a3-b938-28388049b21f\" src=\"https://www.bebbo.app/sites/default/files/inline-images/Bebbo%20logotype%20.jpg\" class=\"align-center\" /></div><p>​This Privacy Policy applies to Bebbo - Your Parenting Companion application. The Bebbo app has been designed to provide information and guidance to parents of young children, ages 0-6. This Privacy Policy describes how the app collects, uses and stores your data and how your data will be protected.</p><p>In this policy, “personal data” means any information that lets us identify you, your child or the device you use when you access and interact with Bebbo.</p><p>Access to the Bebbo app is not intended for children and youth under 18.</p><p>Please read our Privacy Policy carefully before using the app. By accessing the Bebbo app and using it, you agree with the provisions of this Privacy Policy.</p><p>The terms “you,” “your”, “yours” and “user” refer to you as the individual accessing or using the Bebbo app.</p><p><strong>What is not covered by the privacy policy?</strong></p><p>The Bebbo app may contain links to other sites or services not covered by this Privacy Policy. This may include downloaded articles with links to an external source.</p><p>This Privacy Policy applies only to the processing of your data by UNICEF and its authorized national partners in connection with the Bebbo app. The collection, use and processing of your data by any third party website or service which the app or its content links to is governed by the third party’s privacy policy.</p><p>It is strongly recommended that you review and are comfortable with third parties’ Terms of Use and Privacy Policy before actively using their site.</p><p>The data are obtained from the various sources as described below:</p><p><strong>Anonymous data that is automatically collected during your use of the application</strong></p><p>Previously described so-called anonymous information is used to track the total number of users, the frequency of use of various features and content of the application, in order to improve the application. This data is used exclusively for analytics and to improve the services  to the user.</p><p><strong>Storage of information and data</strong></p><p>To provide you with content relevant to your child's age and gender, you need to enter your child's date of birth and gender. These functions allow you to monitor the growth and development of your child through the application, as well as the dates of vaccinations and health examinations.</p><p>The application does not collect any personal data that can identify a parent or child, and does not store it automatically on any external server. All data entered into the application are stored only on the user's personal device - the phone. Users are fully responsible for all data stored on their devices, in accordance with the respective privacy policies of Google and Apple (depending on which operating system is on the user's smartphone).</p><p>You can learn more about Google's and Apple's privacy policies by going to:</p><p>https://policies.google.com/privacy</p><p>https://www.apple.com/legal/privacy</p><p>The application consists of unencrypted databases located on the user's personal smart device. The database contains general information about the application, such as data about games, advice, frequently asked questions and all the information about the child that the parent entered into the application, such as selected events, vaccinations, etc. The database does not contain any personally identifiable information.</p><p><strong>Backing up data</strong></p><p>The parent can choose to back up all the data (e.g. in case the user wants to load all the data on their other smart device). In this case, only on the basis of an action that only the user can run manually, all text data will be backed up and stored on the user's personal Google Drive or device file storage.</p><p>User data which will be stored in Backup file will be encrypted for the security reason.</p><p><strong>How does UNICEF use the information collected in the application?</strong></p><p>The user can be completely sure that UNICEF does not capture, sell, trade or in any other way transmit information about the personal identity of the user.</p><p><strong>Application analytics and improvement</strong></p><p>UNICEF and its associates may use information collected in the application, such as user activities in the application or user responses through surveys contained in the application. These surveys may or may not be completed by the user. They are used to monitor and analyze the use of the application and to improve and enhance the application.</p><p><strong>Consolidated data</strong></p><p>UNICEF can group and aggregate anonymous data that is processed to improve the application, as well as data collected in the application for statistical analysis. UNICEF may use the aggregated data in this way for other legitimate purposes, such as promotional or research activities. The results obtained in this way can be shared with third parties, such as our partners, supporters, educators and researchers through conferences, journals and other publications.</p><p><strong>Legal aspect</strong></p><p>The publisher of the application does not collect or process personal data, i.e. data that can identify the parent who uses the application from their device or the child whose data was entered.</p><p><strong>Third party websites, applications and services</strong></p><p>The application may contain links to other sites or services not covered by this Privacy Policy. This refers to posting articles that may contain a link to an external source that is not under UNICEF control.</p><p>This Privacy Policy applies only to the processing of your data by UNICEF in connection with this application. UNICEF is not responsible for the security and privacy policies of any third party, website or service to which the application links with the link provided. Please note that the terms of this Privacy Policy do not apply to external sites or external content, or to any collection of data related to external sites.</p><p><strong>Contact us</strong></p><p>If you have questions or concerns regarding the privacy and use of personal data in the application, feel free to contact us at admin@bebbo.app</p><p><strong>Your consent</strong></p><p>By using the Bebbo application, you agree to its online privacy policy.</p><p>Last updated: October 13, 2021</p>";
  const contentWidth = useWindowDimensions().width;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
    <View style={{flex:1,backgroundColor:headerColor}}>
    <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <OnboardingContainer>
        <OnboardingHeading>
          <ChildAddTop>
            <Heading1w>{t('tNcprivacyPolicyTitle')}</Heading1w>
            <ShiftFromTop5>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="ic_close" size={20} color="#FFF" />
              </Pressable>
            </ShiftFromTop5>
          </ChildAddTop>
        </OnboardingHeading>
        <ScrollView contentContainerStyle={{padding: 0}}>
          { privacydata != "" ? 
            <HTML
              source={{html: addSpaceToHtml(privacydata)}}
              baseFontStyle={{fontSize: 16, color: '#ffffff'}}
              ignoredStyles={['color', 'font-size', 'font-family']}
              tagsStyles={{
                p: { marginBottom: 15, marginTop: 0,textAlign:'left' },
                h1: { marginBottom: 0, marginTop: 10,textAlign:'left'},
                h2: { marginBottom: 15, marginTop: 0,textAlign:'left'},
                h3: { marginBottom: 15, marginTop: 0,textAlign:'left' },
                h4: { marginBottom: 15, marginTop: 0 ,textAlign:'left'},
                h5: { marginBottom: 15, marginTop: 0 ,textAlign:'left'},
                h6: { marginBottom: 15, marginTop: 0 ,textAlign:'left'},
                span: { marginBottom: 15, marginTop: 0 ,textAlign:'left'},
                br: { height: 0 },
                img: {maxWidth:Dimensions.get('window').width-50},
              }}
            />
            : null 
          }
        </ScrollView>
      </OnboardingContainer>
      </View>
    </>
  );
};

export default PrivacyPolicy;
