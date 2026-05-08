import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ImageSourcePropType } from "react-native";
import FastImage from "react-native-fast-image";
import { useNetInfo } from "@react-native-community/netinfo";
import { DefaultImage } from "@components/shared/Image";
import { createImageProgress } from "./ImageLoad";
import { resolveImageSource } from "./imageResolver";

const CustomImage = createImageProgress(FastImage);
const FALLBACK_IMAGE = require("@assets/trash/defaultArticleImage.png");

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
  const [offlineResolved, setOfflineResolved] = useState(false);

  const finalImageUrl =
    imageUrl || item?.cover_image?.url || item?.coverImage || "";

  const isOfflineMode = toggleSwitchVal || netInfo.isConnected === false;

  const resolved = useMemo(() => {
    return resolveImageSource({
      imageUrl: finalImageUrl,
      defaultImage,
    });
  }, [finalImageUrl, defaultImage]);

  useEffect(() => {
    setShowFallback(false);
    setOfflineResolved(false);
  }, [finalImageUrl, isOfflineMode]);

  const bundledSource = resolved.bundledSource;
  const defaultSource: ImageSourcePropType = resolved.defaultSource;

  const shouldFallbackFromLoadEvent = (event: any): boolean => {
    const width = event?.nativeEvent?.width ?? 0;
    const height = event?.nativeEvent?.height ?? 0;

    return width <= 0 || height <= 0;
  };

  const renderBundledOrDefault = () => {
    if (bundledSource) {
      return (
        <FastImage
          style={style}
          source={bundledSource as any}
          resizeMode={resizeMode || FastImage.resizeMode.cover}
          onLoad={(event: any) => {
            if (shouldFallbackFromLoadEvent(event)) {
              return;
            }
          }}
          onError={() => {
            // Keep empty handler to avoid unhandled native image errors.
          }}
        />
      );
    }

    return (
      <DefaultImage
        style={style}
        source={defaultSource}
        resizeMode={resizeMode}
      />
    );
  };

  // Keep this hook BEFORE any return
  useEffect(() => {
    if (!isOfflineMode) return;
    if (!bundledSource) return;
    if (showFallback) return;
    if (offlineResolved) return;
    if (!resolved.onlineSource || !resolved.offlineCacheSource) return;

    const timer = setTimeout(() => {
      setShowFallback(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    isOfflineMode,
    bundledSource,
    showFallback,
    offlineResolved,
    resolved.onlineSource,
    resolved.offlineCacheSource,
  ]);

  if (!resolved.onlineSource || !resolved.offlineCacheSource) {
    return renderBundledOrDefault();
  }

  if (showFallback) {
    return renderBundledOrDefault();
  }

  if (isOfflineMode) {
    return (
      <FastImage
        style={style}
        source={resolved.offlineCacheSource as any}
        resizeMode={resizeMode || FastImage.resizeMode.cover}
        onLoad={(event: any) => {
          if (shouldFallbackFromLoadEvent(event)) {
            setOfflineResolved(true);
            setShowFallback(true);
            return;
          }

          setOfflineResolved(true);
        }}
        onError={() => {
          setOfflineResolved(true);
          setShowFallback(true);
        }}
      />
    );
  }

  return (
    <CustomImage
      source={resolved.onlineSource}
      style={style}
      resizeMode={resizeMode || FastImage.resizeMode.cover}
      indicator={(): any => (
        <ActivityIndicator size="large" color="#000" />
      )}
      onError={() => {
        setShowFallback(true);
      }}
      renderError={(): any => renderBundledOrDefault()}
    />
  );
};

export default React.memo(LoadableImage);