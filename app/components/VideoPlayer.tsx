import { videoTypeImage, videoTypeVimeo, videoTypeYoutube } from "@assets/translations/appOfflineData/apiConstants";
// import { useNetInfo } from "@react-native-community/netinfo";
import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Image, Text, View } from "react-native";
import WebView from "react-native-webview";
import YoutubePlayer from "react-native-youtube-iframe";
import { getVimeoId, getYoutubeId } from "../services/Utils";
import NetInfo from "@react-native-community/netinfo";
import useNetInfoHook from "../customHooks/useNetInfoHook";
import { color } from "react-native-reanimated";


const VideoPlayer = (props: any) => {
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const onReady = useCallback(() => {
      setLoading(false);
    }, []);
    const onError = useCallback(() => {
      setLoading(false);
    }, []);
  
    // const netInfo = useNetInfo();
    // useEffect(() => {
    // const unsubscribe = NetInfo.addEventListener((data) => {
    //     console.log(data);
    // });
    // return () => {
    //     unsubscribe();
    // };
    // }, []);
    const displaySpinner=()=>{
        return (
            <View style={{height:200}}><ActivityIndicator size="large" color="#000" style={{
                position:'absolute',top:0,left:0,bottom:50,right:0,alignItems:'center',justifyContent:'center'
            }}/></View>
        );
      }

    const netInfoval = useNetInfoHook();
    // console.log(netInfoval,"--netInfo");
    let videoId: string;
    console.log("video player", props.selectedPinnedArticleData);
    let videoType = videoTypeImage;
    if(props.selectedPinnedArticleData && props.selectedPinnedArticleData != {})
    {
        videoType = props.selectedPinnedArticleData.cover_video && props.selectedPinnedArticleData.cover_video?.site && props.selectedPinnedArticleData?.cover_video?.site != "" ? (props.selectedPinnedArticleData?.cover_video?.site == videoTypeVimeo ? videoTypeVimeo : videoTypeYoutube) : videoTypeImage
    }
    // if(props.selectedPinnedArticleData && props.selectedPinnedArticleData != {})
    // {
    //     if(props.selectedPinnedArticleData.cover_video)
    // }
    // const videoType = props.selectedPinnedArticleData?.cover_video?.site != "" ? (props.selectedPinnedArticleData?.cover_video?.site == videoTypeVimeo ? videoTypeVimeo : videoTypeYoutube) : videoTypeImage;
    console.log(videoType,"--videoType");
    if (videoType == videoTypeVimeo) {
        videoId = getVimeoId(props.selectedPinnedArticleData?.cover_video?.url)
    } else if (videoType == videoTypeYoutube) {
        videoId = getYoutubeId(props.selectedPinnedArticleData?.cover_video?.url)
    }
    // const onStateChange = useCallback((state) => {
    //     if (state === "ended") {
    //       setPlaying(false);
    //       Alert.alert("video has finished playing!");
    //     }
    //   }, []);
    // const {width} = Dimensions.get('screen');

    const getVimeoHtml = () => {
        // const screenParams = this.props.navigation.state.params!;
        // allow="autoplay; fullscreen"
        //             allowfullscreen
        //const videoId = "274037244";
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
            {videoType == videoTypeImage || netInfoval == false ?
                (<Image
                    source={require('@assets/trash/defaultArticleImage.png')}
                    style={{ width: '100%',height:'auto',minHeight:200}}
                />) :
                (<>{videoType == videoTypeVimeo ?
                    <WebView
                        startInLoadingState={true}
                        containerStyle={{
                            width: '80%',
                            height: 200,
                            aspectRatio: 1.75,
                            alignSelf: 'center',
                            // aspectRatio: this.state.aspectRatio,
                            // borderWidth: 5, borderColor: 'blue',
                        }}
                        allowsInlineMediaPlayback={true}
                        originWhitelist={['*']}
                        source={{ html: getVimeoHtml() }}
                        onMessage={(event) => {
                            // if (event.nativeEvent.data === 'close_window') {
                            //     this.goBack();
                            // }
                        }}
                        renderLoading={displaySpinner}
                    />
                    :
                    <>
                    <View style={{flex:1,flexDirection:'column',height:200,overflow:'hidden'}}>
                    {loading ? <View style={{height:200,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" color="#000" style={{
                    }}/></View>: null}
                    <YoutubePlayer
                        // width={width}
                        // height={this.state.containerWidth / this.state.aspectRatio}
                        videoId={videoId}
                        play={playing}
                        height={200}
                        onReady={onReady}
                        onError={onError}
                        //   onChangeState={onStateChange}
                        // volume={50}
                        // webViewStyle={{borderWidth:3, borderColor:'red'}}
                        // @ts-ignore
                        webViewProps={{
                            // allowsFullscreenVideo: false
                            allowsInlineMediaPlayback: true,
                            allowsFullscreenVideo: true,
                            androidLayerType: 'hardware',
                        }}
                        // webViewStyle={{}}
                        initialPlayerParams={{
                            // preventFullScreen: true,
                            cc_lang_pref: "us",
                            controls: true,
                            // showClosedCaptions: false,
                        }}
                    // webViewStyle={{
                    //   width,
                    // }}
                    />
                    </View>
                    </>
                }</>)
            }
        </>
    )
}

export default VideoPlayer