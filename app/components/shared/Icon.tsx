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
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
`;
export const TickView3 = styled.View`
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  padding: 4px;
  margin-left:5px;
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
`;
export const TickView1 = styled.View`
  padding: 1px 10px;
  margin:0 5px;
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
`;
export const TickView2 = styled.View`
  background-color: ${(props) => props.theme.colors.SECONDARY_COLOR};
  padding: 4px;
  margin-left:5px;
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
`;
export const IconViewAlert = styled(TickView)`
  background-color: #FF0A0A;
  padding:0;
  
`;
export const IconViewSuccess = styled(TickView)`
  background-color: #009B00;
  padding:4px
`;
export const IconViewReminder = styled(TickView)`
  background-color: ${(props) => props.theme.colors.CHILDDEVELOPMENT_COLOR};
  padding:0px
`;

export const IconBox = styled.View`
  width:48px;
  height:48px;
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
  margin-right:15px;
  justify-content:center;
  align-items:center;
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
border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
background-color:#009B00;
justify-content:center;

`;

export const IconAreaPress = styled.Pressable`
padding:5px 8px;
`;

export const IconViewBorder = styled.View`
border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
border-width:1px;
border-color:#000;
width:24px;
height:24px;
`;
export const IconClearBox = styled(OuterIconDone)`

`;
export const IconClearPress = styled.Pressable`
background-color:${(props) => props.theme.colors.PRIMARY_TEXTCOLOR};
opacity:0.6;
border:0px;
border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
width:22px;
height:22px;
justify-content:center;
align-items:center;
`;


export const IconViewBg = styled(IconViewBorder)`
background-color: ${(props) => props.theme.colors.CHILDDEVELOPMENT_COLOR};
border-width:0px;

`;


export default Icon;
