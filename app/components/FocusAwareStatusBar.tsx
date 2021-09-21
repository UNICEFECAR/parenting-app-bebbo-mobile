import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FocusAwareStatusBar = (props: any) => {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { backgroundColor } = props;
  return isFocused ? <View style={{ height: insets.top, width: "100%", backgroundColor }}><StatusBar  {...props} /></View> : null;
}
export default FocusAwareStatusBar;