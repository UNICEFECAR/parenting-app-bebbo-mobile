import React from "react";
import { Modal } from "react-native";
import ModalPopupContainer, {
    ModalPopupContent,
    PopupClose,
    PopupCloseContainer,
    PopupOverlay
  } from '@components/shared/ModalPopupStyle';
import Icon from "./Icon";
import { Heading4Centerr } from "@styles/typography";
import { FDirRow } from "./FlexBoxStyle";
import { ButtonModal, ButtonText } from "./ButtonGlobal";
import { useTranslation } from "react-i18next";

const FirstTimeModal = (props : any):any => {
    const {modalVisible, setIsModalOpened, modalScreenKey, modalScreenText} = props;
    const { t } = useTranslation();
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={():any => {
                console.log("request to close modal")
            }}
            onDismiss={():any => {
                console.log("request to close modal")
            }}>
            <PopupOverlay>
            <ModalPopupContainer>
                <PopupCloseContainer>
                <PopupClose
                    onPress={():any => {
                    setIsModalOpened(modalScreenKey);
                    }}>
                    <Icon name="ic_close" size={16} color="#000" />
                </PopupClose>
                </PopupCloseContainer>
                <ModalPopupContent>
                <Heading4Centerr>
                    {t(modalScreenText)}
                </Heading4Centerr>
                </ModalPopupContent>
                
                <FDirRow>
                <ButtonModal
                    onPress={():any => {
                    setIsModalOpened(modalScreenKey);
                    }}>
                    <ButtonText numberOfLines={2}>{t('continueInModal')}</ButtonText>
                </ButtonModal>
                </FDirRow>

            </ModalPopupContainer>
            </PopupOverlay>
        </Modal>
    );
}


export default FirstTimeModal