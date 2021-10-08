import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatusBarHeight } from '../services/StatusBarHeight';
const FocusAwareStatusBar = (props: any) => {
  if(Platform.OS === 'android') {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar  {...props} /> : null;

  }else{
    const insets = useSafeAreaInsets();
    console.log(getStatusBarHeight(0),"MAYUR")
    const heightValue =  getStatusBarHeight(0)>20?0:0
    return (
      <View style={{ height: heightValue, backgroundColor:props.backgroundColor }}>
         <StatusBar
           animated={true}
          {...props}/>
      </View>
    );
  }
}
export default FocusAwareStatusBar;