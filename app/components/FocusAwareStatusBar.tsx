import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStatusBarHeight } from '../services/StatusBarHeight';
const FocusAwareStatusBar = (props: any):any => {
  if(Platform.OS === 'android') {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar  {...props} /> : null;

  }else{
    const insets = useSafeAreaInsets();
    const heightValue =  getStatusBarHeight(0)>=20?insets.top:0
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