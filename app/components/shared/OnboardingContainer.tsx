
import styled from 'styled-components/native';
const OnboardingContainer = styled.View`
  width: 100%;
  flex:1;
  flex-direction: column;
  background-color: ${(props: any): any => props.theme?.colors?.PRIMARY_REDESIGN_COLOR};
  padding: 0 25px;
`;

export const OnboardingConfirmationHead = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-items:center;
  align-content:center;
  background-color: ${(props: any): any => props.theme?.colors?.PRIMARY_REDESIGN_COLOR};
  padding:0 10px;
  margin-top: 15px;
  text-align:center;
`;
export const OnboardingTermsHead = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  align-content:center;
  background-color: ${(props: any): any => props.theme?.colors?.PRIMARY_REDESIGN_COLOR};
  padding:0 10px;
  text-align:center;
`;

export const OnboardingShiftHead = styled.View`
margin-top:22px;
margin-bottom:20px;
padding: 0 28px;
`

export const OnboardingContent = styled.View`
flex:1;

`
export const LocalizationContainer = styled.View`
flex:1.3;
align-items:stretch;
justify-content: center;
`

export const LocalizationRow = styled.View`
flex:0.7;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  align-items: stretch;
  min-height: 52px;
  shadow-color: #414363;
  shadow-offset: 0px 7px; /* Shadow only at the bottom */
  shadow-opacity: 0.19;
  shadow-radius: 7px;
  margin-top:20px;
  elevation: 12;
  border-radius: 4px;
`;

export const LocalizationCol = styled.Pressable`
flex:3;
flex-direction: row;
align-items:center;
border-bottom-width:1px;
border-color: rgba(0,0,0,.15);
padding:4px 15px 0px;
`

export const LocalizationWithoutBorderCol = styled.Pressable`
flex:1.4;
flex-direction: row;
align-items:center;
margin-top:15px;
padding:4px 15px 0px;
`

export const LocalizationAction = styled.View`
flex:1;
flex-direction: row;
align-items:center;
align-content:center;
justify-content:center;
`


export const LocalizationContentHead = styled.View`
flex:1;
align-items:flex-start;
`
export const LocalizationContentResult = styled.View`
flex:2;
align-items:flex-start;
`


export default OnboardingContainer;


