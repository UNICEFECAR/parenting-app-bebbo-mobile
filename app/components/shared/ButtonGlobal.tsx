
import { Button } from 'react-native';
import styled from 'styled-components/native';
export const ButtonPrimary = styled.Pressable`

background: ${props => props.theme.colors.SECONDARY_COLOR};
color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
padding: 14px 15px;
width:100%;
font-size:16px;
font-family: 'roboto-bold';
line-height:20px;
border-radius: 4px;
`
export const ButtonContainer = styled.View`
flex:1 0 0;

`

export const ButtonText = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.PRIMARY_TEXTCOLOR};
  font-family: 'roboto-bold';
  font-size:16px;
`;
export const ButtonTextsm = styled(ButtonText)`

  font-size:16px;
`;








