import Realm from "realm";
import { migrateuserRealm } from "../migration/init";
import { ChildEntitySchema } from "../schema/ChildDataSchema";
import { MeasurementEntitySchema } from "../schema/measurementDataSchema";

export const userRealmConfig: Realm.Configuration ={
  path: 'user.realm',
  schema: [
    ChildEntitySchema,
   // MeasurementEntitySchema
  ],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
   // console.log("..migration..");
    //0
   // console.log(oldRealm.schemaVersion)
    //1
   // console.log(newRealm.schemaVersion)
    //realm old version was 0 and new version is 1.
    if(oldRealm.schemaVersion < 1){
      const oldObjects = oldRealm.objects('ChildEntity');
      const newObjects = newRealm.objects('ChildEntity');
    //  console.log("oldobj---",oldObjects);
     // console.log("newObjects---",newObjects);
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
