import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const FocusAwareStatusBar = (props: any):any => {
  const insets = useSafeAreaInsets();
  console.log(props.backgroundColor,"insets is--",insets)
  if(Platform.OS === 'android' && insets.top < 50 && insets.bottom === 0) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar  {...props} /> : null;

  }else{
    return (
      <View style={{ paddingTop: insets.top, backgroundColor:props.backgroundColor }}>
         <StatusBar
          translucent backgroundColor="transparent" barStyle="dark-content"
           animated={true}
          {...props}/>
      </View>
    );
  }
}
export default React.memo(FocusAwareStatusBar);
