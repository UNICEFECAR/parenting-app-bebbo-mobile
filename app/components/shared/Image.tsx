import styled from 'styled-components/native';
const Image = styled.View`
`;
export const DefaultImage = styled.Image`
`;
export const ImageFull = styled.View`
  width: 100%;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
`;
export const ImageIcon = styled.Image`
  width: 40px;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
  height:40px
`;
export default Image;
