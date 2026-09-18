/**
 * Lightweight markdown renderer for chatbot replies.
 *
 * Supports the subset the n8n AI agent produces:
 *   paragraphs, **bold**, *italic*, [links](https://...),
 *   "- " / "* " bullet lists, "1. " numbered lists, # headings.
 *
 * Also extracts a trailing "**Sources:**" markdown list into
 * structured data so the screen can render tappable source cards
 * (mirrors the "sources enhancer" script in the reference HTML).
 *
 * Links to Bebbo articles/activities open in-app on DetailsScreen
 * (see chatLinks.ts); other URLs open in the browser.
 */
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeContext } from "styled-components";
import { openChatLink } from "./chatLinks";
import { chatTheme } from "./chatTheme";
import { ChatSource } from "./chatTypes";

const styles = StyleSheet.create({
  paragraph: {
    color: chatTheme.text,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 8,
  },
  lastBlock: { marginBottom: 0 },
  bold: { fontWeight: "700" },
  italic: { fontStyle: "italic" },
  link: {
    color: chatTheme.blue,
    textDecorationLine: "underline",
  },
  listRow: { flexDirection: "row", marginBottom: 5 },
  listMarker: {
    color: chatTheme.text,
    fontSize: 15,
    lineHeight: 23,
    width: 18,
    fontWeight: "700",
  },
  listNumber: {
    color: chatTheme.text,
    fontSize: 15,
    lineHeight: 23,
    minWidth: 22,
    fontWeight: "700",
  },
  listText: { flex: 1 },
  listBlock: { marginBottom: 8 },
  heading: {
    color: chatTheme.text,
    fontSize: 15.5,
    lineHeight: 23,
    fontWeight: "700",
    marginBottom: 8,
  },
});

/** Renders inline markdown (**bold**, *italic*, [links]) inside a Text. */
const renderInline = (
  text: string,
  keyPrefix: string,
  onLinkPress: (url: string) => void,
  busy: boolean
): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  const inlineRegex =
    /\[([^\]]+)\]\(([^)\s]+)\)|(\*\*|__)([\s\S]+?)\3|(\*|_)([^*_\n]+)\5/g;
  let lastIndex = 0;
  let index = 0;
  let match = inlineRegex.exec(text);
  while (match) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      const url = match[2];
      nodes.push(
        <Text
          key={`${keyPrefix}-lnk-${index}`}
          style={styles.link}
          onPress={busy ? undefined : () => onLinkPress(url)}
        >
          {match[1]}
        </Text>
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <Text key={`${keyPrefix}-b-${index}`} style={styles.bold}>
          {renderInline(match[4], `${keyPrefix}-b-${index}`, onLinkPress,busy)}
        </Text>
      );
    } else if (match[6] !== undefined) {
      nodes.push(
        <Text key={`${keyPrefix}-i-${index}`} style={styles.italic}>
          {match[6]}
        </Text>
      );
    }
    lastIndex = match.index + match[0].length;
    index = index + 1;
    match = inlineRegex.exec(text);
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
};

const BULLET_RE = /^\s*[-*+]\s+(.*)$/;
const NUMBER_RE = /^\s*(\d+)[.)]\s+(.*)$/;
const HEADING_RE = /^\s*#{1,6}\s+(.*)$/;

interface ChatMarkdownProps {
  busy: boolean;
  text: string;
  textColor?: string;
}

const ChatMarkdown = ({ text, textColor, busy }: ChatMarkdownProps): any => {
  const navigation = useNavigation<any>();
  const themeContext = useContext<any>(ThemeContext);
  const normalizedText = `${(text || "").trim()}\u00A0`;
  const blocks = normalizedText.split(/\n{2,}/);
  const colorStyle = textColor ? { color: textColor } : null;

  const onLinkPress = (url: string): void => {
    openChatLink(navigation, url, {
      activityHeaderColor: themeContext?.colors?.ACTIVITIES_COLOR,
      activityBackgroundColor: themeContext?.colors?.ACTIVITIES_TINTCOLOR,
    });
  };

  const rendered = blocks.map((block, blockIndex) => {
    const isLast = blockIndex === blocks.length - 1;
    const lines = block.split("\n").filter((line) => line.trim().length > 0);
    const isBulletList =
      lines.length > 0 && lines.every((line) => BULLET_RE.test(line));
    const isNumberList =
      lines.length > 0 && lines.every((line) => NUMBER_RE.test(line));

    if (isBulletList || isNumberList) {
      return (
        <View
          key={`blk-${blockIndex}`}
          style={[styles.listBlock, isLast && styles.lastBlock]}
        >
          {lines.map((line, lineIndex) => {
            const parsedBullet = BULLET_RE.exec(line);
            const parsedNumber = NUMBER_RE.exec(line);
            const content = isBulletList
              ? (parsedBullet as RegExpExecArray)[1]
              : (parsedNumber as RegExpExecArray)[2];
            return (
              <View key={`li-${blockIndex}-${lineIndex}`} style={styles.listRow}>
                {isBulletList ? (
                  <Text style={[styles.listMarker, colorStyle]}>{"•"}</Text>
                ) : (
                  <Text style={[styles.listNumber, colorStyle]}>
                    {(parsedNumber as RegExpExecArray)[1]}.
                  </Text>
                )}
                <Text
                  style={[
                    styles.paragraph,
                    styles.lastBlock,
                    styles.listText,
                    colorStyle,
                  ]}
                >
                  {renderInline(
                    content,
                    `li-${blockIndex}-${lineIndex}`,
                    onLinkPress,
                    busy
                  )}
                </Text>
              </View>
            );
          })}
        </View>
      );
    }

    const headingMatch = lines.length === 1 ? HEADING_RE.exec(lines[0]) : null;
    if (headingMatch) {
      return (
        <Text
          key={`blk-${blockIndex}`}
          style={[styles.heading, isLast && styles.lastBlock, colorStyle]}
        >
          {renderInline(headingMatch[1], `h-${blockIndex}`, onLinkPress,busy)}
        </Text>
      );
    }

    return (
      <Text
        key={`blk-${blockIndex}`}
        style={[styles.paragraph, isLast && styles.lastBlock, colorStyle]}
      >
        {renderInline(lines.join("\n"), `p-${blockIndex}`, onLinkPress,busy)}
      </Text>
    );
  });

  return <View>{rendered}</View>;
};

export default ChatMarkdown;
