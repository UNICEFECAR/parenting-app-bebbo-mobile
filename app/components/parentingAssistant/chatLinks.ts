/**
 * Opens links coming from chatbot replies (source cards and inline
 * markdown links).
 *
 * The API sends source URLs as "<contenttype>/<contentid>", e.g.
 *   "article/7516" or "activity/9491"
 * (absolute share URLs like
 *   https://rerai.umntwana.app/share/zw-sn/article/2916
 * are tolerated too).
 *
 * Articles/activities open in-app on DetailsScreen, using the same
 * navigation parameters as the deep-link handler (`callUrl`) in
 * app/navigation/AppNavigation.tsx. Because DetailsScreen is pushed on
 * the root stack ABOVE the drawer, pressing back returns the user to
 * the chatbot with the conversation still on screen.
 *
 * Anything else opens in the browser, prefixed with the flavour's
 * share base URL (appConfig.shareTextButton, e.g.
 * "https://www.bebbo.app/share/") when the URL is relative — nothing
 * is hardcoded per flavour here.
 */
import { Linking } from "react-native";
import { appConfig } from "../../instances";

const ARTICLE_LINK_RE =
  /(?:^|\/)(?:article|articles|video-article|video-articles)\/(\d+)/i;
const ACTIVITY_LINK_RE =
  /(?:^|\/)(?:activity|activities|games)\/(\d+)/i;

export interface ChatLinkThemeColors {
  activityHeaderColor?: string;
  activityBackgroundColor?: string;
}

/** "article/7516" -> "https://<flavour share base>/article/7516" */
export const toAbsoluteShareUrl = (url: string): string => {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const base = String(appConfig.shareTextButton || "").replace(/\/+$/, "");
  return `${base}/${url.replace(/^\/+/, "")}`;
};

export const openChatLink = (
  navigation: any,
  url: string,
  themeColors?: ChatLinkThemeColors
): void => {
  const articleMatch = ARTICLE_LINK_RE.exec(url);
  if (articleMatch) {
    navigation.navigate("DetailsScreen", {
      fromScreen: "ChatbotArt",
      returnToChatbot: true,
      headerColor: "",
      backgroundColor: "",
      detailData: parseInt(articleMatch[1], 10),
      listCategoryArray: [],
    });
    return;
  }

  const activityMatch = ACTIVITY_LINK_RE.exec(url);
  if (activityMatch) {
    navigation.navigate("DetailsScreen", {
      fromScreen: "ChatbotAct",
      returnToChatbot: true,
      headerColor: themeColors?.activityHeaderColor ?? "",
      backgroundColor: themeColors?.activityBackgroundColor ?? "",
      detailData: parseInt(activityMatch[1], 10),
      listCategoryArray: [],
    });
    return;
  }

  Linking.openURL(toAbsoluteShareUrl(url)).catch(() => {
    // ignore malformed URLs coming back from the model
  });
};

export default openChatLink;
