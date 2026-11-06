
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { getCachedCountryAppUpdate, saveCachedCountryAppUpdate } from "../../services/countryAppUpdateStorage";
import commonApiService from "../../services/commonApiService";
import { appConfig } from "../../instances";

// Keep these imports pointing to your existing files.

type CountryAppBannerProps = {
  countryId?: number | string;
};

const CountryAppBanner = ({
  countryId,
}: CountryAppBannerProps) => {
  const netInfo = useNetInfoHook();
  const [appUpdate, setAppUpdate] = useState<any>(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;

    const loadAppUpdate = async () => {
      if (countryId == null || countryId === "") {
        if (active) {
          setAppUpdate(null);
        }
        return;
      }

      // Load cached data first, including when offline.
      const cached = await getCachedCountryAppUpdate(countryId);

      if (active) {
        setAppUpdate(cached);
      }

      // Refresh the cache only when connected.
      if (netInfo.isConnected !== true) {
        return;
      }

      try {
        const response = await commonApiService(
          appConfig.apiConfig.checkUpdate,
          "get",
          {},
          Number(countryId)
        );

        // commonApiService returns { data, status } even on failure.
        const data = response?.data;

        if (
          response?.status >= 200 &&
          response?.status < 300 &&
          data?.app_update &&
          data.app_update.flag != null
        ) {
          const latestUpdate = data.app_update;

          await saveCachedCountryAppUpdate(
            countryId,
            latestUpdate
          );

          if (active) {
            setAppUpdate(latestUpdate);
          }
        }
      } catch (error) {
        console.log(
          "Unable to refresh country app update:",
          error
        );
        // Keep showing cached data if the request fails.
      }
    };

    loadAppUpdate();

    return () => {
      active = false;
    };
  }, [countryId, netInfo.isConnected]);

  const storeUrl =
    Platform.OS === "android"
      ? appUpdate?.google_play_url
      : Platform.OS === "ios"
        ? appUpdate?.app_store_url
        : null;

  const handleUseApp = async () => {
    if (
      typeof storeUrl !== "string" ||
      !/^https?:\/\//i.test(storeUrl)
    ) {
      Alert.alert(
        t("newAppStoreUnavailableTitle"),
        t("newAppStoreUnavailableMessage")
      );
      return;
    }

    try {
      await Linking.openURL(storeUrl);
    } catch {
      Alert.alert(
        t("newAppStoreErrorTitle"),
        t("newAppStoreErrorMessage")
      );
    }
  };

  if (Number(appUpdate?.flag) !== 1) {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.bannerHeader}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.title}>
              {t("newAppBannerTitle")}
            </Text>

            <Text style={styles.message}>
              {t("newAppBannerMessage")}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setInfoVisible(true)}
            style={styles.infoButton}
            accessibilityRole="button"
            accessibilityLabel={t("newAppInfoAccessibility")}
            hitSlop={8}
          >
            <Text style={styles.infoIcon}>i</Text>
          </TouchableOpacity>
        </View>

        {storeUrl ? (
          <TouchableOpacity
            onPress={handleUseApp}
            disabled={netInfo.isConnected !== true}
            activeOpacity={0.8}
            accessibilityRole="button"
            style={[
              styles.button,
              netInfo.isConnected !== true &&
                styles.buttonOffline,
            ]}
          >
            <Text
              style={[
                styles.buttonText,
                netInfo.isConnected !== true &&
                  styles.buttonTextOffline,
              ]}
            >
              {t("newAppBannerLinkBtn")}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("newAppInfoTitle")}
              </Text>

              <TouchableOpacity
                onPress={() => setInfoVisible(false)}
                accessibilityRole="button"
                accessibilityLabel={t("close")}
                hitSlop={10}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* All migration instructions come from one string. */}
              <Text style={styles.instructions}>
                {t("newAppMigrationInstructions")}
              </Text>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setInfoVisible(false)}
              style={styles.doneButton}
              activeOpacity={0.8}
            >
              <Text style={styles.doneButtonText}>
                {t("close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E8F2FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#C5DAF5",
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  bannerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#183B63",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#183B63",
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#245A91",
    alignItems: "center",
    justifyContent: "center",
  },
  infoIcon: {
    color: "#245A91",
    fontSize: 19,
    fontWeight: "700",
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#245A91",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonOffline: {
    backgroundColor: "#D3D3D3",
  },
  buttonTextOffline: {
    color: "#777777",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  modalTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: "700",
    color: "#183B63",
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  closeText: {
    fontSize: 28,
    color: "#666666",
  },
  modalScroll: {
    flexShrink: 1,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 23,
    color: "#333333",
    paddingBottom: 12,
  },
  doneButton: {
    backgroundColor: "#245A91",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default CountryAppBanner;
