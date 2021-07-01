import styled from 'styled-components/native';
const Container = styled.View`
  width: 100%;
`;
export default Container;


export const MainContainer = styled.View`
  width: 100%;
  padding:10px 15px;
`;

export const BannerContainer = styled.View`
  border-radius:4px;
  padding:20px 15px;
  background-color:${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
`;
