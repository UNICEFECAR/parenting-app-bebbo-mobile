import React, { useEffect } from "react";
import { LayoutAnimation, Modal, UIManager, View } from "react-native";
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay,
} from "@components/shared/ModalPopupStyle";
import Icon from "./Icon";
import { Heading4Centerr } from "../../instances/bebbo/styles/typography";
import { FDirRow } from "./FlexBoxStyle";
import { ButtonModal, ButtonText } from "./ButtonGlobal";
import { useTranslation } from "react-i18next";

const FirstTimeModal = (props: any): any => {
  const { modalVisible, setIsModalOpened, modalScreenKey, modalScreenText } =
    props;
  const { t } = useTranslation();
  // useEffect(() => {
  //     UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  //     LayoutAnimation.easeInEaseOut();
  //   }, []);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        hardwareAccelerated={true}
        visible={modalVisible}
        onRequestClose={(): any => {
          console.log("request to close modal");
        }}
        onDismiss={(): any => {
          console.log("request to close modal");
        }}
      >
        <PopupOverlay>
          <ModalPopupContainer>
            <PopupCloseContainer>
              <PopupClose
                onPress={(): any => {
                  setIsModalOpened(modalScreenKey);
                }}
              >
                <Icon name="ic_close" size={16} color="#000" />
              </PopupClose>
            </PopupCloseContainer>
            <ModalPopupContent>
              <Heading4Centerr>{t(modalScreenText)}</Heading4Centerr>
            </ModalPopupContent>

            <FDirRow>
              <ButtonModal
                onPress={(): any => {
                  setIsModalOpened(modalScreenKey);
                }}
              >
                <ButtonText numberOfLines={2}>
                  {t("continueInModal")}
                </ButtonText>
              </ButtonModal>
            </FDirRow>
          </ModalPopupContainer>
        </PopupOverlay>
      </Modal>
    </View>
  );
};

export default FirstTimeModal;
