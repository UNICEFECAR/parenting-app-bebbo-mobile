import { buildFor, buildForBebbo } from '@assets/translations/appOfflineData/apiConstants';
import { bebboLogoShape } from '@dynamicImportsClass/dynamicImports';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VectorImage from 'react-native-vector-image';
import { FlexDirCol } from './shared/FlexBoxStyle';
import { LoadingContainer, LoadingText, MainView, PartnerLogo, SponsorLogo, StaticLogo, WrapView } from './shared/LoadingStyle';

const item = {
  image:bebboLogoShape,
  colors: ['#2B2F84', '#1F50A0',  '#00AEEF'],
};
const styles = StyleSheet.create({
  innerView:
   {
     alignContent: 'center',
     alignItems: 'center',
     flex: 1,
     flexDirection: 'column',
     marginBottom: 15,
   },
 linearGradient:{
     flex: 1,
   },
   loadingText:{textAlign: 'center'},
   mainView:{
     alignContent:'center',height:60,
     marginTop:15,
     width:180,
   },
   outerView:{
   alignItems: 'center',
   flex: 4,
   flexDirection: 'column',
   justifyContent: 'flex-start',
   marginTop:45,
 },
   partnerLogo:{
     flex: 1,
     resizeMode: 'contain'
   },
   partnerLogoView:{
     alignContent:'center',height:60,
     marginTop:20,
     width:180  
   },
   sponsorLogo:{
     flex: 1,
     resizeMode: 'contain'
   },
   vectorImageView:{marginBottom:15}
 });
const LoadingScreenComponent = (props: any): any => {
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
                      
                          <PartnerLogo 
                          style={styles.partnerLogo}
                            source={
                              sponsors?.country_national_partner!=null
                                ? {
                                    uri:sponsors?.country_national_partner?.url
                                  }
                                : require('')
                            }
                          />
                        
                    </View>
                    <View style={styles.mainView}>
                        
                          <SponsorLogo
                          style={styles.sponsorLogo}
                            source={
                              sponsors?.country_sponsor_logo!=null
                                ? {
                                    uri:sponsors?.country_sponsor_logo?.url
                                  }
                                : require('')
                            }
                          />
                        
                    </View>
                    <WrapView>
                      <StaticLogo
                        source={
                            
                           require('../assets/loading/unicef_logo.png')}
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
