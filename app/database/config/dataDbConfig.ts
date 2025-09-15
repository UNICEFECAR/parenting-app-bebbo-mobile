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
import type RealmType from 'realm';
import { getRealmLib, safeDeleteRealm, safeOpenRealm } from '../../redux/reducers/realmSafe';

export async function getDataRealmConfig(): Promise<{ Realm: typeof RealmType, config: any }> {
  const Realm = await getRealmLib();
  const config: Realm.Configuration = {
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
    schemaVersion: 12,
    onMigration: (oldRealm, newRealm) => {
      if (oldRealm.schemaVersion < 1) {
        // const oldObjects = oldRealm.objects('VariableEntity');
        // const newObjects = newRealm.objects(ConfigSettingsSchema.name);
        migrateConfigSettings(oldRealm, newRealm);
      }

    }
  };
  return { Realm, config };
}
export async function openDataRealm() {
  const { config } = await getDataRealmConfig();
  return await safeOpenRealm(config);
}

// Safe helper to delete Data Realm
export async function deleteDataRealm() {
  const { config } = await getDataRealmConfig();
  await safeDeleteRealm(config);
}