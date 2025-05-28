import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import OverlayLoadingComponent from "@components/OverlayLoadingComponent";
import TabScreenHeader from "@components/TabScreenHeader";
import iframe from "@native-html/iframe-plugin";
import {
  bgcolorBlack2,
  bgcolorWhite2,
} from "../../instances/bebbo/styles/style";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import HTML, { RenderHTML } from "react-native-render-html";
import WebView from "react-native-webview";
import { ThemeContext } from "styled-components/native";
import { useAppSelector } from "../../../App";
import RenderImage from "../../services/RenderImage";
import { addSpaceToHtml } from "../../services/Utils";
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  fontStyle: { color: bgcolorBlack2, fontSize: 16 },
  headerView: {
    flexDirection: "row",
    maxHeight: 50,
  },
  innerView: {
    backgroundColor: bgcolorWhite2,
    flexDirection: "column",
    paddingBottom: 15,
  },
  scrollView: { paddingBottom: 100, paddingHorizontal: 10, paddingTop: 20 },
});
const Aboutus = (): any => {
  const themeContext = useContext(ThemeContext);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const { t } = useTranslation();
  const headerColor = themeContext?.colors.PRIMARY_COLOR;
  const headerTextColor = themeContext?.colors.PRIMARY_BLUE_TEXTCOLOR;
  const aboutusdata = useAppSelector(
    (state: any) => state.utilsData.aboutus.body
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth ? state.bandWidthData.lowbandWidth : false
  );

  return (
    <>
      <View style={[styles.flex1, { backgroundColor: headerColor }]}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />

        <View style={styles.innerView}>
          <View style={styles.headerView}>
            <TabScreenHeader
              title={t("aboutUsScreenheaderTitle")}
              headerColor={headerColor}
              textColor={headerTextColor}
              setProfileLoading={setProfileLoading}
            />
          </View>

          <ScrollView contentContainerStyle={styles.scrollView}>
            {aboutusdata != "" ? (
              <RenderHTML
                source={{ html: addSpaceToHtml(aboutusdata) }}
                baseStyle={styles.fontStyle}
                ignoredStyles={["color", "fontSize", "fontFamily"]}
                tagsStyles={{
                  img: { maxWidth: Dimensions.get("window").width - 30 },
                  p: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h1: { marginBottom: 0, marginTop: 10, textAlign: "left" },
                  h2: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h3: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h4: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h5: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  h6: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  span: { marginBottom: 15, marginTop: 0, textAlign: "left" },
                  br: { height: 0 },
                  iframe: { maxWidth: "100%", height: 200 },
                }}
                renderers={{
                  iframe,
                  // img: (attribs:any):any => {
                  //   const { href } = attribs;
                  //   if (href) {
                  //     // Render hyperlink
                  //     return renderLink(attribs);
                  //   }
                  // },
                  // a: (attribs: any): any => {
                  //   const imagePath: any = attribs.src;
                  //   console.log(imagePath, "..imagePath");
                  //   if (imagePath != "" && imagePath != null && imagePath != undefined) {
                  //     const itemnew: any = {
                  //       cover_image: {
                  //         url: imagePath
                  //       }
                  //     };
                  //     return (
                  //       <RenderImage key={imagePath + "/" + Math.random()} uri={imagePath} itemnew={itemnew} toggleSwitchVal={toggleSwitchVal} />

                  //     );
                  //   }
                  // },
                }}
                WebView={() => (
                  <WebView renderToHardwareTextureAndroid={true} />
                )}
                renderersProps={{
                  iframe: { webViewProps: { allowsFullscreenVideo: true } },
                }}
              />
            ) : null}
          </ScrollView>
        </View>
        <OverlayLoadingComponent loading={profileLoading} />
      </View>
    </>
  );
};
export default Aboutus;
