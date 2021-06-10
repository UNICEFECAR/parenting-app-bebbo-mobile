import * as React from 'react'
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
import RNFS from 'react-native-fs';
import LinearGradient from 'react-native-linear-gradient';
import VectorImage from 'react-native-vector-image';
const Container = styled.View`
  width: 100%;
  flex:1;
`;
const MainView = styled.View`
justify-content:center;
align-content:center;
flex:1;
`;
const WrapView = styled.View`
justify-content:center;
align-content:center;
margin-top:20px;
`;

const PartnerLogo = styled.Image`
width:200px;
height:80px;
margin-top:30px;
align-items:center;

`;
const SponsorLogo = styled.Image`
width:50px;
height:50px;
margin-top:30px;
`;
const StaticLogo = styled.Image`
width:50px;
height:50px;

`;
const LoadingText = styled.Text`
color: #fff;
 font-size: 25px;
  font-weight: bold;
`;
const styles = StyleSheet.create({
  imagetag: {
    // width:120,
    // height:120,
    // marginTop:10,
    position:'absolute',
    top:80
  },
});

const item= {
  image: require('../assets/svg/bebbo_logo_shape.svg'),
  colors: ['#2B2F84', '#00AEEF', '#B3E7FA'],
}

const LoadingScreenComponent = (props:any) => {
  //console.log(,"..sponsors..");
  const sponsors=props.sponsors;
  // console.log(sponsors,"..11sponsors..");
  return (
    <Container>
      <MainView>
    {/* <ImageBackground source={require('../assets/walkthrough/01.png')}> */}
    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={item.colors} style={{flex:1,justifyContent: 'center',
alignItems:'center'}}>
    {/* <Child> */}
      
            <VectorImage source={item.image} style={styles.imagetag} />
            <PartnerLogo
              source={sponsors.length>0 ? {uri:"file://"+sponsors[0].destFolder+"/"+sponsors[0].destFilename}:require('../assets/loading/partner_albania.jpeg')}
   
            // source={{ uri:sponsors.length>0 ? "file://"+sponsors[0].destFolder+"/"+sponsors[0].destFilename: 'https://reactnative.dev/img/tiny_logo.png'}}
            />
           {/* </Child>
       
          <InnerView> */}
            <SponsorLogo
            source={sponsors.length>0 ? {uri:"file://"+sponsors[1].destFolder+"/"+sponsors[1].destFilename}:require('../assets/loading/sponser_albania.png')}
            // source={{ uri:sponsors.length>0 ? "file://"+sponsors[1].destFolder+"/"+sponsors[1].destFilename:'https://reactnative.dev/img/tiny_logo.png' }}
            />
            <WrapView> 
            <Text>Supports</Text>
            <StaticLogo
            source={require('../assets/loading/unicef_logo.png')}
              // source={{
              //   uri:sponsors.length>0 ? "file://"+sponsors[2].destFolder+"/"+sponsors[2].destFilename:'https://reactnative.dev/img/tiny_logo.png' ,
              // }}
            />
            </WrapView>
            <ActivityIndicator size="large" color="#ffffff" />
            <LoadingText>Loading data and getting content..</LoadingText>
        
      

    </LinearGradient>

        
      </MainView>
    </Container>
  );
};
export default LoadingScreenComponent;