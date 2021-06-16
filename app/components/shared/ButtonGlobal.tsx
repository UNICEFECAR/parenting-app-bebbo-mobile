
import styled from 'styled-components/native';

/*Button Pressable */
export const ButtonPrimary = styled.Pressable`
background: ${props => props.theme.colors.SECONDARY_COLOR};
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

export const ButtonLinkText = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  font-size:16px;
  line-height:20px;
  margin-bottom:15px;
`;

export const ButtonTextsm = styled(ButtonText)`
  font-size:16px;
`;

export const ButtonRow = styled.View`
  padding:15px 0;
  margin-top:10px;
  width:100%;
`;

export const ButtonContainer = styled.View`
flex:1 0 0;
`;



