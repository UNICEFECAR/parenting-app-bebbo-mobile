/**
 * Message composer: rounded input on a white footer with a circular
 * cyan send button (mirrors the .chat-input CSS).
 */
import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { chatConfig } from "./chatConfig";
import { chatAccent, chatBlue, chatCard, chatDisabled, chatLine, chatSurface, chatText, chatTextSoft } from "@styles/style";

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: chatCard,
    borderTopWidth: 1,
    borderTopColor: chatLine,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 124,
    backgroundColor: chatSurface,
    borderWidth: 1.5,
    borderColor: chatLine,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingTop: 13,
    paddingBottom: 13,
    fontSize: 15,
    color: chatText,
    marginRight: 10,
  },
  inputFocused: { borderColor: chatBlue },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: chatAccent,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: { backgroundColor: chatDisabled },
});

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps): any => {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const canSend = !disabled && text.trim().length > 0;

  const handleSend = (): void => {
    const trimmed = text.trim();
    if (!canSend || trimmed.length === 0) {
      return;
    }
    setText("");
    onSend(trimmed);
  };

  return (
    <View style={styles.footer}>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        value={text}
        onChangeText={setText}
        placeholder={chatConfig.strings.inputPlaceholder}
        placeholderTextColor={chatTextSoft}
        multiline
        onFocus={(): void => setFocused(true)}
        onBlur={(): void => setFocused(false)}
        editable={!disabled}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        submitBehavior="submit"
      />
      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        activeOpacity={0.8}
        disabled={!canSend}
        onPress={handleSend}
        accessibilityLabel="Send message"
      >
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
