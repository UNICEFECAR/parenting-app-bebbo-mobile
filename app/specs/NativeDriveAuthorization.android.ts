import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  authorize(allowUserInteraction: boolean): Promise<string | null>;
  clearToken(accessToken: string): Promise<void>;
  forgetAccount(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('DriveAuthorization');
