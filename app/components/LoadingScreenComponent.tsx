import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VectorImage from 'react-native-vector-image';
import styled from 'styled-components/native';
import { FlexDirCol } from './shared/FlexBoxStyle';
import { LoadingContainer, LoadingText, MainView, PartnerLogo, SponsorLogo, StaticLogo, WrapView } from './shared/LoadingStyle';



const item = {
  image: require('@assets/svg/bebbo_logo_shape.svg'),
  colors: ['#2B2F84', '#1F50A0',  '#00AEEF'],
};

const LoadingScreenComponent = (props: any) => {
  const {t} = useTranslation();
  const sponsors = props.sponsors;
  console.log(sponsors, '..11sponsors..');
  return (
    <LoadingContainer>
      <MainView>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={item.colors}
          style={{
            flex: 1,
          }}>
          <View
            style={{
              flex: 4,
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              marginTop:45,
            }}>
              <FlexDirCol>
            <View>
              <VectorImage source={item.image} />
            </View>
            <View style={{
                  width:240,height:80,
                  //backgroundColor:'#000',
                  alignContent:'center',
                  marginTop:20,
                }}>
              <PartnerLogo 
              style={{
                flex: 1,
                resizeMode: 'contain'
              }}
                source={
                  sponsors?.country_national_partner!=null
                    ? {
                        uri:sponsors?.country_national_partner
                      }
                    : require('')
                }
              />
            </View>
            <View style={{
                  width:180,height:60,
                  // backgroundColor:'#000',
                  alignContent:'center',
                  marginTop:25,
                }}>
              <SponsorLogo
              style={{
                flex: 1,
                resizeMode: 'contain'
              }}
                source={
                  sponsors?.country_sponsor_logo!=null
                    ? {
                        uri:sponsors?.country_sponsor_logo
                      }
                    : require('')
                }
              />
            </View>
            <WrapView>
              {/* <Text style= {{textAlign: 'center', color:'#fff', marginBottom:15}}>Supports</Text> */}
              <StaticLogo
                source={require('../assets/loading/unicef_logo.png')}
              />
            </WrapView>
            </FlexDirCol>
          </View>

          <View
            style={{
              marginBottom: 15,
              marginTop:25,
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'flex-end',
            }}>
            <Text>
              <ActivityIndicator size="large" color="#ffffff" />
            </Text>
            <Text style={{textAlign: 'center'}}>
              <LoadingText>{t('loadingText')}</LoadingText>
            </Text>
          </View>
        </LinearGradient>
      </MainView>
    </LoadingContainer>
  );
};
export default LoadingScreenComponent;