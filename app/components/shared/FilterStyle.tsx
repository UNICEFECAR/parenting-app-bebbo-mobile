import styled from "styled-components/native";
const FilterStyle = styled.View``;
export default FilterStyle;

export const ArticleFilter = styled.View`
  padding: 10px 10px;
  min-height: 120px;
  border-bottom-color: ${(props: any): any =>
    props.theme.colors.ARTICLES_COLOR};
  border-top-color: ${(props: any): any => props.theme.colors.ARTICLES_COLOR};
  /*border-bottom-width:1px;
  border-Top-width:1px;*/
  margin-bottom: 5px;
`;
export const ActivityFilter = styled(ArticleFilter)`
  margin: 0px;
  padding: 0;
  margin-top: -5px;
`;

export const FilterBox = styled.View`
  border-radius: 4px;
  margin: 3px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  column-gap: 6px;
  flex: 1;
`;

// Keep spacing on the row, outside the LTR-isolated icon glyph.
export const FilterIconSlot = styled.View`
  width: 24px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

export const FilterText = styled.Text`
  min-width: 0;
  font-size: 10px;
  flex: 1;
  font-weight: bold;
  color: ${(props: any): any => props.theme.colors.PRIMARY_TEXTCOLOR};
  flex-shrink: 1;
  text-align: start;
`;
