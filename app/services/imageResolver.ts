import FastImage from "@d11/react-native-fast-image";
import { ImageSourcePropType } from "react-native";
import { appConfig } from "../instances";

type FastImageRemoteSource = {
  uri: string;
  priority?: any;
  cache?: any;
};

type BundledAssetSource = number;

type ResolveImageSourceResult = {
  onlineSource: FastImageRemoteSource | null;
  offlineCacheSource: FastImageRemoteSource | null;
  bundledSource: BundledAssetSource | null;
  defaultSource: ImageSourcePropType;
};

const getBaseUrl = (): string => {
  return appConfig?.baseUrl || "";
};

const normalizeUrl = (url?: string | null): string => {
  if (typeof url !== 'string' || !url) {
    return "";
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return "";
  }

  // These sources come from CMS content, not the caregiver photo picker.
  if (/[\x00-\x1f\x7f-\x9f]/.test(trimmedUrl) ||
      (/^[a-z][a-z\d+.-]*:/i.test(trimmedUrl) && !/^https?:\/\//i.test(trimmedUrl))) {
    return "";
  }

  if (
    /^https?:\/\//i.test(trimmedUrl)
  ) {
    try {
      const parsed = new URL(trimmedUrl);
      if (!parsed.hostname || parsed.username || parsed.password || trimmedUrl.includes('\\')) return "";
    } catch {
      return "";
    }
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
): BundledAssetSource | null => {
  const parts = getImagePathPartsFromUrl(imageUrl);
  if (!parts) {
    return null;
  }

  const source = appConfig?.offlineImageMap?.[parts.relativeAssetPath] ?? null;
  return typeof source === "number" ? source : null;
};

export const resolveImageSource = ({
  imageUrl,
  defaultImage,
}: {
  imageUrl?: string | null;
  defaultImage: ImageSourcePropType;
}): ResolveImageSourceResult => {
  const normalizedUrl = normalizeUrl(imageUrl);

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

export const getHtmlOfflineImageSource = (
  src?: string,
  offlineImageMap?: Record<string, any>
): any => {
  if (typeof src !== 'string' || !src || !offlineImageMap) {
    return null;
  }

  let cleanSrc = src;

  // Remove query params, e.g. ?itok=...
  cleanSrc = cleanSrc.split("?")[0];

  // Decode URL encoded characters
  cleanSrc = safeDecode(cleanSrc);

  // Normalize slashes
  cleanSrc = cleanSrc.replace(/\\/g, "/");

  /**
   * Example:
   * https://cms.com/sites/default/files/2025-10/pregnancy-w1.jpg
   * becomes:
   * 2025-10/pregnancy-w1.jpg
   */
  const match = cleanSrc.match(/(\d{4}-\d{2}\/[^/]+)$/);

  if (!match || !match[1]) {
    return null;
  }

  const offlineKey = match[1];

  return offlineImageMap[offlineKey] ?? null;
};
