import styled from 'styled-components/native';
const ModalPopupContainer = styled.View`
  background-color: ${(props) => props.theme.colors.SECONDARY_TEXTCOLOR};
  border-radius: 4px;
  padding: 20px 15px;
  align-items: center;
`;

export const PopupOverlay = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
`;

export const PopupCloseContainer = styled.Pressable`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;
export const PopupClose = styled.Pressable`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: -15px;
  margin-bottom: 10px;
  width: 36px;
  height: 36px;
`;

export default ModalPopupContainer;