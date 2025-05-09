import styled from "styled-components/native";
const ArticlesStyle = styled.View``;
export default ArticlesStyle;

export const ArticleListContent = styled.View`
  width: 100%;
  padding: 10px 10px;
`;
export const ArticleListContainer = styled.View`
  margin: 10px 15px;
  background: ${(props: any): any => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius: 4px;
  overflow: hidden;
`;
export const ArticleListBox = styled.View`
  margin: 10px 15px;
  background-color: ${(props: any): any =>
    props.theme?.colors?.SECONDARY_TEXTCOLOR};
  border-radius: 4px;
  shadow-color: #00000;
  shadow-offset: 0px 2px; /* Shadow only at the bottom */
  shadow-opacity: 0.08;
  shadow-radius: 2px;
  elevation: 2;
`;

export const RelatedArticleContainer = styled(ArticleListContainer)`
  width: 300px;
  margin: 10px 5px;
  background-color: ${(props: any): any =>
    props.theme.colors.SECONDARY_TEXTCOLOR};
`;
export const RelatedArticleContainer2 = styled(ArticleListContainer)`
  width: 350px;
  margin: 10px 5px;
  background-color: ${(props: any): any =>
    props.theme.colors.SECONDARY_TEXTCOLOR};
`;

export const SearchBox = styled.View`
  flex-direction: row;
  background: ${(props: any): any => props.theme.colors.SECONDARY_TEXTCOLOR};
  align-items: center;
  padding-right: 10px;
  height: 50px;
  width: 100%;
`;

export const HomeSearchBox = styled.View`
  flex-direction: row;
  background: ${(props: any): any => props.theme.colors.SECONDARY_TEXTCOLOR};
  align-items: center;
  padding: 0;
  height: 50px;
  border-color: "#777779";
  border-bottom-width: 1px;
  width: 100%;
`;
export const SearchInput = styled.TextInput`
  flex: 1;

  text-align: ${(props: any): any => (props.theme.isRTL ? "right" : "left")};
`;

export const MainActivityBox = styled.View`
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 -10px;
  border-bottom-width: 1px;
  border-top-width: 1px;
  border-color: rgba(0, 0, 0, 0.1);
  padding: 10px 0;
`;
export const ActivityBox = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const ArticleHeading = styled.View`
  padding: 20px 15px 5px;
`;

export const ArticleDetailsContainer = styled.View`
  padding: 15px 15px;
  min-height: 145px;
`;
