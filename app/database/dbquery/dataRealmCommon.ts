import { appConfig } from '../../instances';
import { deleteDataRealm, openDataRealm } from '../config/dataDbConfig';
import { StandardDevHeightForAgeSchema } from '../schema/StandardDevHeightForAgeSchema';
import { StandardDevWeightForHeightSchema } from '../schema/StandardDevWeightForHeightSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from './../schema/ConfigSettingsSchema';

// ONLY use for TypeScript types:
import type RealmInstance from 'realm';
import type {UpdateMode} from 'realm';
const deleteRealmFilesBeforeOpen = false;

class DataRealmCommon {
    public realm?: RealmInstance;
    private static instance: DataRealmCommon;

    public constructor() {
        // this.openRealm();
    }

    static getInstance(): DataRealmCommon {
        if (!DataRealmCommon.instance) {
            DataRealmCommon.instance = new DataRealmCommon();
        }
        return DataRealmCommon.instance;
    }

    public async openRealm(): Promise<RealmInstance | null | undefined> {
        if (this.realm) {
            return this.realm;
        }

        try {
            if (deleteRealmFilesBeforeOpen) {
                await deleteDataRealm();
            }

            // Open and cache
            this.realm = await openDataRealm();
            return this.realm;
        } catch (error) {
            console.log("openRealm error:", error);
            return null;
        }
    }
    public closeRealm(): any {
        if (this.realm) {
            this.realm.close();
            this.realm = undefined;
        }
    }

    public isRealmClosed(): boolean {
        let rval = true;

        if (this.realm) {
            rval = this.realm.isClosed;
        }

        return rval;
    }

    public async getObjectLength<Entity>(entitySchema: RealmInstance.ObjectSchema): Promise<number> {
        // return new Promise(async (resolve, reject) => {
            let result: any='';
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const objLength = realm?.objects<Entity>(entitySchema.name).length;
                    result=objLength;
                    return result;
                }
                else {
                    result=0;
                    return result;
                }
            } catch (e) {
                result=0;
                return result;
            }
        // });
    }

    public async create<Entity>(entitySchema: RealmInstance.ObjectSchema, records: Entity[], _articleRelation?: string): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            let result: any='';
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        if (records?.length > 0) {
                            records.forEach(record => {
                                realm?.create<Entity>(entitySchema.name, record, "modified" as UpdateMode);
                            })
                        }
                        result="success";
                        return result
                    });
                    return result;
                }
                else {
                    result="fail";
                    return result
                }
            } catch (e) {
                console.error("data insert err", e);
                result="fail";
                return result
            }
        // });
    }
    public async createArticles<Entity extends {id: number; isarticle_pinned?: string}>(
        entitySchema: RealmInstance.ObjectSchema, records: Entity[], articleRelation: string
    ): Promise<'success' | 'fail'> {
        try {
            const realm = await this.openRealm();
            if (!realm || !Array.isArray(records)) return 'fail';
            realm.write(() => {
                for (const record of records) {
                    const existing = realm.objectForPrimaryKey<{id: number; isarticle_pinned?: string}>(entitySchema.name, record.id);
                    const pinned = existing?.isarticle_pinned == appConfig.isArticlePinned || articleRelation == appConfig.isArticlePinned;
                    // Refresh content even when the existing record is becoming pinned.
                    realm.create<Entity>(entitySchema.name, {
                        ...record,
                        isarticle_pinned: pinned ? appConfig.isArticlePinned : articleRelation,
                    }, 'modified' as UpdateMode);
                }
            });
            return 'success';
        } catch (error) {
            console.error('Article cache write failed', error);
            return 'fail';
        }
    }
    public async createStandardDev<Entity>(records: Entity[]): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            let result: any='';
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        const weightforheight = records['weight_for_height'];
                        const heightforAge = records['height_for_age'];
                        if (weightforheight?.length > 0) {
                            weightforheight.forEach((record: any) => {
                                realm?.create<Entity>(StandardDevWeightForHeightSchema.name, record, "modified" as UpdateMode);
                            })
                        }
                        if (heightforAge?.length > 0) {
                            heightforAge.forEach((record: any) => {
                                realm?.create<Entity>(StandardDevHeightForAgeSchema.name, record, "modified" as UpdateMode);
                            })
                        }
                        result="success";
                        return result;
                    });
                    return result;
                }
                else {
                    result="fail";
                        return result;
                }
            } catch (e) {
                console.error("data insert err", e);
                result="fail";
                return result;
            }
        // });
    }
    public async updateSettings<Entity>(_entitySchema: RealmInstance.ObjectSchema, key: string, value: string): Promise<string> {
        let result: any='';
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const allVariables = realm.objects<ConfigSettingsEntity>(ConfigSettingsSchema.name);
                    const variablesWithKey = allVariables.filtered(`key == "${key}"`);
                    const keyAlreadyExists = variablesWithKey && variablesWithKey.length > 0 ? true : false;
                    if (keyAlreadyExists) {
                        realm?.write(() => {
                            console.log("write")
                            variablesWithKey[0].value = value;
                            variablesWithKey[0].updatedAt = new Date();
                            
                        });
                        result="success";
                        return result
                    }
                    else {
                        realm?.write(() => {
                            console.log("write")
                            realm?.create<ConfigSettingsEntity>(ConfigSettingsSchema.name, {
                                key: key,
                                value: value,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }, "modified" as UpdateMode);
                            result="success";
                            return result
                        });
                    }
                    result="success";
                    return result
                }
                else {
                    result="fail";
                    return result
                }
            } catch (e) {
                console.error("data insert err", e);
                result="fail";
                return result
            }
        // });
    }
    public async getData<Entity>(entitySchema: RealmInstance.ObjectSchema, sortedOrder?: any): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            let result: any='';
            try {
                const realm = await this.openRealm();
                if (realm) {
                    if (sortedOrder != null && sortedOrder != "" && sortedOrder != undefined) {
                        const obj = realm?.objects<Entity>(entitySchema.name).sorted(sortedOrder);
                        result=obj
                        return result;
                    }
                    else {
                        const obj = realm?.objects<Entity>(entitySchema.name);
                        result=obj
                        return result;
                    }
                }
                else {
                    result=[]
                    return result;
                }
            } catch (e) {
                result=[]
                return result;
            }
        // });
    }
    public async getFilteredData<Entity>(entitySchema: RealmInstance.ObjectSchema, filterData: any): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            let result: any='';
            // console.log('Error is here on getFiltered data',filterData)
            try {
                // console.log('Error is here on getFiltered data success');
                const realm = await this.openRealm();
                if (realm) {
                    const obj = realm?.objects<Entity>(entitySchema.name).filtered(filterData);
                    result=obj
                    return result;
                }
                else {
                    result=[]
                    return result;
                }
            } catch (e) {
                result=[]
            
                return result;

            }
        // });
    }

    public async deleteDeltaData(Schemavideo: string, Schemaarticle: string, Schemaactivities: string, Schemafaqs: string, records: any): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            let result: any='';
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const articleids = records && records.article && records.article.length > 0 ? records.article : []
                    const activitiesids = records && records.activities && records.activities.length > 0 ? records.activities : []
                    const videoArticleIds = records && records.video_article && records.video_article.length > 0 ? records.video_article : []
                    const faqids = records && records.faq && records.faq.length > 0 ? records.faq : []
                    realm?.write(() => {
                        console.log("write")
                        if (articleids.length > 0) {
                            const filterQuery = articleids.map((x: any) => `id = '${x}'`).join(' OR ');
                            if (
                                realm.objects(Schemaarticle).filtered(filterQuery)
                                    .length > 0
                            ) {
                                realm.delete(
                                    realm.objects(Schemaarticle).filtered(filterQuery)
                                );
                            }
                        }
                        if (activitiesids.length > 0) {
                            const filterQuery = activitiesids.map((x: any) => `id = '${x}'`).join(' OR ');
                            if (
                                realm.objects(Schemaactivities).filtered(filterQuery)
                                    .length > 0
                            ) {
                                realm.delete(
                                    realm.objects(Schemaactivities).filtered(filterQuery)
                                );
                            }
                        }
                        if (videoArticleIds.length > 0) {
                            const filterQuery = videoArticleIds.map((x: any) => `id = '${x}'`).join(' OR ');
                            if (
                                realm.objects(Schemavideo).filtered(filterQuery)
                                    .length > 0
                            ) {
                                realm.delete(
                                    realm.objects(Schemavideo).filtered(filterQuery)
                                );
                            }
                        }
                        if (faqids.length > 0) {
                            const filterQuery = faqids.map((x: any) => `id = '${x}'`).join(' OR ');
                            if (
                                realm.objects(Schemafaqs).filtered(filterQuery)
                                    .length > 0
                            ) {
                                realm.delete(
                                    realm.objects(Schemafaqs).filtered(filterQuery)
                                );
                            }
                        }
                        result='success';
                        return result;
                    });
                    return result;
                }
                else {
                    result='error';
                    return result;
                }
            } catch (e: any) {
                result='error';
                return result;
            }
        // });
    }
    public async delete(Schema: string, filterCondition: any): Promise<any> {
        let result: any='';
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm?.write(() => {
                        console.log("write")
                        if (
                            realm.objects(Schema).filtered(filterCondition)
                                .length > 0
                        ) {
                            realm.delete(
                                realm.objects(Schema).filtered(filterCondition)
                            );
                        }
                        result='success'
                        return result;
                    });
                }
                else {
                    result='error'
                    return result;
                }
            } catch (e: any) {
                result='error'
                return result;
            }
        // });
    }
    public async deleteAllAtOnce(): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            let result: any='';
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm?.write(() => {
                        console.log("write")
                        // This method is used only by country/language content resets.
                        // Caregiver settings and unsent events are not content cache.
                        for (const schema of realm.schema) {
                            if (!schema.embedded && ![ConfigSettingsSchema.name, 'Event'].includes(schema.name)) {
                                realm.delete(realm.objects(schema.name));
                            }
                        }
                      
                    });
                    result='success';
                    console.log(result,"..newresult1")
                    return result;
                }
                else {
                    result='fail';
                    return result;
                }
            } catch (e) {
                result='error';
                return result;
            }
        // });

    }
    public async deleteOneByOne(entitySchema: RealmInstance.ObjectSchema): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            let result: any='';
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const allRecords = realm?.objects(entitySchema.name);

                    realm?.write(() => {
                        console.log("write")
                        realm?.delete(allRecords);
                     
                    });
                    result='success'
                    return result;
                }
                else {
                    result='fail'
                    return result;
                }
            } catch (e) {
                result='fail'
                return result;
            }
        // });
    }
}
export const dataRealmCommon = DataRealmCommon.getInstance();
