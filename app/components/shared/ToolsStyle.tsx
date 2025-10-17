import styled from 'styled-components/native';
const ToolsStyle = styled.View`
  
`;
export default ToolsStyle;

export const VacSummaryBox = styled.View`

justify-content:center;
align-items:center;
`;

export const VacSummaryPress = styled.Pressable`
background:${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};

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
background-color:${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
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
padding:4px 0;
`;
export const ToolsIconView1 = styled.View`
padding:4px;
`;
export const ToolsHeadingView = styled.View`
padding:0 10px;
align-self:center;
`;
export const ToolsActionView = styled.View`
align-self:center;
`;

export const ToolsHeadPress = styled.Pressable`
flex-direction:row;
justify-content:space-between;
flex:1;
align-items:center;
`;
export const ToolsHeadView = styled.View`
flex-direction:row;
justify-content:space-between;
align-items: center;
width: 100%;
`;

export const HealthDesc = styled.View`
margin:0px 10px 0px 0;
`;


