import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Text } from 'react-native';
import downloadImages from '../downloadImages/ImageStorage';
import RNFS from 'react-native-fs';
import { useFocusEffect } from '@react-navigation/native';
import { DefaultImage } from '@components/shared/Image';
import FastImage from 'react-native-fast-image';
import { useAppSelector } from '../../App';
const LoadableImage = (props:any) => {
  const [imageState, setImageState] = useState('loading');
  const [noImage, setNoImage] = useState(false);
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
    const { style,item } = props
    // console.log(item.id, "..id..")
    const downloadImage = async (item:any) => {
      // console.log(item['cover_image'],"..item..");
      // console.log(toggleSwitchVal,"..download iamgetoggleSwitchVal..")
      // if(toggleSwitchVal==true){
      //   setNoImage(true);
      // }
      // else{
      if (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined) {
        // console.log(item,"..11item..");
        if (await RNFS.exists(RNFS.DocumentDirectoryPath + '/content' + '/' + item['cover_image']?.url.split('/').pop())) {
          // console.log("..22item..");
          setImageState('loaded');
        }
        else {
          // console.log(item,"..33item..");
          if(toggleSwitchVal==true){
            setImageState('loaded'); // This worked for me
            setNoImage(true);
          }
          else{
          setImageState('loading');
          let imageArray: any = [];
          imageArray.push({
            srcUrl: item['cover_image'].url,
            destFolder: RNFS.DocumentDirectoryPath + '/content',
            destFilename: item['cover_image'].url.split('/').pop()
          })
          // console.log(imageArray, "..imageArray..");
          // if(toggleSwitchVal==false){
          const imagesDownloadResult = await downloadImages(imageArray);
          if(imagesDownloadResult && imagesDownloadResult.length>0 && imagesDownloadResult[0].success==true){
            setNoImage(false);
            setImageState('loaded');
          }
          // console.log(imagesDownloadResult, "..imagesDownloadResult..");
          }
          // }
          // else{
          //   console.log("..Data Saver on..");
          // }
        }
      }
      //}
    }
    const onLoadEnd = () => {
      console.log("loading false");
      // setLoading(false);
    }
    const onLoadError = () => {
      // setNoImage(true)
  
    }
    useFocusEffect(
      React.useCallback(() => {
        async function fetchData() {
          // console.log("..11111.......",item.id)
          // setImageState('loading');
          downloadImage(item)
        }
        fetchData()
        
      },[])
    );
    useEffect(() => {
     return () => {
        setImageState(''); // This worked for me
        setNoImage(true);
      };
  }, []);
    
    return (
      <>
        <View style={styles.container}>
        {
        (item && item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined)?
        
      (
        imageState=='loading'?
        <ActivityIndicator style={style} size="large" color="#000"/>
        :noImage==false && imageState=='loaded'?<FastImage  
         onError={() => { setNoImage(true) }}
         style={style} source={{uri:encodeURI("file://" + destinationFolder + item.cover_image?.url.split('/').pop()),priority: FastImage.priority.normal}} 
         resizeMode={FastImage.resizeMode.cover}/>:<DefaultImage
         style={style}
         source={require('@assets/trash/defaultArticleImage.png')}/> 
         )
        :
        <DefaultImage
        style={style}
        source={require('@assets/trash/defaultArticleImage.png')}/>   
        }
        </View>        
      </>
    );
}
export default React.memo(LoadableImage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
});
