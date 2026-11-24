import type {TFunction} from 'i18next';
const messages: Record<string,string> = {
  'Backup preview expired. Select the backup again':'backupPreviewExpired',
  'Cannot unlock legacy backup':'backupLegacyUnlockFailed',
  'Unsupported or damaged backup':'backupDamaged',
  'Incorrect passphrase or damaged backup':'backupUnlockFailed',
  'A backup passphrase must contain at least 6 characters':'backupPassphraseTooShort',
  'Backup exceeds the supported size':'backupSizeLimit',
  'A profile photo is missing or exceeds 8 MB':'backupPhotoUnavailable',
  'Profile photos must be JPEG or PNG images up to 4096 pixels':'backupPhotoFormat',
  'Backup photos exceed the supported size':'backupPhotoSizeLimit',
  'Restore interrupted: retry recovery or keep the previous data':'backupRecoveryRequired',
};
export function backupErrorMessage(error: unknown, t: TFunction): string {
  if(error instanceof Error && Object.prototype.hasOwnProperty.call(messages,error.message)) return String(t(messages[error.message]));
  return String(t('generalError'));
}
