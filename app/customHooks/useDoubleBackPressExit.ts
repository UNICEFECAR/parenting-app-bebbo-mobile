import { Alert } from 'react-native';
import { Platform, BackHandler, ToastAndroid } from 'react-native';
let currentCount = 0;
export const useDoubleBackPressExit = (
  exitHandler: () => void
) => {
  if (Platform.OS === "ios") return;
  const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
    if (currentCount === 1) {
      exitHandler();
      subscription.remove();
      return true;
    }
    backPressHandler();
    return true;
  });
};

const backPressHandler = () => {
  if (currentCount < 1) {
    currentCount += 1;
   
    if (Platform.OS === 'android') {
      ToastAndroid.show("Press again to close!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Press again to close!");
    }
  }
  setTimeout(() => {
    currentCount = 0;
  }, 2000);
};