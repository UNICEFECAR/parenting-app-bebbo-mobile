import * as React from 'react'
import { ActivityIndicator, Text, View } from 'react-native';
import styled from 'styled-components/native';

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
const HeartLogo = styled.Image`
width:120px;
height:120px;
margin-top:10px;
`;
const PartnerLogo = styled.Image`
width:100px;
height:70px;
margin-top:30px;
align-items:center;
`;
const SponsarLogo = styled.Image`
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
const ImageBackground =styled.ImageBackground
` 
flex: 1;
resize-mode: cover;
justify-content: center;
align-items:center;
`;
const image = {uri: "../assets/01.png" };

const LoadingScreenComponent = () => {
  return (
    <Container>
      <MainView>
     
    <ImageBackground source={require('../assets/walkthrough/01.png')}>
    {/* <Child> */}
            <HeartLogo
              source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
              }}
            />
            <PartnerLogo
              source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
              }}
            />
           {/* </Child>
       
          <InnerView> */}
            <SponsarLogo
              source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
              }}
            />
            <WrapView> 
            <Text>Supports</Text>
            <StaticLogo
              source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
              }}
            />
            </WrapView>
            <ActivityIndicator size="large" color="#ffffff" />
            <LoadingText>Loading data and getting content..</LoadingText>
        
      

    </ImageBackground>

        
      </MainView>
    </Container>
  );
};
export default LoadingScreenComponent;