import Realm, { ObjectSchema } from "realm";
import { migrateConfigSettings } from "../migration/init";
import { ActivitiesEntitySchema } from "../schema/ActivitiesSchema";
import { ArticleEntitySchema, CoverImage, CoverVideo } from "../schema/ArticleSchema";
import { BasicPagesSchema } from "../schema/BasicPagesSchema";
import { ChildDevelopmentSchema } from "../schema/ChildDevelopmentSchema";
import { ChildGrowthSchema } from "../schema/ChildGrowthSchema";
import { ConfigSettingsSchema } from "../schema/ConfigSettingsSchema";
import { DailyHomeMessagesSchema } from "../schema/DailyHomeMessagesSchema";
import { HealthCheckUpsSchema } from "../schema/HealthCheckUpsSchema";
import { MilestonesSchema } from "../schema/MilestonesSchema";
import { StandardDevHeightForAgeSchema } from "../schema/StandardDevHeightForAgeSchema";
import { StandardDevWeightForHeightSchema, StandDevObj } from "../schema/StandardDevWeightForHeightSchema";
import { SurveysSchema } from "../schema/SurveysSchema";
import { TaxonomySchema } from "../schema/TaxonomySchema";
import { VaccinationSchema } from "../schema/VaccinationSchema";
import { VideoArticleEntitySchema } from "../schema/VideoArticleSchema";

export const dataRealmConfig: Realm.Configuration ={
  path: 'data.realm',
  schema: [
    ConfigSettingsSchema,
    ArticleEntitySchema,
    CoverVideo,
    CoverImage,
    VideoArticleEntitySchema,
    DailyHomeMessagesSchema,
    BasicPagesSchema,
    TaxonomySchema,
    MilestonesSchema,
    ChildDevelopmentSchema,
    VaccinationSchema,
    HealthCheckUpsSchema,
    ChildGrowthSchema,
    SurveysSchema,
    ActivitiesEntitySchema,
    StandardDevWeightForHeightSchema,
    StandDevObj,
    StandardDevHeightForAgeSchema
  ],
  schemaVersion: 1,
  migration: (oldRealm, newRealm) => {
  // console.log("in migration data");
    if(oldRealm.schemaVersion < 1){
      const oldObjects = oldRealm.objects('VariableEntity');
      const newObjects = newRealm.objects(ConfigSettingsSchema.name);
      // console.log("oldobj---",oldObjects);
      // console.log("newObjects---",newObjects);
      // console.log("oldRealm schema---",oldRealm.schema);
      // console.log("newRealm schema---",newRealm.schema);

      // console.log("MeasurementEntity obj---",Array.from(newRealm.objects('MeasurementEntity')));
       migrateConfigSettings(oldRealm,newRealm);
      // loop through all objects and set the _id property in the new schema
      // for (const objectIndex in oldObjects) {
      //   const oldObject = oldObjects[objectIndex];
      //   const newObject = newObjects[objectIndex];
      //   newObject._id = oldObject._id.toHexString();
      // }
  }
    
  }
};
