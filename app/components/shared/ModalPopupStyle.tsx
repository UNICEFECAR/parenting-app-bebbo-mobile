import styled from 'styled-components/native';
const ModalPopupContainer = styled.View`
  background-color: ${(props:any):any => props.theme?.colors?.SECONDARY_TEXTCOLOR};
  border-radius:4px;
  padding: 20px 0px;
  align-items: center;
`;

export const ModalPopupContainerVideo = styled(ModalPopupContainer)`
border-radius:0px;
background-color: transparent;
padding:0;
`;
export const PopupOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding:20px;
  
`;
export const PopupOverlayVideo = styled(PopupOverlay)`
  padding:0px;
`;

export const PopupCloseContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
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
`;
export const PopupCloseVideo = styled(PopupClose)`
  margin-right:4px;
  top:0;
`;
export const PopupCloseContainerCD = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  padding: 16px;
  zIndex: 999; 
  elevation: 999;
`;
export const PopupCloseVideoCD = styled.Pressable`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

export const ModalPopupContent = styled.View`
  padding:10px 40px;
  margin-top:-25px;
`;
export const ModalPopupContentVideo = styled.View`
  width:100%;
  background-color:#fff;
  min-width:100%;
  max-width:100%;
  flex:1;
  margin-top:0;
`;

export default ModalPopupContainer;