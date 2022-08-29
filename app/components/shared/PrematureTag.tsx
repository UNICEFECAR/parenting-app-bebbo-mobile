import styled from 'styled-components/native';
const PrematureTag = styled.View`
  background:${(props):any => props.theme.colors.PRIMARY_COLOR};
  padding:4px 8px;
  text-align:center;
  color:${(props):any => props.theme.colors.PRIMARY_TEXTCOLOR};
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
`;
export default PrematureTag;
export const PrematureTagActivity = styled(PrematureTag)`
  background:${(props):any => props.theme.colors.ACTIVITIES_COLOR};
`;
export const PrematureTagGrowth = styled(PrematureTag)`
  background:${(props):any => props.theme.colors.CHILDGROWTH_COLOR};
`;
export const PrematureTagDevelopment = styled(PrematureTag)`
  background:${(props):any => props.theme.colors.CHILDDEVELOPMENT_COLOR};
`;
