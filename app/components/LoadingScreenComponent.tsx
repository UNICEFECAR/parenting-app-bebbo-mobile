import * as React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import VectorImage from "react-native-vector-image";
import { FlexDirCol } from "./shared/FlexBoxStyle";
const flavor = process.env.FLAVOR || "bebbo";
const BebboLogoShapeNew = require(`../instances/${flavor}/assets/images/logo/bebbo_logo_shape.svg`);
const BebboLogoShapeMB = require(`../instances/${flavor}/assets/images/logo/bebbo_logo_shape1.svg`);
import {
  LoadingContainer,
  LoadingText,
  MainView,
} from "./shared/LoadingStyle";
import { useAppSelector } from "../../App";
import { gradientColorFirst, gradientColorSecond, gradientColorThird, LoadingScreenColorText } from "@styles/style";
import { appConfig } from "../instances";

const item = {
  image: flavor == "merhabaBebek" ? BebboLogoShapeMB : BebboLogoShapeNew,
  colors: [gradientColorFirst, gradientColorSecond, gradientColorThird],
};

const styles = StyleSheet.create({
  innerView: {
    alignContent: "center",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    marginBottom: 15,
    color: LoadingScreenColorText
  },
  linearGradient: {
    flex: 1,
  },
  loadingText: { textAlign: "center" },
  mainView: {
    alignContent: "center",
    height: 60,
    marginTop: 15,
    width: 180,
  },
  outerView: {
    alignItems: "center",
    flex: 4,
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 45,
  },
  partnerLogoView: {
    alignContent: "center",
    height: 60,
    marginTop: 20,
    resizeMode: "contain",
    width: 180,
  },
  
  staticLogoView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  
  staticLogoImage: {
    width: 160,
    height: 70,
  },
  vectorImageView: { marginBottom: 15 },
  logoImage: {
    width: 200, // Desired width
    height: 200, // Desired height
    resizeMode: "contain",
  },
});
const getOfflineImageKeyFromUrl = (url?: string): string | undefined => {
  if (!url) {
    return undefined;
  }

  try {
    const urlWithoutQuery = url.split("?")[0];

    const match = urlWithoutQuery.match(/\/(\d{4}-\d{2})\/([^/]+)$/);

    if (!match) {
      return undefined;
    }

    const folder = match[1];
    const fileName = decodeURIComponent(match[2]);

    return `${folder}/${fileName}`;
  } catch (error) {
    console.log("Error creating offline image key from url", url, error);
    return undefined;
  }
};

const getLoadingLogoSource = (
  imageObj?: { url?: string; name?: string }
): ImageSourcePropType | undefined => {
  const offlineKey = getOfflineImageKeyFromUrl(imageObj?.url);

  if (offlineKey && appConfig?.offlineImageMap?.[offlineKey]) {
    return appConfig.offlineImageMap[offlineKey];
  }

  if (imageObj?.url) {
    return { uri: imageObj.url };
  }

  return undefined;
};
const renderLoadingLogo = (
  source: ImageSourcePropType | undefined,
  style: any,
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center"
) => {
  if (!source) {
    return null;
  }

  return (
    <Image
      source={source}
      style={style}
      {...(resizeMode ? { resizeMode } : {})}
    />
  );
};
const LoadingScreenComponent = (props: any): any => {
  const { t } = useTranslation();
  const sponsors = useAppSelector(
    (state: any) => state.selectedCountry.sponsors
  );
  const partnerLogoSource = getLoadingLogoSource(
    sponsors?.country_national_partner
  );

  const sponsorLogoSource = getLoadingLogoSource(
    sponsors?.country_sponsor_logo
  );

  const unicefLogoSource = getLoadingLogoSource(
    sponsors?.unicef_logo
  );
  const isMB = flavor === "merhabaBebek";

  return (
    <LoadingContainer>
      <MainView>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={item.colors}
          style={styles.linearGradient}
        >
          <View style={styles.outerView}>
            <FlexDirCol>
              <View style={styles.vectorImageView}>
                {item.image && (
                  <VectorImage
                    style={isMB ? styles.logoImage : {}}
                    source={item.image}
                  />
                )}
              </View>
              {partnerLogoSource &&
                renderLoadingLogo(partnerLogoSource, styles.partnerLogoView, "contain")
              }

              {sponsorLogoSource &&
                renderLoadingLogo(sponsorLogoSource, styles.partnerLogoView, "contain")
              }

              <View style={styles.staticLogoView}>
                {renderLoadingLogo(unicefLogoSource, styles.staticLogoImage)}
              </View>
            </FlexDirCol>
          </View>

          <View style={styles.innerView}>
            <Text>
              <ActivityIndicator size="large" color={LoadingScreenColorText} />
            </Text>
            <Text style={styles.loadingText}>
              <LoadingText style={{ color: LoadingScreenColorText }}>{t("loadingText")}</LoadingText>
            </Text>
          </View>
        </LinearGradient>
      </MainView>
    </LoadingContainer>
  );
};
export default LoadingScreenComponent;
