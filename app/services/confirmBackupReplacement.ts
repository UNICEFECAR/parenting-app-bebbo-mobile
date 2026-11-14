import type {TFunction} from 'i18next';
import {Alert} from 'react-native';
/** Shared by Drive, local-file and onboarding confirmation; preview never writes. */
export function confirmBackupReplacement(t: TFunction): Promise<boolean> {
  return new Promise(resolve => Alert.alert(String(t('importText')),
    String(t('backupRestoreReplaceWarningV3', {defaultValue:
      'Restoring replaces all child and pregnancy profiles and their records on this device. Photos, caregiver details and reminder preferences included in the backup are also restored. Back up current data first. Only restore files you trust. This does not merge records. Continue?'})), [
      {text: String(t('retryCancelPopUpBtn')), style: 'cancel', onPress: () => resolve(false)},
      {text: String(t('continueInModal')), style: 'destructive', onPress: () => resolve(true)},
    ], {cancelable: true, onDismiss: () => resolve(false)}));
}
