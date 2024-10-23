import Realm from "realm";
import { migrateuserRealm } from "../migration/init";
import { ChildEntitySchema, MeasuresEntitySchema, ReminderEntitySchema } from "../schema/ChildDataSchema";

export const userRealmConfig: Realm.Configuration = {
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
    if (oldRealm.schemaVersion < 1) {
      migrateuserRealm(oldRealm, newRealm);
    }
  }
};
