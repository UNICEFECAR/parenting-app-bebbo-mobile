import { buildFor, buildForBebbo } from '@assets/translations/appOfflineData/apiConstants';
import { bebbo_logo_shape } from '@dynamicImportsClass/dynamicImports';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VectorImage from 'react-native-vector-image';
import { FlexDirCol } from './shared/FlexBoxStyle';
import { LoadingContainer, LoadingText, MainView, PartnerLogo, SponsorLogo, StaticLogo, WrapView } from './shared/LoadingStyle';

const item = {
  image:bebbo_logo_shape,
  colors: ['#2B2F84', '#1F50A0',  '#00AEEF'],
};

const LoadingScreenComponent = (props: any) => {
  const {t} = useTranslation();
  const sponsors = props.sponsors;
  const prevPage = props.prevPage;
  return (
    <LoadingContainer>
      <MainView>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={item.colors}
          style={styles.linearGradient}>
          <View
            style={styles.outerView}>
              <FlexDirCol>
                    <View style={styles.vectorImageView}>
                      <VectorImage source={item.image} />
                    </View>
                    <View style={styles.partnerLogoView}>
                      {prevPage == 'CountryLangChange' || prevPage == 'CountryLanguageSelection' ?
                            null :
                          <PartnerLogo 
                          style={styles.partnerLogo}
                            source={
                              sponsors?.country_national_partner!=null
                                ? {
                                    uri:sponsors?.country_national_partner
                                  }
                                : require('')
                            }
                          />
                        }
                    </View>
                    <View style={styles.mainView}>
                        {prevPage == 'CountryLangChange' || prevPage == 'CountryLanguageSelection' ?
                            null :
                          <SponsorLogo
                          style={styles.sponsorLogo}
                            source={
                              sponsors?.country_sponsor_logo!=null
                                ? {
                                    uri:sponsors?.country_sponsor_logo
                                  }
                                : require('')
                            }
                          />
                        }
                    </View>
                    <WrapView>
                      <StaticLogo
                        source={
                            (prevPage == 'CountryLangChange' || prevPage == 'CountryLanguageSelection') && buildFor == buildForBebbo
                            ? require('')
                            : require('../assets/loading/unicef_logo.png')}
                      />
                    </WrapView>
            </FlexDirCol>
          </View>

          <View
            style={styles.innerView}>
            <Text>
              <ActivityIndicator size="large" color="#ffffff" />
            </Text>
            <Text style={styles.loadingText}>
              <LoadingText>{t('loadingText')}</LoadingText>
            </Text>
          </View>
        </LinearGradient>
      </MainView>
    </LoadingContainer>
  );
};
export default LoadingScreenComponent;
const styles = StyleSheet.create({
 outerView:{
  flex: 4,
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  marginTop:45,
},
innerView:
  {
    marginBottom: 15,
    marginTop:25,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-end',
  },
  mainView:{
    width:180,height:60,
    alignContent:'center',
    marginTop:25,
  },
  sponsorLogo:{
    flex: 1,
    resizeMode: 'contain'
  },
  linearGradient:{
    flex: 1,
  },
  vectorImageView:{marginBottom:15},
  partnerLogoView:{
    width:180,height:60,
    alignContent:'center',
    marginTop:20  
  },
  partnerLogo:{
    flex: 1,
    resizeMode: 'contain'
  },
  loadingText:{textAlign: 'center'}
});