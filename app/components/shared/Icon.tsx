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

export default Icon;
