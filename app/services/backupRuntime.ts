export type BackupPreferences = {growthEnabled: boolean; developmentEnabled: boolean; vchcEnabled: boolean; lowbandWidth?: boolean};
export type BackupContext = {flavour: string; country: string; language: string};
type Runtime = {context: () => BackupContext; flags: () => BackupPreferences; applyFlags: (flags: BackupPreferences) => Promise<void>; recoveryRequired: () => void};
let runtime: Runtime | undefined;
export function installBackupRuntime(value: Runtime) {runtime = value; return () => {if (runtime === value) runtime = undefined;};}
export function backupRuntime(): Runtime {if (!runtime) throw new Error('Backup runtime unavailable'); return runtime;}
