import Realm, { ObjectSchema } from "realm";
import { ArticleEntitySchema, CoverImage, CoverVideo } from "../schema/ArticleSchema";
import { BasicPagesSchema } from "../schema/BasicPagesSchema";
import { DailyHomeMessagesSchema } from "../schema/DailyHomeMessagesSchema";
import { TaxonomySchema } from "../schema/TaxonomySchema";
import { VideoArticleEntitySchema } from "../schema/VideoArticleSchema";
// import { VariableEntitySchema } from "../schema/childDataSchema";

export type VariableEntity = {
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
* Realm schema for VariableEntity.
*/
export const VariableEntitySchema: ObjectSchema = {
  name: 'VariableEntity',

  // API: https://bit.ly/3f7k9jq
  properties: {
      key: { type:'string' },
      value: { type:'string' },
      createdAt: { type:'date' },
      updatedAt: { type:'date' },
  }
};
export const dataRealmConfig: Realm.Configuration ={
  path: 'data.realm',
  schema: [
    VariableEntitySchema,
    ArticleEntitySchema,
    CoverVideo,
    CoverImage,
    VideoArticleEntitySchema,
    DailyHomeMessagesSchema,
    BasicPagesSchema,
    TaxonomySchema,
  ],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
   // console.log("in migration data");
    if(oldRealm.schemaVersion < 1){
      const oldObjects = oldRealm.objects('VariableEntity');
      const newObjects = newRealm.objects('VariableEntity');
      // console.log("oldobj---",oldObjects);
      // console.log("newObjects---",newObjects);
      // console.log("oldRealm schema---",oldRealm.schema);
      // console.log("newRealm schema---",newRealm.schema);

      // console.log("MeasurementEntity obj---",Array.from(newRealm.objects('MeasurementEntity')));
      // migrateuserRealm(oldRealm,newRealm);
      // loop through all objects and set the _id property in the new schema
      // for (const objectIndex in oldObjects) {
      //   const oldObject = oldObjects[objectIndex];
      //   const newObject = newObjects[objectIndex];
      //   newObject._id = oldObject._id.toHexString();
      // }
  }
    
  }
};
