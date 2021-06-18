import styled from 'styled-components/native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '@assets/iconConfig/config.json';
 
 
 const Icon = createIconSetFromFontello(fontelloConfig);`
 
 
 `

export const OuterIconRow = styled.View`
flex-direction:row;


`

export const OuterIconLeft = styled.View`
margin-right:10px;
`

export const OuterIconRight = styled.View`
margin-left:10px;
`


export default Icon;