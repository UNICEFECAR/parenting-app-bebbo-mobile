import Realm from "realm";
import { migrateConfigSettings } from "../migration/init";
import { ActivitiesEntitySchema } from "../schema/ActivitiesSchema";
import { ArticleEntitySchema, CoverImage, CoverVideo } from "../schema/ArticleSchema";
import { BasicPagesSchema } from "../schema/BasicPagesSchema";
import { ChildDevelopmentSchema } from "../schema/ChildDevelopmentSchema";
import { ConfigSettingsSchema } from "../schema/ConfigSettingsSchema";
import { DailyHomeMessagesSchema } from "../schema/DailyHomeMessagesSchema";
import { FAQsSchema } from "../schema/FAQsSchema";
import { HealthCheckUpsSchema } from "../schema/HealthCheckUpsSchema";
import { MilestonesSchema } from "../schema/MilestonesSchema";
import { StandardDevHeightForAgeSchema } from "../schema/StandardDevHeightForAgeSchema";
import { StandardDevWeightForHeightSchema, StandDevObj } from "../schema/StandardDevWeightForHeightSchema";
import { SurveysSchema } from "../schema/SurveysSchema";
import { TaxonomySchema } from "../schema/TaxonomySchema";
import { VaccinationSchema } from "../schema/VaccinationSchema";
import { VideoArticleEntitySchema } from "../schema/VideoArticleSchema";
import { EventSchema } from "../schema/EventSchema";

export const dataRealmConfig: Realm.Configuration = {
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
    SurveysSchema,
    ActivitiesEntitySchema,
    StandardDevWeightForHeightSchema,
    StandDevObj,
    StandardDevHeightForAgeSchema,
    FAQsSchema,
    EventSchema
  ],
  schemaVersion: 8,
  onMigration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 1) {
      // const oldObjects = oldRealm.objects('VariableEntity');
      // const newObjects = newRealm.objects(ConfigSettingsSchema.name);
      migrateConfigSettings(oldRealm, newRealm);
    }

  }
};