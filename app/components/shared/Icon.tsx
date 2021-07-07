import fontelloConfig from '@assets/iconConfig/config.json';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import styled from 'styled-components/native';

const Icon = createIconSetFromFontello(fontelloConfig);

export const OuterIconRow = styled.View`
  flex-direction: row;
`;

export const OuterIconLeft = styled.View`
  margin-right: 8px;
`;
export const OuterIconLeft15 = styled.View`
  margin-right: 15px;
`;

export const OuterIconRight = styled.View`
  margin-left: 8px;
`;
export const OuterIconRight15 = styled.View`
  margin-left: 15px;
`;
export const TickView = styled.View`
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  padding: 4px;
  border-radius: 100px;
`;

export const IconBox = styled.View`
  padding: 15px;
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:100px;
  margin-right:15px;
`;

export const OuterIconSpace = styled.View`
 padding:8px
`;

export const OuterIconDone = styled.View`
align-items:center;
line-height:20px;
flex-direction:row;
width:20px;
height:20px;
border-radius:100px;
background-color:#009B00;
justify-content:center;

`;



export default Icon;
