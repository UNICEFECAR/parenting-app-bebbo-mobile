import { NativeModules } from 'react-native';

const { ExactAlarmModule } = NativeModules;

export const requestExactAlarmPermission = async () => {
  try {
    const granted = await ExactAlarmModule.requestExactAlarmPermission();
    return granted; // true if permission is already granted
  } catch (error) {
    console.log('Error requesting exact alarm permission:', error);
    return false;
  }
};
