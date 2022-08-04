import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ChildAddTop } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import iframe from '@native-html/iframe-plugin';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1w, ShiftFromTop5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, Pressable, ScrollView, View } from 'react-native';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
import RenderImage from '../services/RenderImage';
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
  const toggleSwitchVal = useAppSelector((state: any) =>
  state.bandWidthData?.lowbandWidth
    ? state.bandWidthData.lowbandWidth
    : false,
);
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
          navigation.goBack()
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
                iframe:{maxWidth:'100%',height:200}
              }}
              renderers={{
                iframe,
                img:(attribs:any) => {
                  const imagePath:any = attribs.src;
                  console.log(imagePath,"..imagePath");
                  if(imagePath!="" && imagePath!=null && imagePath!=undefined){
                  let itemnew:any={
                    cover_image:{
                      url:imagePath
                    }
                  };
                    return (
                      <RenderImage key={imagePath+"/"+Math.random()} uri={imagePath} itemnew={itemnew} toggleSwitchVal={toggleSwitchVal} />
             
                   );
                  }
                },
              }}
              WebView={WebView}
              renderersProps={{
                iframe: { webViewProps: { allowsFullscreenVideo: true } }
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
