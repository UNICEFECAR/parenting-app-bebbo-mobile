
import styled from 'styled-components/native';
 
/*Button Pressable */
export const ButtonPrimary = styled.Pressable`
background: ${(props):any => props.disabled ? props.theme.colors.SECONDARY_COLOR : props.theme.colors.SECONDARY_COLOR};
opacity: ${(props):any => props.disabled ? 0.5 : 1};
color: ${(props):any => props.theme.colors.PRIMARY_TEXTCOLOR};
padding: 5px 15px;
width:100%;
font-family: 'roboto-bold';
border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
min-height:50px;
height:auto;
justify-content:center;

`;

export const ButtonPrimaryMd = styled(ButtonPrimary)`
padding: 6px 4px;
height:auto;
min-height:40px;
`;

/*Button Text */
export const ButtonText = styled.Text`
  text-align: center;
  color: ${(props):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  font-size:16px;
  line-height:20px;
  
`;

export const ButtonTextLine = styled(ButtonText)`
  text-decoration:underline;
`;
export const ButtonTextSmLine = styled(ButtonTextLine)`
  font-size:12px;
  line-height:16px;
  
`;
export const ButtonTextSmLineW = styled(ButtonTextSmLine)`
color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const ButtonTextSm = styled(ButtonText)`
  font-size:12px;
`;

export const ButtonTextMd = styled(ButtonText)`
  font-size:14px;
  line-height:16px;
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

export const ButtonTextLinew = styled.Text`
color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
text-decoration:underline
text-decoration-color:${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const ButtonLinkText = styled.Text`
  text-align: center;
  color: ${(props):any => props.theme.colors.PRIMARY_TEXTCOLOR};
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
padding:7px 0
`
// only for chatbot call to action property start
export const ButtonLinkPressLeft = styled(ButtonLinkPress)`
  justify-content:flex-start;
  margin-bottom:10px;
`;
// only for chatbot call to action property end

export const ButtonTertiary = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;
export const ButtonTertiaryMd = styled(ButtonPrimaryMd)`
  background-color: ${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  padding-left:4px;
  padding-right:4px;
  height:auto;
  padding:4px;
  justify-content:center;
  
`;
export const ButtonDelPress = styled.Pressable`
  min-width:70px;
  margin-left:5px;
  min-height:32px;
  justify-content:flex-end;
  flex-direction:row;
  align-items:center;
  margin-right:-10px;
  padding-right:10px;
`;
export const ButtonEditPress = styled(ButtonDelPress)`
 
  
`;


/*Button Colors as per features*/

export const ButtonActivity = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.ACTIVITIES_COLOR};
`;
export const ButtonArticles = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.ARTICLES_COLOR};
`;
 
export const ButtonArticlesTint = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.ARTICLES_TINTCOLOR};
`;
export const ButtonVaccination = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.VACCINATION_COLOR};
`;
export const ButtonDevelopment = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
export const ButtonGrowth = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.CHILDGROWTH_COLOR};
`;
export const ButtonHealth = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.HEALTHCHECKUP_COLOR};
`;
export const ButtonSecondary = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.SECONDARY_COLOR};
`;
export const ButtonSecondaryTint = styled(ButtonPrimary)`
  background-color: ${(props):any => props.theme.colors.SECONDARY_TINTCOLOR};
`;

export const ButtonDevelopmentMd = styled(ButtonPrimaryMd)`
  background-color: ${(props):any => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
export const ButtonContainerTwo = styled.View`
flex:1;max-height:80px;flex-direction:row;padding:0 10px;align-items:center;
`;
export const ButtonContainerTwoP =styled(ButtonContainerTwo)`
padding:0;
`;
export const ButtonColTwo = styled.View`
flex-direction:row;width:50%;padding:0px 5px;
`;
export const ButtonColTwo4 = styled.View`
flex-direction:row;width:40%;padding:0px 5px;
`;
export const ButtonColTwo6 = styled.View`
flex-direction:row;width:60%;padding:0px 5px;
`;
export const ButtonModal = styled(ButtonPrimary)`
width:auto; padding:5px 25px;margin: 15px 20px 0;
min-width:150px;
`;
export const ModalViewCustom = styled.View`
padding-top:5px;padding-bottom:5px;
`;