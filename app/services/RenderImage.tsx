import React,{ useEffect, useState } from "react";
import { Dimensions, Image, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import LoadableImage from "./LoadableImage";

const RenderImage = ({ uri,itemnew,toggleSwitchVal }:any) => {
    console.log(itemnew,"..itemnew")
    const [ imageSize, setImageSize ] = useState<any>({})
  
    useEffect(() => {
      Image.getSize(uri, (width, height) => {
        setImageSize({
          width,
          height
        })
      })
    }, [])
  
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