import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { Heading1Centerr, Heading1P, Heading3Center, Heading3Centerr, Heading4Centerr, Heading4RegularP } from '@styles/typography';
import React, { useContext } from 'react';
import {StyleSheet, View, Modal, ActivityIndicator, TouchableOpacity, Text} from 'react-native';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { ButtonColTwo4,ButtonColTwo6, ButtonContainerTwoP, ButtonLinkPress, ButtonModal, ButtonText, ButtonTextLinew, ModalViewCustom, ViewModal } from './shared/ButtonGlobal';
import { FDirRow, FlexCol } from './shared/FlexBoxStyle';
import { ToolPress, ToolBoxText } from './shared/HomeScreenStyle';
import Icon, { OuterIconRow, OuterIconLeft } from './shared/Icon';
import { GoogleLogo } from './shared/LoadingStyle';
import ModalPopupContainer, { PopupOverlay, PopupCloseContainer, PopupClose, ModalPopupContent } from './shared/ModalPopupStyle';

const AlertModal = (props: any) =>{
  const {loading,title,message,cancelText,onCancel,onConfirm,disabledValue} = props;
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        // console.log('close modal');
      }}>
          <PopupOverlay>
          <ModalPopupContainer>
          <PopupCloseContainer>
              <PopupClose
                onPress={onCancel}>
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <ModalViewCustom>
              <Heading1Centerr>{title}</Heading1Centerr>
              </ModalViewCustom>
              <ModalViewCustom>
              <Heading3Centerr>
                {message}
              </Heading3Centerr>
              </ModalViewCustom>
              </ModalPopupContent>
              <FDirRow>
              {/* <ButtonModal
                onPress={onCancel}>
                <ButtonText numberOfLines={2}>{cancelText}</ButtonText>
              </ButtonModal> */}
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

 

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: '35%',
    width: "94%",
    borderRadius: 5,
    padding:"3%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

 

export default AlertModal;