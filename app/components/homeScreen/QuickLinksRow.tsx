import {diagnosticError} from '../../services/diagnostics';
import {backupErrorMessage} from '../../services/backupErrorMessage';
import HorizontalContentList from "@components/shared/HorizontalContentList";
import React, { useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ActionSheet, {type AppActionSheetRef} from "@components/shared/AppActionSheet";
import VectorImage from 'react-native-vector-image';
import { backup } from '../../services/backup';
import { Heading1, Heading4, Heading4Regular, ShiftFromTopBottom5 } from '@styles/typography';
import { BannerContainer } from '@components/shared/Container';
import { SettingHeading, SettingOptions, SettingShareData } from '@components/shared/SettingsStyle';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import AlertModal from '@components/AlertModal';
import useNetInfoHook from '../../customHooks/useNetInfoHook';


const { width } = Dimensions.get("window");

const QuickLinksRow = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const driveExportRunning = useRef(false);
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isExportAlertVisible, setExportAlertVisible] = useState(false);
  const actionSheetRef = useRef<AppActionSheetRef>(null);
  const netInfo = useNetInfoHook();
  const data = [
    { id: "1", title: t("favScreenHeader"), icon: require("@images/ic_favorites_link.svg"), route: "Favourites" },
    { id: "2", title: t("supportScreenheaderTitle"), icon: require("@images/ic_chat_link.svg"), route: "SupportChat" },
    { id: "3", title: t('settingScreenexportBtnText'), icon: require("@images/ic_backup_link.svg"), route: "Backup" },
  ];

  const Card = ({ item }: any) => {
    return (
      <Pressable
        disabled={isExportRunning}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed, // subtle feedback
        ]}
        android_ripple={{ color: "#D9EAF6", borderless: false }}
        onPress={() => {
          if (item.id == "3") {
            actionSheetRef.current?.show()
          } else {
            navigation.navigate(item.route as never)
          }
        }}
      >
        <View style={styles.iconWrapper}>
          <VectorImage source={item.icon} style={styles.icon} resizeMode="contain" />
        </View>
        <Heading4 style={styles.title}>{item.title}</Heading4>
      </Pressable>
    );
  };
  const exportToDrive = async (): Promise<any> => {
    if (driveExportRunning.current) return;
    driveExportRunning.current = true;
    setIsExportRunning(true);
    try {
      const success = await backup.export();
      if (success) Alert.alert("", t("settingExportSuccess"));
    } catch (error) {
      console.error("Drive backup failed", diagnosticError(error instanceof Error ? error : "Backup operation failed"));
      Alert.alert("", backupErrorMessage(error, t));
    } finally {
      driveExportRunning.current = false;
      setIsExportRunning(false);
      actionSheetRef.current?.hide();
    }
  };

  const exportFile = async (): Promise<void> => {
    if (driveExportRunning.current) return;
    driveExportRunning.current = true;
    setIsExportRunning(true);
    try {
      if (await backup.exportToFile()) Alert.alert("", t("settingExportSuccess"));
    } catch (error) {
      console.error("Backup export failed", diagnosticError(error instanceof Error ? error : "Backup operation failed"));
      Alert.alert("", backupErrorMessage(error, t));
    } finally {
      driveExportRunning.current = false;
      setIsExportRunning(false);
    }
  };
  const handleExportAlertConfirm = (): any => {
    setExportAlertVisible(false);
    exportToDrive();
  };
  const onExportCancel = (): any => {
    setExportAlertVisible(false);
  };
  return (
    <View style={styles.container}>
      <HorizontalContentList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Card item={item} />}
        horizontal
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
      <ActionSheet ref={actionSheetRef}>
        <BannerContainer>
          <SettingHeading>
            <Heading1>{t("settingScreenexportOptionHeader")}</Heading1>
          </SettingHeading>
          <SettingShareData>
            <FDirRow>
              <SettingOptions>
                <Pressable
                  onPress={async (): Promise<void> => {
                    if (!(await actionSheetRef.current?.hideAndWait())) return;
                    try {
                      await exportFile();
                    } catch (error) {
                      console.warn(error);
                    }
                  }}
                >
                  <VectorImage source={require("@images/ic_file.svg")} />
                  <ShiftFromTopBottom5>
                    <Heading4Regular>
                      {t("settingScreenshareBtntxt")}
                    </Heading4Regular>
                  </ShiftFromTopBottom5>
                </Pressable>
              </SettingOptions>
              <SettingOptions>
                <Pressable
                  onPress={async (): Promise<void> => {
                    if (!(await actionSheetRef.current?.hideAndWait())) return;
                    if (netInfo && netInfo.isConnected === true) {
                      setExportAlertVisible(true);
                    } else {
                      Alert.alert("", t("noInternet"));
                    }
                  }}
                >
                  <VectorImage source={require("@images/ic_gdrive.svg")} />
                  <ShiftFromTopBottom5>
                    <Heading4Regular>
                      {t("settingScreengdriveBtntxt")}
                    </Heading4Regular>
                  </ShiftFromTopBottom5>
                </Pressable>
              </SettingOptions>
            </FDirRow>
          </SettingShareData>
        </BannerContainer>
      </ActionSheet>
      <AlertModal
        loading={isExportAlertVisible}
        disabled={isExportRunning}
        message={t("dataConsistency")}
        title={t("exportText")}
        cancelText={t("retryCancelPopUpBtn")}
        onConfirm={handleExportAlertConfirm}
        onCancel={onExportCancel}
      ></AlertModal>

    </View>
  );
};

const CARD_WIDTH = width * 0.285; // Adjust card width

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  listContainer: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  card: {
    width: CARD_WIDTH,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }], // slight shrink effect
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D2ECF8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 72,
    height: 72,
  },
  title: {
    textAlign: "center",
    paddingHorizontal: 6,
  },
});

export default QuickLinksRow;
