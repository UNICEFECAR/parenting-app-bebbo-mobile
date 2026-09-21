/**
 * Floating action button that opens the Parenting Assistant chatbot.
 *
 * Rendered on the Home screen, bottom-right, above the tab bar.
 * The chatbot needs connectivity (n8n webhook), so the button is
 * only visible while the device is online — it disappears in
 * offline mode, matching the app's OfflineBar behaviour.
 *
 * Styled after the n8n chat toggle from the reference design:
 * 60px cyan circle (--chat--toggle--size / --um-accent).
 */
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { chatAccent, chatInk } from "@styles/style";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: chatAccent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: chatInk,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});

/* Chat bubble with a heart inside, in white */
const ChatHeartIcon = (): any => (
  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 14.3c-1.6-1.2-3.2-2.6-3.2-4.3 0-1.2 1-2.2 2.2-2.2.6 0 1.2.3 1.6.8.4-.5 1-.8 1.6-.8 1.2 0 2.2 1 2.2 2.2 0 1.7-1.6 3.1-3.2 4.3l-.6.5-.6-.5z"
      fill="#FFFFFF"
    />
  </Svg>
);

const ChatFloatingButton = (): any => {
  const navigation = useNavigation<any>();
  const netInfo = useNetInfoHook();

  // online only: the assistant cannot answer without a connection
  if (netInfo.isConnected !== true) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.fab}
      activeOpacity={0.8}
      accessibilityLabel="Open Parenting Assistant chatbot"
      accessibilityRole="button"
      onPress={(): void => {
        navigation.navigate("ParentingAssistant");
      }}
    >
      <ChatHeartIcon />
    </TouchableOpacity>
  );
};

export default ChatFloatingButton;
