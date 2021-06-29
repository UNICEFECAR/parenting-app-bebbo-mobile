import styled from 'styled-components/native';
const NavigationDrawer = styled.View`
`;
export default NavigationDrawer;

export const DrawerHeadContainer = styled.View`
padding:10px 5px;
`;

export const DrawerLinkView = styled.Pressable`
padding:12px 15px;
flex-direction:row;
align-items:center;
border-bottom-width:1px;
border-color:#ddd
`;
export const SubDrawerLinkView = styled(DrawerLinkView)`
padding:0px;
flex-direction:row;
align-items:center;
border-bottom-width:1px;
border-color:#ddd

`;

export const NavIconSpacing = styled(DrawerLinkView)`
padding:12px 8px;

`;
export const SubDrawerHead = styled.View`
margin-left:13px;
`;

