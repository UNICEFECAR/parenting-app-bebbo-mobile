
import styled from 'styled-components/native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '@assets/iconConfig/config.json';

 
 
 const Icon = createIconSetFromFontello(fontelloConfig);

export const OuterIconRow = styled.View`
flex-direction:row;


`

export const OuterIconLeft = styled.View`
margin-right:8px;
`

export const OuterIconRight = styled.View`
margin-left:8px;
`

export const TickView = styled.View`
background-color: ${props => props.theme.colors.SECONDARY_TEXTCOLOR};
padding:4px;
border-radius:100;
`


export default Icon;