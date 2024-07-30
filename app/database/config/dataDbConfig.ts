import Realm from 'realm';

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
import { SearchHistorySchema } from "../schema/SearchHistorySchema";
import { ActivitySearchHistorySchema } from '../schema/ActivitySearchHistorySchema';
import { ArticleActivityViewSchema } from '../schema/ArticleActivityViewSchema';
import { CountrySchema, LanguageSchema, PartnerSchema } from '../schema/CountrySchema';

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
    ArticleActivityViewSchema,
    StandardDevWeightForHeightSchema,
    StandDevObj,
    StandardDevHeightForAgeSchema,
    FAQsSchema,
    EventSchema,
    SearchHistorySchema,
    ActivitySearchHistorySchema,
    CountrySchema,
    LanguageSchema,
    PartnerSchema
  ],
  schemaVersion: 10,
  onMigration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 1) {
      // const oldObjects = oldRealm.objects('VariableEntity');
      // const newObjects = newRealm.objects(ConfigSettingsSchema.name);
      migrateConfigSettings(oldRealm, newRealm);
    }

  }
};