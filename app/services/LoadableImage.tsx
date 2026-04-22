import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useNetInfo } from "@react-native-community/netinfo";
import { DefaultImage } from "@components/shared/Image";
import { createImageProgress } from "./ImageLoad";
import { resolveImageSource } from "./imageResolver";

const CustomImage = createImageProgress(FastImage);
const FALLBACK_IMAGE = require("@assets/trash/defaultArticleImage.png");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const LoadableImage = (props: any): any => {
  const netInfo = useNetInfo();

  const {
    style,
    item,
    toggleSwitchVal,
    resizeMode,
    imageUrl,
    defaultImage = FALLBACK_IMAGE,
  } = props;

  const [showFallback, setShowFallback] = useState(false);

  const finalImageUrl =
    imageUrl || item?.cover_image?.url || item?.coverImage || "";

  const isOfflineMode =
    toggleSwitchVal || netInfo.isConnected === false;

  const resolved = useMemo(() => {
    console.log("finalImageUrl--",finalImageUrl);
    console.log("resolveImageSource output--",resolveImageSource({imageUrl: finalImageUrl,defaultImage,}))
    return resolveImageSource({
      imageUrl: finalImageUrl,
      defaultImage,
    });
  }, [finalImageUrl, defaultImage]);

  useEffect(() => {
    setShowFallback(false);
  }, [finalImageUrl, isOfflineMode]);

  const fallbackSource: ImageSourcePropType =
    resolved.bundledSource || resolved.defaultSource;

  // No URL at all -> directly show bundled/default fallback
  console.log(!resolved.onlineSource || !resolved.offlineCacheSource,"nourl",!resolved.onlineSource ,"||", !resolved.offlineCacheSource)
  if (!resolved.onlineSource || !resolved.offlineCacheSource) {
    return (
      <DefaultImage
        style={style}
        source={fallbackSource}
        resizeMode={resizeMode}
      />
    );
  }

  // If FastImage failed, show bundled image or default image
  console.log("showFallback--",showFallback)
  if (showFallback) {
    return (
      <DefaultImage
        style={style}
        source={fallbackSource}
        resizeMode={resizeMode}
      />
    );
  }

  return (
    <CustomImage
      source={isOfflineMode ? resolved.offlineCacheSource : resolved.onlineSource}
      style={style}
      resizeMode={resizeMode || FastImage.resizeMode.cover}
      indicator={(): any => (
        <ActivityIndicator size="large" color="#000" />
      )}
      onError={() => {
        setShowFallback(true);
      }}
      renderError={(): any => (
        <DefaultImage
          style={style}
          source={fallbackSource}
          resizeMode={resizeMode}
        />
      )}
    />
  );
};

export default React.memo(LoadableImage);