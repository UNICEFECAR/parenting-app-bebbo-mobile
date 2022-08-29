import React from 'react';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DefaultImage } from '@components/shared/Image';
import FastImage from 'react-native-fast-image';
import { useNetInfo } from '@react-native-community/netinfo';
import { createImageProgress } from './ImageLoad';
const CustomImage = createImageProgress(FastImage);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
const LoadableImage = (props: any):any => {
  const netInfo = useNetInfo();
  const { style, item, toggleSwitchVal, resizeMode } = props;
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData():Promise<any> {
        if (!toggleSwitchVal && netInfo.isConnected == true) {
          if (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined) {
            if (item['cover_image'].url.split('https://')[1] || item['cover_image'].url.split('http://')[1]) {
              FastImage.preload([{
                uri: item['cover_image'].url
              }])
            }
          }
        }
      }
      fetchData()

    }, [netInfo.isConnected])
  );

  return (
    <>
      <View style={styles.container}>

        {
          (item && item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined) ?

            (
              <CustomImage
                source={{
                  uri: item['cover_image'].url,
                  priority: FastImage.priority.high,
                  cache: toggleSwitchVal || netInfo.isConnected == false ? FastImage.cacheControl.cacheOnly : FastImage.cacheControl.immutable
                }}
                style={style}
                resizeMode={resizeMode}
                indicator={():any => <ActivityIndicator
                  size="large" color="#000"
                />}
                renderError={(error: any):any => {
                  console.log("rendererror", error);
                  if (Platform.OS == "android") {
                    return (<DefaultImage
                      style={style}
                      source={require('@assets/trash/defaultArticleImage.png')} />);
                  }
                  else {
                    if (netInfo.isConnected == true) {
                      return (<DefaultImage
                        style={style}
                        source={require('@assets/trash/defaultArticleImage.png')} />);
                    }
                  }
                }
                }
              />
            )
            :
            <DefaultImage
              style={style}
              source={require('@assets/trash/defaultArticleImage.png')} />
        }
      </View>
    </>
  );
}
export default React.memo(LoadableImage);
