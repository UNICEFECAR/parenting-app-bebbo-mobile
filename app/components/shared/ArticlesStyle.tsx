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
  background:${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
  overflow:hidden;
  
`;
export const RelatedArticleContainer = styled(ArticleListContainer)`
  width:300px;
  margin:10px 5px;
  background-color:${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;
export const RelatedArticleContainer2 = styled(ArticleListContainer)`
  width:350px;
  margin:10px 5px;
  background-color:${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const SearchBox = styled.View`
  flex-direction:row
  background:${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
  align-items:center;
  padding:0;
  height:50px;
  width:100%;
`;
export const SearchInput = styled.TextInput`
  flex:1;
  padding:0 15px;
  text-align:${(props):any => props.theme.isRTL ? 'right' : 'left'};
`;

export const MainActivityBox = styled.View`
  justify-content:space-between;
  align-items:center;
  margin:10px 0 -10px;
  border-bottom-width:1px;
  border-top-width:1px;
  border-color:rgba(0,0,0,0.1)
  padding:10px 0;
`;
export const ActivityBox = styled.View`
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  width:100%;
`;

export const ArticleHeading = styled.View`
  padding:20px 15px 5px;
`;

export const ArticleDetailsContainer = styled.View`
  padding:15px 15px;
  min-height:145px;
`;
