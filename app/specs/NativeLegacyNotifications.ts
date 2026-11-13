import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// Read-only until JS has durably saved and scheduled the replacement reminders.
export interface Spec extends TurboModule {
  getNotificationColor(): Promise<string>;
  getPendingNotifications(): Promise<string>;
  completeMigration(notificationIds: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('LegacyNotifications');
