import {useEffect, useState} from 'react';
import {subscribeBackupBusy} from '../services/backupPassword';

// The global backup overlay owns loading while the backup service is working.
// Screens can still show their own loader before/after that operation.
export function useBackupOperationBusy(): boolean {
  const [busy, setBusy] = useState(false);
  useEffect(() => subscribeBackupBusy(setBusy), []);
  return busy;
}
