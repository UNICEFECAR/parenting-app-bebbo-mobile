import styled from 'styled-components/native';
const NotificationStyle = styled.View`
`;
export default NotificationStyle;

export const NotificationListContainer = styled.View`
padding:10px 15px 10px;
flex-direction:row;

`;
export const NotifIcon = styled.View`
padding:8px;
margin:0 10px 0 0px;
border-radius:${(props):any => props.theme.borderRadius.BORDERRADIUS_CIRCLE};
`;
export const NotifiContent = styled.View`
flex-direction:column;
flex:1
`;

export const NotifAction = styled.View`
margin-right:-10px;
width:40px;height:40px;
align-items:flex-end;
`;




