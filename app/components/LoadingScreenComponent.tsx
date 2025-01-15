import { bebboLogoShape } from '../instance';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VectorImage from 'react-native-vector-image';
import { FlexDirCol } from './shared/FlexBoxStyle';
const flavor = process.env.FLAVOR || 'bebbo';
const BebboLogoShapeNew = require(`../instance/${flavor}/assets/images/logo/bebbo_logo_shape1.svg`)
import { LoadingContainer, LoadingText, MainView, PartnerLogo, SponsorLogo, StaticLogo, WrapView } from './shared/LoadingStyle';
import { useAppSelector } from '../../App';

const item = {
  image: BebboLogoShapeNew,
  colors: ['#2B2F84', '#1F50A0', '#00AEEF'],
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
  linearGradient: {
    flex: 1,
  },
  loadingText: { textAlign: 'center' },
  mainView: {
    alignContent: 'center', height: 60,
    marginTop: 15,
    width: 180,
  },
  outerView: {
    alignItems: 'center',
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 45,
  },
  partnerLogo: {
    flex: 1,
    resizeMode: 'contain'
  },
  partnerLogoView: {
    alignContent: 'center', height: 60,
    marginTop: 20,
    resizeMode: 'contain',
    width: 180
  },
  sponsorLogo: {
    flex: 1,
    resizeMode: 'contain'
  },
  vectorImageView: { marginBottom: 15 },
  logoImage: {
    width: 200,  // Desired width
    height: 200, // Desired height
    resizeMode: 'contain'
  }
});
const LoadingScreenComponent = (props: any): any => {
  const { t } = useTranslation();
  const sponsors = useAppSelector(
    (state: any) => state.selectedCountry.sponsors,
  );
  return (
    <LoadingContainer>
      <MainView>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={item.colors}
          style={styles.linearGradient}>
          <View
            style={styles.outerView}>
            <FlexDirCol>
              <View style={styles.vectorImageView}>
                {item.image && <VectorImage style={styles.logoImage} source={item.image} />}
              </View>
              <PartnerLogo
                style={styles.partnerLogoView}
                source={sponsors?.country_national_partner?.url != '' ? { uri: sponsors?.country_national_partner?.url } : require('')}
              />
              <SponsorLogo
                style={styles.partnerLogoView}
                source={sponsors?.country_sponsor_logo?.url != '' ? { uri: sponsors?.country_sponsor_logo?.url } : require('')}
              />
              <WrapView>
                {sponsors?.unicef_logo?.url && <StaticLogo
                  source={

                    sponsors?.unicef_logo?.url != '' ? { uri: sponsors.unicef_logo?.url } : require('')}
                />}
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