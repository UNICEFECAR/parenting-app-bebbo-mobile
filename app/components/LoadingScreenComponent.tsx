import { buildFor, buildForBebbo } from '@assets/translations/appOfflineData/apiConstants';
import { bebboLogoShape, nmPartnerLogo, nmSponserLogo, albeniaPartnerLogo1, blSponserLogo, blParterLogo, kgPartnerLogo, mnSponserLogo, mnParterLogo, sbPartnerLogo, sbSponserLogo, skParterLogo, tjkParterLogo, uzSponserLogo, uzPartnerLogo } from '@dynamicImportsClass/dynamicImports';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VectorImage from 'react-native-vector-image';
import { FlexDirCol } from './shared/FlexBoxStyle';


import { LoadingContainer, LoadingText, MainView, PartnerLogo, SponsorLogo, StaticLogo, WrapView } from './shared/LoadingStyle';
import Image from './shared/Image';

const item = {
  image: bebboLogoShape,
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
  vectorImageView: { marginBottom: 15 }
});
const sponsersData = [
  {
    id: 6,
    sponserImage: null,
    partnerImage: albeniaPartnerLogo1
  },
  {
    id: 36,
    sponserImage: nmSponserLogo,
    partnerImage: nmPartnerLogo
  },
  {
    id: 106,
    sponserImage: blSponserLogo,
    partnerImage: blParterLogo
  },
  {
    id: 26,
    sponserImage: null,
    partnerImage: kgPartnerLogo
  },
  {
    id: 31,
    sponserImage: mnSponserLogo,
    partnerImage: mnParterLogo
  },
  {
    id: 41,
    sponserImage: sbSponserLogo,
    partnerImage: sbPartnerLogo
  },
  {
    id: 151,
    sponserImage: null,
    partnerImage: skParterLogo
  },
  {
    id: 46,
    sponserImage: null,
    partnerImage: tjkParterLogo
  },
  {
    id: 51,
    sponserImage: uzSponserLogo,
    partnerImage: uzPartnerLogo
  },
]
const LoadingScreenComponent = (props: any): any => {
  const { t } = useTranslation();
  const sponsors = props.sponsors;
  const [logoname, setLogoName] = React.useState('')
  const [countrySponsor, setCountrySponser] = React.useState<any>(null)
  const prevPage = props.prevPage;

  React.useEffect(() => {
    const countrySponsor1 = sponsersData.find(sponsor => sponsor.id === props.sponsors.id);
    setCountrySponser(countrySponsor1)
  }, [sponsersData, countrySponsor])
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
                <VectorImage source={item.image} />
              </View>
              <PartnerLogo
                style={styles.partnerLogoView}
                source={sponsors?.country_national_partner != null ? countrySponsor?.partnerImage : require('')}
              />
              <SponsorLogo
                style={styles.partnerLogoView}
                source={sponsors?.country_sponsor_logo != null ? countrySponsor?.sponserImage : require('')}
              />
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
