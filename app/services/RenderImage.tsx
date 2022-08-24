import React from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import LoadableImage from "./LoadableImage";

const styles = StyleSheet.create({
  containerView: {
    height: 200,
    width: '100%'
  },
  loadableImageStyle:{
    height: '100%',
    width: '100%'
  }
})
const RenderImage = ({ uri, itemnew, toggleSwitchVal }: any):any => {
  console.log("uri--", uri);
  return (
    <><View
      style={styles.containerView}
    ><LoadableImage style={styles.loadableImageStyle} item={itemnew} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.contain} /></View></>

  )
}
export default RenderImage;