import styled from 'styled-components/native';
const ModalPopupContainer = styled.View`
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};
  padding: 20px 0px;
  align-items: center;
`;

export const ModalPopupContainerVideo = styled(ModalPopupContainer)`
border-radius:0px;
background-color: transparent;
  /*background-color: ${(props) => props.theme.colors.PRIMARY_TEXTCOLOR};
   border-radius:${(props) => props.theme.borderRadius.BORDERRADIUS};*/
`;
export const PopupOverlay = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding:20px;
`;
export const PopupOverlayVideo = styled(PopupOverlay)`
  padding:0px;
`;

export const PopupCloseContainer = styled.Pressable`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;;
  position:relative;
  z-index:111;
`;
export const PopupClose = styled.Pressable`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self:center; 
  right:0;
  top:-20px;
  width: 40px;
  height: 40px;
  /* position:absolute; */
  
`;
export const ModalPopupContent = styled.View`
  padding:10px 40px;
  margin-top:-25px

`;
export const ModalPopupContentVideo = styled.View`
 width:100%;
background-color:#fff;
  min-width:100%;
  max-width:100%;
  flex:1
`;

export default ModalPopupContainer;