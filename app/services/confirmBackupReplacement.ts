import type {TFunction} from 'i18next';
import {Alert} from 'react-native';
/** Shared by Drive, local-file and onboarding confirmation; preview never writes. */
export function confirmBackupReplacement(t: TFunction): Promise<boolean> {
  return new Promise(resolve => Alert.alert(String(t('importText')),
    String(t('backupRestoreReplaceWarningV3')), [
      {text: String(t('retryCancelPopUpBtn')), style: 'cancel', onPress: () => resolve(false)},
      {text: String(t('continueInModal')), style: 'destructive', onPress: () => resolve(true)},
    ], {cancelable: true, onDismiss: () => resolve(false)}));
}
