import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Alert, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import VectorImage from 'react-native-vector-image';
import { useAppDispatch, useAppSelector } from '../../../App';
import { backup } from '../../services/backup';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { Heading1, Heading4, Heading4Regular, ShiftFromTopBottom5 } from '@styles/typography';
import { BannerContainer } from '@components/shared/Container';
import { SettingHeading, SettingOptions, SettingShareData } from '@components/shared/SettingsStyle';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import AlertModal from '@components/AlertModal';
import useNetInfoHook from '../../customHooks/useNetInfoHook';
import { encryptionsIVKey, encryptionsKey } from 'react-native-dotenv';
import AesCrypto from "react-native-aes-crypto";
import * as ScopedStorage from "react-native-scoped-storage";
import RNFS from "react-native-fs";
import { appConfig } from '../../instances';
import Share from "react-native-share";


const { width } = Dimensions.get("window");

const QuickLinksRow = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isExportAlertVisible, setExportAlertVisible] = useState(false);
  const actionSheetRef = useRef<any>(null);
  const netInfo = useNetInfoHook();
  const data = [
    { id: "1", title: t("favScreenHeader"), icon: require("@images/ic_favorites_link.svg"), route: "Favourites" },
    { id: "2", title: t("supportScreenheaderTitle"), icon: require("@images/ic_chat_link.svg"), route: "SupportChat" },
    { id: "3", title: t('settingScreenexportBtnText'), icon: require("@images/ic_backup_link.svg"), route: "Backup" },
  ];

  const Card = ({ item }: any) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed, // subtle feedback
        ]}
        android_ripple={{ color: "#D9EAF6", borderless: false }}
        onPress={() => {
          if (item.id == "3") {
            SheetManager.show("export_action_sheet")
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
    setIsExportRunning(true);
    const exportIsSuccess = await backup.export();
    setIsExportRunning(false);
    if (!exportIsSuccess) {
      Alert.alert("", t("settingExportError"));
    } else {
      Alert.alert("", t("settingExportSuccess"));
    }
    actionSheetRef.current?.setModalVisible(false);
  };
  const encryptData = (text: string, key: any): any => {
    console.log(
      text,
      "..text,key,encryptionsIVKey..",
      encryptionsIVKey.replace("//:completeSettings = none", "")
    );
    return AesCrypto.encrypt(
      text,
      key,
      encryptionsIVKey.replace("//:completeSettings = none", ""),
      "aes-256-cbc"
    )
      .then((cipher: any) => ({
        cipher,
      }))
      .catch((error: any) => {
        console.log(error, "..error..");
        setIsExportRunning(false);
      });
  };
  const exportDataAndroid = async (cipher: string): Promise<any> => {
    // const file = await ScopedStorage.openDocumentTree(true);
    const uri: any = await ScopedStorage.getPersistedUriPermissions();
    try {
      // const fileDownload: any = await ScopedStorage.writeFile(file.uri,JSON.stringify(cipher), "mybackup.json", "*/*",  'utf8', false);
      const fileDownload: any = await ScopedStorage.createDocument(
        "mybackup",
        "application/json",
        JSON.stringify(cipher),
        "utf8"
      );
      const uri1: any = await ScopedStorage.getPersistedUriPermissions();

      if (
        fileDownload != "" &&
        fileDownload != null &&
        fileDownload != undefined
      ) {
        Alert.alert("", t("settingExportSuccess"));
        setIsExportRunning(false);
      } else {
        Alert.alert("", t("settingExportError"));
        setIsExportRunning(false);
      }
    } catch (e: any) {
      console.log("", e.message);
      setIsExportRunning(false);
    }
  };
  const exportDataIOS = async (cipher: string): Promise<any> => {
    console.log("exportDataIOS", cipher);

    RNFS.writeFile(appConfig.tempbackUpPath, cipher, "utf8")
      .then(async (res: any) => {
        console.log(res, "..res..");
        const shareOptions = {
          title: "Backup File",
          url: appConfig.tempbackUpPath,
          saveToFiles: true,
          failOnCancel: false,
        };
        try {
          const ShareResponse = await Share.open(shareOptions);
          setIsExportRunning(false);
          if (ShareResponse && ShareResponse.success) {
            Alert.alert("", t("settingExportSuccess"));
            await RNFS.exists(appConfig.tempbackUpPath).then((exists) => {
              console.log(String(exists), "..exists..");
              if (exists) {
                RNFS.unlink(appConfig.tempbackUpPath).then(() => {
                  //RNFS.scanFile(tempbackUpPath);
                });
              }
            });
          } else {
            Alert.alert("", t("settingExportError"));
          }
        } catch (error: any) {
          setIsExportRunning(false);
          if (error.error && error.error.code === "ECANCELLED500") {
            console.log("canceled");
          } else {
            Alert.alert("", t("settingExportError"));
          }
        }
      })
      .catch((e) => {
        console.log(e);
        setIsExportRunning(false);
        Alert.alert("", t("settingExportError"));
      });
  };
  const exportFile = async (): Promise<any> => {
    //need to add code.
    setIsExportRunning(true);
    try {
      userRealmCommon
        .exportUserRealmDataToJson()
        .then(async (jsonData: any) => {
          encryptData(JSON.stringify(jsonData), encryptionsKey).then(
            async (cipher: any) => {
              if (Platform.OS === "android") {
                exportDataAndroid(cipher.cipher);
              } else {
                console.log("cipher is", cipher.cipher);
                exportDataIOS(cipher.cipher);
              }
            }
          );
        })
        .catch((error) => {
          console.log("Error exporting data:", error);
          setIsExportRunning(false);
          Alert.alert("", t("settingExportError"));
        });
    } catch (err) {
      console.log("Error", err);
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
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Card item={item} />}
        horizontal
        contentContainerStyle={styles.listContainer}
        showsHorizontalScrollIndicator={false}
      />
      <ActionSheet id="export_action_sheet" ref={actionSheetRef}>
        <BannerContainer>
          <SettingHeading>
            <Heading1>{t("settingScreenexportOptionHeader")}</Heading1>
          </SettingHeading>
          <SettingShareData>
            <FDirRow>
              <SettingOptions>
                <Pressable
                  onPress={async (): Promise<any> => {
                    console.log("icon clicked");
                    try {
                      if (Platform.OS === "android") {
                        console.log("1233");

                        console.log("You can write");
                        actionSheetRef.current?.setModalVisible(false);
                        exportFile();
                      } else {
                        actionSheetRef.current?.setModalVisible(false);
                        setTimeout(() => {
                          exportFile();
                        }, 350);
                      }
                    } catch (err) {
                      console.warn(err);
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
                  onPress={(): any => {
                    actionSheetRef.current?.setModalVisible(false);
                    if (netInfo && netInfo.isConnected == true) {
                      Platform.OS == "ios"
                        ? setTimeout(() => {
                          setExportAlertVisible(true);
                        }, 350)
                        : setExportAlertVisible(true);
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