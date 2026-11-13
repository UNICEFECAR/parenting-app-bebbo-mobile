import {
  ADVICE_SHARED,
  FAVOURITE_ADVICE_ADDED,
  FAVOURITE_GAME_ADDED,
  GAME_SHARED,
} from "@assets/data/firebaseEvents";
import { appConfig } from "../../instances";
import { Heading4 } from "@styles/typography";
import React, {useRef} from "react";
import { useTranslation } from "react-i18next";
import { Alert, Share, StyleSheet, View, Text } from "react-native";
import styled from "styled-components/native";
import { store, useAppDispatch, useAppSelector } from "../../../App";
import {
  setFavouriteAdvices,
  setFavouriteGames,
} from "../../redux/reducers/childSlice";
import { FDirRow } from "./FlexBoxStyle";
import Icon, { OuterIconRow, OuterIconLeft1 } from "./Icon";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { logEvent } from "../../services/EventSyncService";
import { selectActiveChildUuid } from "../../services/selectors";
import {toggleBookmark} from "../../services/bookmarks";
export const ShareFavBox = styled.View`
  flex-direction: row;
  padding: 5px 10px 0;
  justify-content: space-between;
  align-items: center;
`;
export const ShareFavPress = styled.Pressable`
  flex: 1;
  padding: 12px 0px;
`;
const styles = StyleSheet.create({
  alignItemsFlexEnd: { alignItems: "flex-end" },
  flexShrink1: { flexShrink: 1 },
});
const ShareFavButtons = React.memo((props: any) => {
  const netInfo = useNetInfoHook();
  const activeChilduuid = useAppSelector(selectActiveChildUuid);
  const bookmarkBusy = useRef(false);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { backgroundColor, item, isAdvice, isFavourite, fromScreen } = props;

  const onShare = async (): Promise<any> => {
    const suburl = isAdvice ? "/article/" : "/activity/";
    const mainUrl = appConfig.shareTextButton + languageCode + suburl + item.id;
    console.log("onshare click");
    try {
      const result = await Share.share({
        message: item.title + "\n" + t("appShareText") + "\n" + mainUrl,
      });
      console.log("onshare click1", result);
      if (result.action === Share.sharedAction) {
        console.log("onshare click1", item?.id);
        if (isAdvice) {
          const adviceEventData = {
            name: ADVICE_SHARED,
            params: { advise_id: item?.id },
          };
          logEvent(adviceEventData, netInfo.isConnected);
        } else {
          const gameEventData = {
            name: GAME_SHARED,
            params: { game_id: item?.id },
          };
          logEvent(gameEventData, netInfo.isConnected);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(t("generalError"));
    }
  };
  const onFavClick = async (): Promise<void> => {
    if (bookmarkBusy.current) return;
    bookmarkBusy.current = true;
    const childId = activeChilduuid;
    try {
      const result = await toggleBookmark(childId, item?.id, Boolean(isAdvice));
      // A profile switch while the native write is pending must not replace the
      // newly selected child's visible bookmarks with the previous child's list.
      if (selectActiveChildUuid(store.getState()) === childId) {
        dispatch(isAdvice ? setFavouriteAdvices(result.ids) : setFavouriteGames(result.ids));
      }
      const eventName = isAdvice
        ? (result.added ? FAVOURITE_ADVICE_ADDED : 'favourite_advise_removed')
        : (result.added ? FAVOURITE_GAME_ADDED : 'favourite_game_removed');
      void logEvent({name: eventName, params: isAdvice ? {advise_id: item?.id} : {game_id: item?.id}}, netInfo.isConnected);
    } catch {
      Alert.alert(t("generalError"));
    } finally {
      bookmarkBusy.current = false;
    }
  };
  const unFavHandler = onFavClick;
  return (
    <>
      <ShareFavBox style={{ backgroundColor: backgroundColor }}>
        <ShareFavPress onPress={(): any => onShare()}>
          <FDirRow>
            <OuterIconRow>
              <OuterIconLeft1>
                <Icon name="ic_sb_shareapp" size={25} color="#000" />
              </OuterIconLeft1>
            </OuterIconRow>
            <Heading4 style={styles.flexShrink1} numberOfLines={1}>
              {t("actScreenshareText")}
            </Heading4>
          </FDirRow>
        </ShareFavPress>

        {isFavourite ? (
          fromScreen && fromScreen == "Favourites" ? (
            <ShareFavPress
              onPress={(): any => unFavHandler()}
              style={styles.alignItemsFlexEnd}
            >
              <FDirRow>
                <OuterIconRow>
                  <OuterIconLeft1>
                    <Icon name="ic_trash" size={25} color="#000" />
                  </OuterIconLeft1>
                </OuterIconRow>
                <Heading4 style={styles.flexShrink1} numberOfLines={1}>
                  {t("favScreenremoveText")}
                </Heading4>
              </FDirRow>
            </ShareFavPress>
          ) : (
            <ShareFavPress
              onPress={(): any => unFavHandler()}
              style={styles.alignItemsFlexEnd}
            >
              <View style={{ flex: 1.7 }}>
                <FDirRow>
                  <OuterIconRow>
                    <OuterIconLeft1>
                      <Icon
                        name="ic_sb_favorites_filled"
                        size={25}
                        color="#000"
                      />
                    </OuterIconLeft1>
                  </OuterIconRow>
                  <Heading4 style={styles.flexShrink1} numberOfLines={1}>
                    {t("actScreenremovetoFavText")}
                  </Heading4>
                </FDirRow>
              </View>
            </ShareFavPress>
          )
        ) : fromScreen && fromScreen == "Favourites" ? null : (
          <ShareFavPress
            onPress={(): any => onFavClick()}
            style={styles.alignItemsFlexEnd}
          >
            <FDirRow>
              <OuterIconRow>
                <OuterIconLeft1>
                  <Icon name="ic_sb_favorites" size={25} color="#000" />
                </OuterIconLeft1>
              </OuterIconRow>
              <Heading4 style={styles.flexShrink1} numberOfLines={1}>
                {t("actScreenaddtoFavText")}
              </Heading4>
            </FDirRow>
          </ShareFavPress>
        )}
      </ShareFavBox>
    </>
  );
});
export default ShareFavButtons;
