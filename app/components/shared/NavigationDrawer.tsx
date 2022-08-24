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
border-color:#ddd;
`;
export const SubDrawerLinkView = styled(DrawerLinkView)`
padding:0px;
flex-direction:row;
align-items:center;
border-bottom-width:1px;
border-color:#ddd

`;

export const NavIconSpacing = styled.View`
padding:12px 8px;

`;
export const SubDrawerHead = styled.View`
margin-left:13px;
`;

export const BubbleContainer = styled.View`
margin-left:auto
`;

export const BubbleView = styled.View`
width:26px;height:26px;
justify-content:center;
align-items:center;
padding:2px;
background-color:${(props):any => props.theme.colors.SECONDARY_COLOR};
border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
`;

export const BubbleView1 = styled(BubbleView)`
background-color:red;
`;