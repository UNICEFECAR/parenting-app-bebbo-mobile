
import styled from 'styled-components/native';
const OnboardingContainer = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${(props):any => props.theme.colors.PRIMARY_COLOR};
  padding: 0 25px;
`;

export const OnboardingconfirmationHead = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  align-content:center;
  background-color: ${(props):any => props.theme.colors.PRIMARY_COLOR};
  padding:0 10px;
  text-align:center;
`;

export const OnboardingshiftHead = styled.View`
margin-top:40px;
margin-bottom:20px;
padding: 0 28px;
`

export const OnboardingContent = styled.View`
flex:1;

`
export const LocalizationContainer = styled.View`
flex:1;
`

export const LocalizationRow = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  align-items: stretch;
  min-height:52px;  
  margin-top:0px;
  margin-bottom: 30px;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
`;

export const LocalizationCol = styled.View`
flex:1;
flex-direction: row;
align-items:center;
border-bottom-width:1px;
border-color: rgba(0,0,0,.15);
padding:4px 15px 0px;
`

export const LocalizationAction = styled.View`
flex:1;
flex-direction: row;
align-items:center;
align-content:center;
justify-content:center;
`


export const LocalizationcontentHead = styled.View`
flex:1;
align-items:flex-start;
`
export const LocalizationcontentResult = styled.View`
flex:2;
align-items:flex-start;
`


export default OnboardingContainer;


