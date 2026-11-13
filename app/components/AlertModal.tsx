import React from "react";
import {
  Heading1Centerr,
  Heading3Centerr,
} from "../instances/bebbo/styles/typography";
import { Modal, Platform, Pressable, Text } from "react-native";
import VectorImage from 'react-native-vector-image';
import { useTranslation } from 'react-i18next';
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
  const { loading, title, message, onCancel, onConfirm, disabledValue, disabled } = props;
  const { t } = useTranslation();
  const isDisabled = disabledValue ?? disabled;
  const GoogleSigninButton = Platform.OS === 'ios'
    ? require('@react-native-google-signin/google-signin').GoogleSigninButton
    : null;
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
            {Platform.OS === 'android' ? (
              <Pressable
                accessibilityRole="button"
                disabled={isDisabled}
                onPress={onConfirm}
                style={({ pressed }) => ({
                  minHeight: 48, minWidth: 230, maxWidth: '100%', paddingHorizontal: 16,
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: '#fff', borderWidth: 1, borderColor: '#747775', borderRadius: 4,
                  opacity: isDisabled ? 0.5 : pressed ? 0.8 : 1,
                })}
              >
                <VectorImage source={require('@images/ic_gdrive.svg')} style={{ width: 24, height: 24, marginEnd: 12 }} />
                <Text style={{ color: '#1f1f1f', fontSize: 16, flexShrink: 1 }}>{t('settingScreengdriveBtntxt')}</Text>
              </Pressable>
            ) : <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={onConfirm}
              disabled={isDisabled}
            />}
          </FDirRow>
        </ModalPopupContainer>
      </PopupOverlay>
    </Modal>
  );
};

export default AlertModal;
