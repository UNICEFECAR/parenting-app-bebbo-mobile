import type {TFunction} from 'i18next';
import {Alert} from 'react-native';
import {confirmBackupReplacement} from '../confirmBackupReplacement';
import {backupFallback} from '../../localization/backupFallback';
const t = (key: string) => backupFallback[key as keyof typeof backupFallback] ?? key;
afterEach(() => jest.restoreAllMocks());
test.each(['cancel', 'dismiss', 'confirm'])('replacement requires the explicit confirm action (%s)', async action => {
  jest.spyOn(Alert, 'alert').mockImplementation((_title, message, buttons, options) => {
    expect(message).toContain('replaces all child and pregnancy profiles');
    expect(message).toContain('does not merge');
    if (action === 'dismiss') options?.onDismiss?.();
    else buttons?.[action === 'confirm' ? 1 : 0].onPress?.();
  });
  await expect(confirmBackupReplacement(t as unknown as TFunction)).resolves.toBe(action === 'confirm');
});
