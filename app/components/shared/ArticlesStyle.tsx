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
export const RelatedArticleContainer = styled(ArticleListContainer)`
  width:300px;
  margin:10px 15px;
`;

export const SearchBox = styled.View`
  flex-direction:row
  background:${props => props.theme.colors.SECONDARY_TEXTCOLOR};
  align-items:center;
  padding:0 20px
`;

export const ActivityBox = styled.View`
  flex-direction:row
  justify-content:space-between;
  align-items:center;
  margin:10px 0 -10px;
  border-bottom-width:1px;
  border-top-width:1px;
  border-color:rgba(0,0,0,0.1)
  padding:10px 0;
`;

export const ArticleHeading = styled.View`
  padding:20px 15px 5px;
`;

export const ArticleDetailsContainer = styled.View`
  padding:10px 15px;
`;
