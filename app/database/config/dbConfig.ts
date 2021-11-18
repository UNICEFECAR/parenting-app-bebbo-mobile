import Realm from "realm";
import { migrateuserRealm } from "../migration/init";
import { ChildEntitySchema, MeasuresEntitySchema, ReminderEntitySchema } from "../schema/ChildDataSchema";

export const userRealmConfig: Realm.Configuration ={
  path: 'user.realm',
  schema: [
    ChildEntitySchema,
    MeasuresEntitySchema,
    ReminderEntitySchema
   // MeasurementEntitySchema
  ],
  schemaVersion: 2,
  migration: (oldRealm, newRealm) => {
   console.log("..user migration new..");
    //0
   console.log(oldRealm.schemaVersion,"..old schema version")
    //1
   console.log(newRealm.schemaVersion,"..new schema version")
    //realm old version was 0 and new version is 1.
    const oldObjects = oldRealm.objects('ChildEntity');
    const newObjects = newRealm.objects('ChildEntity');
   console.log("oldobj---",oldObjects);
   console.log("newObjects---",newObjects);
    if(oldRealm.schemaVersion < 1){
      console.log("inner lopp..")
    //   const oldObjects = oldRealm.objects('ChildEntity');
    //   const newObjects = newRealm.objects('ChildEntity');
    //  console.log("oldobj---",oldObjects);
    //  console.log("newObjects---",newObjects);
      // console.log("MeasurementEntity obj---",Array.from(newRealm.objects('MeasurementEntity')));
       migrateuserRealm(oldRealm,newRealm);
      // loop through all objects and set the _id property in the new schema
      // for (const objectIndex in oldObjects) {
      //   const oldObject = oldObjects[objectIndex];
      //   const newObject = newObjects[objectIndex];
      //   newObject._id = oldObject._id.toHexString();
      // }
  }
    
  }
};
