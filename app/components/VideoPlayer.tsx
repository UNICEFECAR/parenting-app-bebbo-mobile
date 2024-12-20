// import { videoTypeImage, videoTypeVimeo, videoTypeYoutube } from "@assets/translations/appOfflineData/apiConstants";
import { appConfig } from "../instance";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import YoutubePlayer from "react-native-youtube-iframe";
import { getVimeoId, getYoutubeId } from "../services/Utils";
import useNetInfoHook from "../customHooks/useNetInfoHook";
const windowWidthstyle = Dimensions.get('window').width;
const styles = StyleSheet.create({
    containerStyle:{
        alignSelf: 'center',
        aspectRatio: 1.75,
        height: windowWidthstyle*0.565,
        width: '100%',
    },
    spinner: {
        alignItems:'center',
        height:windowWidthstyle*0.563,
        justifyContent:'center'
    },
    typeImageImg:{ 
        height:windowWidthstyle*0.565,
        width: '100%'
    },
    typeImageView:{
        flex:1,
        flexDirection:'column',
        height:windowWidthstyle*0.565,
        overflow:'hidden'
    },
    youtubeContainerView:{
        flex:1,
        flexDirection:'column',
        height:windowWidthstyle*0.563,
        overflow:'hidden'
    },
    youtubeLoadingView:{
        alignItems:'center',
        height:windowWidthstyle*0.565,
        justifyContent:'center'
    }
})

const VideoPlayer = (props: any):any => {
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    let videoId: string;
    let videoType = appConfig.videoTypeImage;
    const onReady = useCallback(() => {
      setLoading(false);
    }, []);
    const onError = useCallback(() => {
      setLoading(false);
      videoType = appConfig.videoTypeImage;
    }, []);
    const windowWidth = Dimensions.get('window').width;
    const displaySpinner=():any=>{
        return (
            <View style={styles.spinner}><ActivityIndicator size="large" color="#000" style={{
            }}/></View>
        );
      }
    const netInfo = useNetInfoHook();
    if(props.selectedPinnedArticleData && props.selectedPinnedArticleData != {})
    {
        videoType = props.selectedPinnedArticleData.cover_video && props.selectedPinnedArticleData.cover_video?.site && props.selectedPinnedArticleData?.cover_video?.site != "" ? (props.selectedPinnedArticleData?.cover_video?.site == appConfig.videoTypeVimeo ? appConfig.videoTypeVimeo : appConfig.videoTypeYoutube) : appConfig.videoTypeImage
    }
    if (videoType == appConfig.videoTypeVimeo) {
        videoId = getVimeoId(props.selectedPinnedArticleData?.cover_video?.url)
    } else if (videoType == appConfig.videoTypeYoutube) {
        videoId = getYoutubeId(props.selectedPinnedArticleData?.cover_video?.url)
    }
    const getVimeoHtml = ():any => {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body style="background-color:black">
            <div style="padding:56.25% 0 0 0;position:relative;">
                <iframe
                    src="https://player.vimeo.com/video/${videoId}?autoplay=0&muted=0&loop=0&title=0&byline=0&portrait=0&controls=1"
                    style="position:absolute;top:0;left:0;width:90%;height:100%;padding:0 5%"
                    frameborder="0"
                    allowfullscreen="allowfullscreen"
                    mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"
                ></iframe>
            </div>
            
            <style>
            .vertical-center {
              margin: 0;
              position: absolute;
              top: 50%;
              -ms-transform: translateY(-50%);
              transform: translateY(-50%);
            }
            </style>
            <script src="https://player.vimeo.com/api/player.js"></script>
            
            <script>
                var iframe = document.querySelector('iframe');
                var player = new Vimeo.Player(iframe);
                player.on('ended', () => {
                    window.ReactNativeWebView.postMessage("close_window");
                });
                function playVideo() {
                    player.play();
                    let backdrop = document.getElementById("backdrop");
                    backdrop.style.display = 'none';
                }
                // document.write(\`<button id="playButtonId" style="font-size:50px" onclick="player.play()">Click me</button>\`);
                // document.write(\`
                //     <div id="backdrop" onclick="playVideo()" style="position:absolute; top:0; left:0; bottom:0; right:0; background-color:rgba(0, 0, 0, 0.3);;">
                //         <div class="vertical-center" style="width:100%">
                //             <p style="color:white; font-size:30px; text-align:center; width:100%;">
                //                 Press to play
                //             </p>
                //         </div>
                //     </div>
                // \`);
            </script>
        </body>
        </html>
        `;
    }
    return (
        <>
            {videoType == appConfig.videoTypeImage || netInfo.isConnected == false ?
                ( <View style={styles.typeImageView}><Image
                    source={require('@assets/trash/defaultArticleImage.png')}
                    style={styles.typeImageImg}
                /></View>) :
                (<>{videoType == appConfig.videoTypeVimeo ?
                    <WebView
                        startInLoadingState={true}
                        containerStyle={styles.containerStyle}
                        allowsInlineMediaPlayback={true}
                        originWhitelist={['*']}
                        source={{ html: getVimeoHtml() }}
                        renderLoading={displaySpinner}
                        allowsFullscreenVideo={true}
                    />
                    :
                    <>
                    <View style={styles.youtubeContainerView}>
                    {loading ? <View style={styles.youtubeLoadingView}><ActivityIndicator size="large" color="#000" style={{
                    }}/></View>: null}
                    <YoutubePlayer
                        videoId={videoId}
                        play={playing}
                        height={windowWidth*0.563}
                        onReady={onReady}
                        onError={onError}
                        
                        webViewProps={{
                            allowsInlineMediaPlayback: true,
                            allowsFullscreenVideo: true,
                            androidLayerType: 'hardware',
                            
                        }}
                        initialPlayerParams={{
                             cc_lang_pref: "us",
                            controls: true,
                        }}
                        webViewStyle={{opacity: 0.99}}
                    />
                    </View>
                    </>
                }</>)
            }
        </>
    )
}
export default VideoPlayer

