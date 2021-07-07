
import styled from 'styled-components/native';

/*Button Pressable */
export const ButtonPrimary = styled.Pressable`
background: ${props => props.disabled ? '#cccccc' : props.theme.colors.SECONDARY_COLOR};
opacity: ${props => props.disabled ? 0.5 : 1};
color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
padding: 14px 18px;
width:100%;
font-family: 'roboto-bold';
border-radius: 4px;
height:50px;
`;

export const ButtonPrimaryMd = styled(ButtonPrimary)`
padding: 10px 4px;
height:40px;
`;

/*Button Text */
export const ButtonText = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  font-size:16px;
  line-height:20px;
  
`;

export const ButtonTextLine = styled(ButtonText)`
  text-decoration:underline;
`;
export const ButtonTextSmLine = styled(ButtonTextLine)`
  font-size:12px;
`;

export const ButtonTextSm = styled(ButtonText)`
  font-size:12px;
`;

export const ButtonTextMd = styled(ButtonText)`
  font-size:14px;
`;

export const ButtonTextMdLine = styled(ButtonTextLine)`
  font-size:14px;
  `;
export const ButtonTextMdLineL = styled(ButtonTextMdLine)`
  text-align:left;
`;

export const ButtonTextSmLineL = styled(ButtonTextSmLine)`
  text-align:left;
`;

export const ButtonTextLinew = styled(ButtonTextLine)`
color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const ButtonLinkText = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  font-size:16px;
  line-height:20px;
  text-decoration:underline;
  
`;

export const ButtonTextLg = styled(ButtonText)`
  font-size:16px;
`;

export const ButtonRow = styled.View`
  padding:15px 0;
  margin-top:10px;
  width:100%;
justify-content: center;
`;

export const ButtonLinkRow = styled(ButtonRow)`
  
  flex-direction:row;
  margin:0;
  padding: 10px;
 margin-bottom:15px;
`;

export const ButtonCol = styled.View`
 
  align-items:center;
  justify-content:flex-start;
  flex:1;
  padding: 0 15px;
  flex-direction:column;
`;

export const ButtonContainer = styled.View`
padding:10px 15px;

`;
export const ButtonContainerAuto = styled.View`
padding:10px 15px;
width:auto;
margin:0 auto;

text-align:center;
align-items:center;
`;
export const ButtonSpacing = styled.View`
padding:5px 15px;
`;



export const ButtonLinkPress = styled.Pressable`
flex-direction:row;
align-items:center;
justify-content:center;

`

export const ButtonTertiary = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;
export const ButtonTertiaryMd = styled(ButtonPrimaryMd)`
  background-color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
`;


/*Button Colors as per features*/

export const ButtonActivity = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.ACTIVITIES_COLOR};
`;
export const ButtonArticles = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.ARTICLES_COLOR};
`;
export const ButtonVaccination = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.VACCINATION_COLOR};
`;
export const ButtonDevelopment = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
export const ButtonGrowth = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.CHILDGROWTH_COLOR};
`;
export const ButtonHealth = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.HEALTHCHECKUP_COLOR};
`;
export const ButtonSecondary = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.SECONDARY_COLOR};
`;
export const ButtonSecondaryTint = styled(ButtonPrimary)`
  background-color: ${props => props.theme.colors.SECONDARY_TINTCOLOR};
`;

export const ButtonDevelopmentMd = styled(ButtonPrimaryMd)`
  background-color: ${props => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
export const ButtonContainerTwo = styled.View`
flex:1;max-height:80px;flex-direction:row;padding:0 10px;align-items:center;
`;
export const ButtonColTwo = styled.View`
flex-direction:row;width:50%;padding:0px 5px;
`;


export const ButtonModal = styled(ButtonPrimary)`
width:auto; padding:14px 30px;margin: 15px auto 0;
`;
