/**
 * A single chat bubble. Bot bubbles are white cards with a thin border
 * and a tucked bottom-left corner; user bubbles are pastel blue with a
 * tucked bottom-right corner (mirrors the .chat-message CSS).
 * Bot replies render markdown; error bubbles show a retry chip.
 */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { chatConfig } from "./chatConfig";
import ChatMarkdown from "./chatMarkdown";
import { chatTheme } from "./chatTheme";
import { ChatMessage } from "./chatTypes";
import SourceCards from "./SourceCards";
import TypingIndicator from "./TypingIndicator";

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: 14 },
  rowUser: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bot: {
    backgroundColor: chatTheme.card,
    borderWidth: 1,
    borderColor: chatTheme.line,
    borderBottomLeftRadius: 5,
    shadowColor: "#1F2E3D",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  user: {
    backgroundColor: chatTheme.userBubble,
    borderBottomRightRadius: 5,
  },
  userText: {
    color: chatTheme.userText,
    fontSize: 15,
    lineHeight: 23,
  },
  retryChip: {
    alignSelf: "flex-start",
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: chatTheme.blue,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "600",
    color: chatTheme.blue,
  },
});

interface MessageBubbleProps {
  busy: boolean;
  message: ChatMessage;
  onRetry?: () => void;
  responseRef?: React.Ref<View>;
}

export const TypingBubble = (): any => (
  <View style={styles.row}>
    <View style={[styles.bubble, styles.bot]}>
      <TypingIndicator />
    </View>
  </View>
);

const MessageBubble = ({
  busy,
  message,
  onRetry,
  responseRef,
}: MessageBubbleProps): any => {
  if (message.role === "user") {
    return (
      <View style={[styles.row, styles.rowUser]}>
        <View style={[styles.bubble, styles.user]}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
    );
  }
  return (
    <>
      <View ref={responseRef} style={styles.row}>
        <View style={[styles.bubble, styles.bot]}>
          <ChatMarkdown text={message.text} busy={busy} />
          {message.isError && onRetry ? (
            <TouchableOpacity
              style={styles.retryChip}
              activeOpacity={0.7}
              onPress={onRetry}>
              <Text style={styles.retryText}>{chatConfig.strings.retry}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {message.sources && message.sources.length > 0 ? (
        <SourceCards sources={message.sources} busy={busy} />
      ) : null}
    </>
  );
};

export default MessageBubble;