import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { ThemeContext } from "styled-components/native";
import {
  bgcolorWhite2,
  overlaymodalBackground,
} from "@styles/style";
const OverlayLoadingComponent = ({ loading }: { loading: boolean }) => {
  const themeContext = useContext(ThemeContext);
  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderBox}>
        <ActivityIndicator
          size="large"
          color={themeContext?.colors.PRIMARY_TEXTCOLOR}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: overlaymodalBackground,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loaderBox: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: bgcolorWhite2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default OverlayLoadingComponent;
