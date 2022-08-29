import styled from 'styled-components/native';
const DevelopmentStyle = styled.View`
  
`;
export default DevelopmentStyle;



export const DevelopmentStatus = styled.View`
  border-top-width:1px;
  border-bottom-width:1px;
  border-color:${(props):any => props.theme.colors.CHILDDEVELOPMENT_COLOR};
  margin:15px 0;
  padding:10px 0
`;

export const DevelopmentPercent = styled.View`
  width:64px;
  height:64px;
  border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
  border-width:6px;
  border-color:${(props):any => props.theme.colors.CHILDDEVELOPMENT_COLOR};
  justify-content:center;
  align-items:center;
  margin-left:10px;
`;

export const DevelopmentContent = styled.View`
flex:3;
`;

export const DevelopmentBox = styled.View`
background-color:${(props):any => props.theme.colors.SECONDARY_TEXTCOLOR};
padding:14px 15px;
margin-bottom:-10px;
border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS};
`;
