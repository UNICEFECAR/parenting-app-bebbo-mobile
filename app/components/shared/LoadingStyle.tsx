import styled from 'styled-components/native';
const LoadingStyle = styled.View`

`;

export const LoadingContainer = styled.View`
  width: 100%;
  flex: 1;
`;
export const MainView = styled.View`
  justify-content: center;
  align-content: center;
  flex: 1;
`;
export const WrapView = styled.View`
  justify-content: center;
  align-content: center;
  margin-top: 30px;
  
`;
export const PartnerLogo = styled.Image`
flex:1
 /* align-items: center;
  resize-mode: contain; */
`;
export const SponsorLogo = styled.Image`
flex:1;

`;
export const StaticLogo = styled.Image`
  width: 115px;
  height: 60px;
 /* margin-top:20px;*/
 
`;
export const LoadingText = styled.Text`
  color: #fff;
  font-size: 25px;
  font-weight: bold;
`;

export default LoadingStyle;
