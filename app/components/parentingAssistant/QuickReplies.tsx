/**
 * Suggested-question chips shown above the input
 * (mirrors .chat-quick-replies in the CSS).
 *
 * The questions come exclusively from the API response
 * ("suggestedquestions": [{ label, question }]) — the chip shows the
 * label and sends the question. Rendered only when the API (or the
 * init-failure fallback) provides them.
 */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { chatTheme } from "./chatTheme";
import { ChatSuggestedQuestion } from "./chatTypes";

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 17,
    paddingTop: 10,
    backgroundColor: chatTheme.card,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: chatTheme.blue,
    borderRadius: 999,
    backgroundColor: chatTheme.card,
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: chatTheme.blue,
  },
});

interface QuickRepliesProps {
  questions: ChatSuggestedQuestion[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

const QuickReplies = ({
  questions,
  onSelect,
  disabled,
}: QuickRepliesProps): any => {
  if (!questions || questions.length === 0) {
    return null;
  }
  return (
    <View style={styles.wrap}>
      {questions.map((item, index) => (
        <TouchableOpacity
          key={`chip-${index}-${item.question}`}
          style={styles.chip}
          activeOpacity={0.7}
          disabled={disabled}
          onPress={(): void => onSelect(item.question)}
        >
          <Text style={styles.chipText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuickReplies;
