
import { Button } from 'react-native';
import styled from 'styled-components/native';
export const ButtonviewNext = styled.Text`
width:50px;height:50px;
marginTop:30;
marginStart:300;
marginEnd:10;
marginBottom:10;
border-radius:100;
text-align:center;
flex-direction:row;

align-content:center;
background-color: ${props => props.theme.colors.SECONDARY_COLOR};
`;


export const ButtonviewPrevious = styled(ButtonviewNext)`

background-color: ${props => props.theme.colors.SECONDARY_TINTCOLOR};
justify-content:flex-start;


`;

export const ButtonviewClick = styled.Pressable`

margin-top:10px;
flex-direction:column;
justify-content:center;
height:50px;
align-content:center

`








