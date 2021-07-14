import styled from 'styled-components/native';
const Image = styled.View`
`;

export const ImageFull = styled.View`
  width: 100%;
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};
`;
export const ImageIcon = styled.Image`
  width: 40px;
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
  height:40px
`;
export default Image;
