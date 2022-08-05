import React from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import LoadableImage from "./LoadableImage";

const RenderImage = ({ uri,itemnew,toggleSwitchVal }:any) => {
    return (
       <><View 
       style={{
          width: '100%',
          height: 200
          }}
     ><LoadableImage style={{ 
      height: '100%',
      width: '100%'
    }} item={itemnew} toggleSwitchVal={toggleSwitchVal}  resizeMode={FastImage.resizeMode.contain}/></View></>
        
    )
  }
  export default RenderImage;