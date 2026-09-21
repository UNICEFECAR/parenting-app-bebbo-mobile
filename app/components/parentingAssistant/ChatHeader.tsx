/**
 * Powder-blue page header for the Parenting Assistant screen:
 * hearts logo, title with BETA pill, subtitle, "new conversation"
 * and close buttons (mirrors .chat-app-header in the reference HTML).
 */
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Svg, { G, Path } from "react-native-svg";
import { chatConfig } from "./chatConfig";
import { chatBetaGradient, chatCard, chatHeaderBg, chatInk, chatLogoBorder, chatSubtitle } from "@styles/style";
import { chatHeartsLogoBig, chatHeartsLogoSmall } from "../../instances/reraiUmntwana/styles/style";

const styles = StyleSheet.create({
  header: {
    backgroundColor: chatHeaderBg,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 17,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 80, // space for the two round buttons
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: chatCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: chatLogoBorder,
    marginRight: 13,
    shadowColor: chatInk,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  heading: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  title: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
    fontSize: 19,
    fontWeight: "600",
    lineHeight: 23,
    color: chatInk,
  },
  betaPill: {
    width: 44,
    height: 18,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  betaText: {
    fontSize: 9,
    fontWeight: "800",
    color: chatInk,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12.5,
    lineHeight: 18,
    color: chatSubtitle,
  },
  buttonsRow: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
  },
  roundButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(36, 67, 94, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});

const HeartsLogo = (): any => (
  <Svg width={30} height={26} viewBox="0 0 56 48" fill="none">
    <Path
      d="M22 42C13 35 4 27.4 4 17.6 4 10.6 9.4 5 16.2 5c3.6 0 6.6 1.6 8.8 4.2C27.2 6.6 30.2 5 33.8 5 40.6 5 46 10.6 46 17.6c0 9.8-9 17.4-18 24.4l-3 2.4-3-2.4z"
      fill={chatHeartsLogoBig}
    />
    <G transform="rotate(24 41 34)">
      <Path
        d="M41 44.5c-5.4-4.2-10.8-8.8-10.8-14.6 0-4.2 3.2-7.5 7.3-7.5 2.1 0 3.9 1 5.2 2.5 1.3-1.5 3.1-2.5 5.2-2.5 4.1 0 7.3 3.3 7.3 7.5 0 5.8-5.4 10.4-10.8 14.6l-1.7 1.3-1.7-1.3z"
        fill={chatHeartsLogoSmall}
        fillOpacity={0.88}
      />
    </G>
  </Svg>
);

interface ChatHeaderProps {
  busy: boolean;
  onClose: () => void;
  onNewConversation: () => void;
}

const ChatHeader = ({ busy, onClose, onNewConversation }: ChatHeaderProps): any => {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <View style={styles.logo}>
          <HeartsLogo />
        </View>
        <View style={styles.heading}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{chatConfig.strings.title}</Text>
            <View style={{ marginLeft: 8 }}>
              <LinearGradient
                colors={chatBetaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.betaPill}
              >
                <Text style={styles.betaText}>
                  {chatConfig.strings.beta}
                </Text>
              </LinearGradient>
            </View>
          </View>
          <Text style={styles.subtitle}>{chatConfig.strings.subtitle}</Text>
        </View>
      </View>
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.roundButton}
          activeOpacity={busy ? 0.3 : 0.7}
          disabled={busy}
          onPress={onNewConversation}
          accessibilityLabel="Start a new conversation"
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 11A8 8 0 1 0 12 20"
              stroke={chatInk}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
            <Path
              d="M20 4v7h-7"
              stroke={chatInk}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.roundButton}
          activeOpacity={0.7}
          onPress={onClose}
          accessibilityLabel="Close chat"
        >
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 6l12 12M18 6L6 18"
              stroke={chatInk}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatHeader;
