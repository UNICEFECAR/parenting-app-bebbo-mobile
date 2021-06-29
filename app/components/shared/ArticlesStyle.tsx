import styled from 'styled-components/native';
const ArticlesStyle = styled.View`
  
`;
export default ArticlesStyle;


export const ArticleListContent = styled.View`
  width: 100%;
  padding:10px 10px;
`;
export const ArticleListContainer = styled.View`
  margin:10px 15px;
  flex:1;
  background:${props => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:4px;
  overflow:hidden;
`;
export const SearchBox = styled.View`
  flex-direction:row
  background:${props => props.theme.colors.SECONDARY_TEXTCOLOR};
  align-items:center;
  padding:0 20px
`;

