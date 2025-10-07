import { getRealmLib, safeDeleteRealm, safeOpenRealm } from '../../redux/reducers/realmSafe';
import { migrateuserRealm } from "../migration/init";
import { ChildEntitySchema, MeasuresEntitySchema, ReminderEntitySchema } from "../schema/ChildDataSchema";
import type RealmType from 'realm';

export async function getUserRealmConfig(): Promise<{ Realm: typeof RealmType, config: any }> {
  const Realm = await getRealmLib();
  const config: Realm.Configuration = {
    path: 'user.realm',
    schema: [
      ChildEntitySchema,
      MeasuresEntitySchema,
      ReminderEntitySchema
    ],
    schemaVersion: 4,
    onMigration: (oldRealm, newRealm) => {
      console.log(oldRealm,newRealm);
      //realm old version was 0 and new version is 1.
      // const oldObjects = oldRealm.objects('ChildEntity');
      // const newObjects = newRealm.objects('ChildEntity');
      if (newRealm.schemaVersion < 4) {
        const oldObjects = oldRealm.objects('ChildEntity');
        const newObjects = newRealm.objects('ChildEntity');

        // Iterate over all objects and set the default value for 'autoChild'
        for (let i = 0; i < oldObjects.length; i++) {
          newObjects[i].autoChild = 'false'; // Set default value if needed
        }
      }

      if (oldRealm.schemaVersion < 1) {
        migrateuserRealm(oldRealm, newRealm);
      }
    }
  };

  return { Realm, config };
}

export async function openUserRealm() {
  const { config } = await getUserRealmConfig();
  return await safeOpenRealm(config);
}

// Safe helper to delete Data Realm
export async function deleteUserRealm() {
  const { config } = await getUserRealmConfig();
  await safeDeleteRealm(config);
}
