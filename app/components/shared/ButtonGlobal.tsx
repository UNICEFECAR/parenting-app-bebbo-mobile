
import styled from 'styled-components/native';

/*Button Pressable */
export const ButtonPrimary = styled.Pressable`
background: ${props => props.disabled ? '#cccccc' : props.theme.colors.SECONDARY_COLOR};
opacity: ${props => props.disabled ? 0.5 : 1};
color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
padding: 14px 15px;
width:100%;
font-family: 'roboto-bold';
border-radius: 4px;
height:50px;
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

export const ButtonTextMdLine = styled(ButtonTextLine)`
  font-size:14px;
  `;
export const ButtonTextMdLineL = styled(ButtonTextMdLine)`
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

export const ButtonTextsm = styled(ButtonText)`
  font-size:16px;
`;

export const ButtonRow = styled.View`
  padding:15px 0;
  margin-top:10px;
  width:100%;

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
flex:1 0 0;
`;

export const ButtonSpacing = styled.View`
padding:5px 15px;
`;



export const ButtonLinkPress = styled.Pressable`
flex-direction:row;
align-items:center;

`


