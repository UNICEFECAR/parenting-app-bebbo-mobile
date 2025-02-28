import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import React from "react";
import {
  Heading1Centerr,
  Heading3Centerr,
} from "../instances/bebbo/styles/typography";
import { Modal } from "react-native";
import { ModalViewCustom } from "./shared/ButtonGlobal";
import { FDirRow } from "./shared/FlexBoxStyle";
import Icon from "./shared/Icon";
import ModalPopupContainer, {
  PopupOverlay,
  PopupCloseContainer,
  PopupClose,
  ModalPopupContent,
} from "./shared/ModalPopupStyle";

const AlertModal = (props: any): any => {
  const { loading, title, message, onCancel, onConfirm, disabledValue } = props;
  return (
    <Modal
      transparent={true}
      animationType={"none"}
      visible={loading}
      onRequestClose={(): any => {
        console.log("on request closed");
      }}
    >
      <PopupOverlay>
        <ModalPopupContainer>
          <PopupCloseContainer>
            <PopupClose onPress={onCancel}>
              <Icon name="ic_close" size={16} color="#000" />
            </PopupClose>
          </PopupCloseContainer>
          <ModalPopupContent>
            <ModalViewCustom>
              <Heading1Centerr>{title}</Heading1Centerr>
            </ModalViewCustom>
            <ModalViewCustom>
              <Heading3Centerr>{message}</Heading3Centerr>
            </ModalViewCustom>
          </ModalPopupContent>
          <FDirRow>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={onConfirm}
              disabled={disabledValue}
            />
          </FDirRow>
        </ModalPopupContainer>
      </PopupOverlay>
    </Modal>
  );
};

export default AlertModal;
