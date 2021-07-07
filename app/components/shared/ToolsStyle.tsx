import styled from 'styled-components/native';
const ToolsStyle = styled.View`
  
`;
export default ToolsStyle;

export const VacSummaryBox = styled.View`
background:${props => props.theme.colors.SECONDARY_TEXTCOLOR};
justify-content:center;
align-items:center;
padding:8px 5px;
width:100px;
border-radius:4px;
margin:7px 0 8px;
`;

export const VacSummaryOuter = styled.View`
flex-direction:row;
flex:1;
`;


export const ToolsBgContainer = styled.View`
background:${props => props.theme.colors.SECONDARY_TEXTCOLOR};
flex-direction:column;
flex:1;
`;
export const ToolsListOuter = styled.View`
padding:7px 8px;


`;
export const ToolsListContainer = styled.View`
border-radius:4px;
flex-direction:row;
padding:10px 15px;
`;

export const ToolsIconView = styled.View`
padding:4px 0
`;
export const ToolsHeadingView = styled.View`
padding:0 10px;
`;
export const ToolsActionView = styled.View`
margin-top:7px;
`;

export const ToolsHeadPress = styled.Pressable`
flex-direction:row;
justify-content:space-between;
flex:1
`;
export const ToolsHeadView = styled.View`
flex-direction:row;
justify-content:space-between;
flex:1;
`;
