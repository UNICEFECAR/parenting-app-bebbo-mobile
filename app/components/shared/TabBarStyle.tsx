import styled from 'styled-components/native';
const TabBarStyle = styled.View`
`;
export default TabBarStyle;


export const TabBarDefault = styled.View`
border-radius:4px;
padding:10px;
margin:3px;
`
export const TabBarContainer = styled.View`
background-color:${props => props.theme.colors.SECONDARY_TEXTCOLOR};
flex-direction:row;
padding:2px 3px;
justify-content:center;
border-radius:4px;
/*margin-bottom:10px;*/
border-bottom-width:1px;
border-color:rgba(0,0,0,0.2)
`