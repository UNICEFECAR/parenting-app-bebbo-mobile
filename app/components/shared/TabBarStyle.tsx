import styled from 'styled-components/native';
const TabBarStyle = styled.View`
`;
export default TabBarStyle;


export const TabBarDefault = styled.View`
border-radius:4px;
padding:4px 8px;
margin:3px;
height:auto;
min-height:43px;
justify-content:center;
`

export const TabBarActive = styled.View`
border-radius:4px;
padding:10px;
margin:3px;
background-color:${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
`


export const TabBarContainer = styled.View`
background-color:${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
flex-direction:row;
justify-content:center;
border-radius:4px;
margin-bottom:10px;
border-bottom-width:1px;
border-color:rgba(0,0,0,0.2);
`

export const TabBarContainerBrd = styled(TabBarContainer)`

border-radius:4px;

`
