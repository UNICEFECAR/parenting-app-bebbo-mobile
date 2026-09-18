/**
 * Tappable "source" cards rendered below a bot reply, built from the
 * trailing "**Sources:**" markdown list (see chatMarkdown.splitSources).
 * Rendered only when the API reply actually contains sources.
 *
 * Styled after .chat-source-card in the reference CSS: white card,
 * light border, and a 4px cyan accent strip on the left edge. The
 * strip is a dedicated View (not a left border) because React Native
 * renders mixed border colours + radii unreliably.
 *
 * Source URLs are relative ("article/7516" / "activity/9491") and
 * open in-app on DetailsScreen (see chatLinks.ts).
 */
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { ThemeContext } from "styled-components";
import { chatConfig } from "./chatConfig";
import { openChatLink } from "./chatLinks";
import { chatTheme } from "./chatTheme";
import { ChatSource } from "./chatTypes";

const styles = StyleSheet.create({
  wrap: {
    maxWidth: "82%",
    marginTop: -4,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: chatTheme.textSoft,
    paddingLeft: 4,
    marginBottom: 7,
  },
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: chatTheme.card,
    borderWidth: 1,
    borderColor: chatTheme.line,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    marginBottom: 7,
    overflow: "hidden",
  },
  accentBar: {
    width: 4,
    backgroundColor: chatTheme.accent, // --um-accent cyan strip
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 11,
  },
  title: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "700",
    lineHeight: 18,
    color: chatTheme.text,
    marginRight: 10,
  },
});

interface SourceCardsProps {
  sources: ChatSource[];
  busy: boolean;
}

const SourceCards = ({ sources, busy }: SourceCardsProps): any => {
  const navigation = useNavigation<any>();
  const themeContext = useContext<any>(ThemeContext);

  if (!sources || sources.length === 0) {
    return null;
  }
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{chatConfig.strings.sourcesLabel}</Text>
      {sources.map((source, index) => (
        <TouchableOpacity
          key={`source-${index}-${source.url}`}
          style={styles.card}
          activeOpacity={0.7}
          disabled={busy}
          onPress={(): void => {
            openChatLink(navigation, source.url, {
              activityHeaderColor: themeContext?.colors?.ACTIVITIES_COLOR,
              activityBackgroundColor:
                themeContext?.colors?.ACTIVITIES_TINTCOLOR,
            });
          }}
        >
          <View style={styles.accentBar} />
          <View style={styles.cardContent}>
            <Text style={styles.title} numberOfLines={2}>
              {source.title}
            </Text>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M7 17 17 7M7 7h10v10"
                stroke={chatTheme.textSoft}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SourceCards;
