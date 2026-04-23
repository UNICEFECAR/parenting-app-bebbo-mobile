import FastImage from "react-native-fast-image";
import { ImageSourcePropType } from "react-native";
import { appConfig } from "../instances";

type FastImageRemoteSource = {
  uri: string;
  priority?: any;
  cache?: any;
};

type ResolveImageSourceResult = {
  onlineSource: FastImageRemoteSource | null;
  offlineCacheSource: FastImageRemoteSource | null;
  bundledSource: ImageSourcePropType | null;
  defaultSource: ImageSourcePropType;
};

const getBaseUrl = (): string => {
  return appConfig?.baseUrl || "";
};

const normalizeUrl = (url?: string | null): string => {
  if (!url) {
    return "";
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return "";
  }

  if (
    trimmedUrl.startsWith("http://") ||
    trimmedUrl.startsWith("https://")
  ) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith("/")) {
    return `${getBaseUrl()}${trimmedUrl}`;
  }

  return trimmedUrl;
};

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    return value;
  }
};

export const getImagePathPartsFromUrl = (
  imageUrl?: string | null
): {
  folderName: string;
  fileName: string;
  relativeAssetPath: string;
} | null => {
  const normalizedUrl = normalizeUrl(imageUrl);
  if (!normalizedUrl) {
    return null;
  }

  const urlWithoutQuery = normalizedUrl.split("?")[0];
  const pathOnly = urlWithoutQuery.split("://")[1]
    ? urlWithoutQuery.split("://")[1].split("/").slice(1)
    : urlWithoutQuery.split("/").filter(Boolean);

  if (!pathOnly.length) {
    return null;
  }

  const rawFileName = pathOnly[pathOnly.length - 1] || "";
  const rawFolderName =
    pathOnly.length >= 2 ? pathOnly[pathOnly.length - 2] : "misc";

  const fileName = safeDecode(rawFileName);
  const folderName = safeDecode(rawFolderName);

  if (!fileName) {
    return null;
  }

  return {
    folderName,
    fileName,
    relativeAssetPath: `${folderName}/${fileName}`,
  };
};

export const getBundledOfflineImage = (
  imageUrl?: string | null
): ImageSourcePropType | null => {
  const parts = getImagePathPartsFromUrl(imageUrl);
  if (!parts) {
    return null;
  }
  console.log("parts is--",appConfig?.offlineImageMap?.[parts.relativeAssetPath] ,"||", null)
  return appConfig?.offlineImageMap?.[parts.relativeAssetPath] || null;
};

export const resolveImageSource = ({
  imageUrl,
  defaultImage,
}: {
  imageUrl?: string | null;
  defaultImage: ImageSourcePropType;
}): ResolveImageSourceResult => {
  const normalizedUrl = normalizeUrl(imageUrl);
  console.log("normalizedUrl--",normalizedUrl)
  if (!normalizedUrl) {
    return {
      onlineSource: null,
      offlineCacheSource: null,
      bundledSource: null,
      defaultSource: defaultImage,
    };
  }

  return {
    onlineSource: {
      uri: normalizedUrl,
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.immutable,
    },
    offlineCacheSource: {
      uri: normalizedUrl,
      priority: FastImage.priority.high,
      cache: FastImage.cacheControl.cacheOnly,
    },
    bundledSource: getBundledOfflineImage(normalizedUrl),
    defaultSource: defaultImage,
  };
};