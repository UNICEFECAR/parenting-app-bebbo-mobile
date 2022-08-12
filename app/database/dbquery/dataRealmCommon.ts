import { isArticlePinned } from '@assets/translations/appOfflineData/apiConstants';
import Realm, { ObjectSchema } from 'realm';
import { dataRealmConfig } from '../config/dataDbConfig';
import { StandardDevHeightForAgeSchema } from '../schema/StandardDevHeightForAgeSchema';
import { StandardDevWeightForHeightSchema } from '../schema/StandardDevWeightForHeightSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from './../schema/ConfigSettingsSchema';

const deleteRealmFilesBeforeOpen = false;

class DataRealmCommon {
    public realm?: Realm;
    private static instance: DataRealmCommon;

    public constructor() {
        this.openRealm();
    }

    static getInstance(): DataRealmCommon {
        if (!DataRealmCommon.instance) {
            DataRealmCommon.instance = new DataRealmCommon();
        }
        return DataRealmCommon.instance;
    }

    public async openRealm(): Promise<Realm | null> {
        return new Promise((resolve) => {
            if (this.realm) {
                resolve(this.realm);
            } else {
                // Delete realm file
                if (deleteRealmFilesBeforeOpen) {
                    Realm.deleteFile(dataRealmConfig);
                }

                // Open realm file
                Realm.open(dataRealmConfig)
                    .then(realm => {
                        this.realm = realm;
                        resolve(realm);
                    })
                    .catch(error => {
                        console.log(error);
                        resolve(null);
                    });
            }
        });
    }
    public closeRealm() {
        if (this.realm) {
            this.realm.close();
            delete this.realm;
        }
    }

    public isRealmClosed(): boolean {
        let rval = true;

        if (this.realm) {
            rval = this.realm.isClosed;
        }

        return rval;
    }

    public async getObjectLength<Entity>(entitySchema: ObjectSchema): Promise<number> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const objLength = realm?.objects<Entity>(entitySchema.name).length;
                    return objLength;
                }
                else {
                    return 0;
                }
            } catch (e) {
                return 0;
            }
        // });
    }

    public async create<Entity>(entitySchema: ObjectSchema, records: Entity[], _articleRelation?: string): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        if (records?.length > 0) {
                            records.forEach(record => {
                                realm?.create<Entity>(entitySchema.name, record, "modified");
                            })
                        }

                        return "success";
                    });
                }
                else {
                    return "fail";
                }
            } catch (e) {
                console.error("data insert err", e);
                return "fail";
            }
        // });
    }
    public async createArticles<Entity>(entitySchema: ObjectSchema, records: Entity[], articleRelation: string): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        if (records?.length > 0) {
                            records.forEach(async record => {
                                const obj = realm?.objects<Entity>(entitySchema.name).filtered('id == "' + record.id + '"');
                                if (obj.length > 0) {
                                    if (articleRelation == isArticlePinned && obj[0].isarticle_pinned != "1") {
                                        obj[0].isarticle_pinned = articleRelation;
                                    }
                                    else {
                                        if (obj[0].isarticle_pinned != "1") {
                                            record.isarticle_pinned = articleRelation;
                                        }
                                        else {
                                            record.isarticle_pinned = isArticlePinned;
                                        }
                                        realm?.create<Entity>(entitySchema.name, record, "modified");
                                    }
                                } else {
                                    record.isarticle_pinned = articleRelation;
                                    realm?.create<Entity>(entitySchema.name, record);
                                }
                            })
                        }
                        return "success";
                    });
                }
                else {
                    return "fail";
                }
            } catch (e) {
                console.error("data insert err", e);
                return "fail";
            }
        // });
    }
    public async createStandardDev<Entity>(records: Entity[]): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        const weightforheight = records['weight_for_height'];
                        const heightforAge = records['height_for_age'];
                        if (weightforheight?.length > 0) {
                            weightforheight.forEach((record: any) => {
                                realm?.create<Entity>(StandardDevWeightForHeightSchema.name, record);
                            })
                        }
                        if (heightforAge?.length > 0) {
                            heightforAge.forEach((record: any) => {
                                realm?.create<Entity>(StandardDevHeightForAgeSchema.name, record);
                            })
                        }

                        return "success";
                    });
                }
                else {
                    return "fail";
                }
            } catch (e) {
                console.error("data insert err", e);
                return "fail";
            }
        // });
    }
    public async updateSettings<Entity>(_entitySchema: ObjectSchema, key: string, value: string): Promise<string> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const allVariables = realm.objects<ConfigSettingsEntity>(ConfigSettingsSchema.name);
                    const variablesWithKey = allVariables.filtered(`key == "${key}"`);
                    const keyAlreadyExists = variablesWithKey && variablesWithKey.length > 0 ? true : false;
                    if (keyAlreadyExists) {
                        realm?.write(() => {
                            variablesWithKey[0].value = value;
                            variablesWithKey[0].updatedAt = new Date();
                            return "success";
                        });
                    }
                    else {
                        realm?.write(() => {
                            realm?.create<ConfigSettingsEntity>(ConfigSettingsSchema.name, {
                                key: key,
                                value: value,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            });
                            return "success";
                        });
                    }
                    return "success";

                }
                else {
                    return "fail";
                }
            } catch (e) {
                console.error("data insert err", e);
                return "fail";
            }
        // });
    }
    public async getData<Entity>(entitySchema: ObjectSchema, sortedOrder?: any): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    if (sortedOrder != null && sortedOrder != "" && sortedOrder != undefined) {
                        const obj = realm?.objects<Entity>(entitySchema.name).sorted(sortedOrder);
                        return obj;
                    }
                    else {
                        const obj = realm?.objects<Entity>(entitySchema.name);
                        return obj;
                    }
                }
                else {
                    return [];
                }
            } catch (e) {
                return [];
            }
        // });
    }
    public async getFilteredData<Entity>(entitySchema: ObjectSchema, filterData: any): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const obj = realm?.objects<Entity>(entitySchema.name).filtered(filterData);
                    return obj;
                }
                else {
                    return [];
                }
            } catch (e) {
                return [];
            }
        // });
    }

    public async deleteDeltaData(Schemavideo: string, Schemaarticle: string, Schemaactivities: string, Schemafaqs: string, records: any): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const articleids = records && records.article && records.article.length > 0 ? records.article : []
                    const activitiesids = records && records.activities && records.activities.length > 0 ? records.activities : []
                    const video_articleids = records && records.video_article && records.video_article.length > 0 ? records.video_article : []
                    const faqids = records && records.faq && records.faq.length > 0 ? records.faq : []
                    realm?.write(() => {
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
                        if (video_articleids.length > 0) {
                            const filterQuery = video_articleids.map((x: any) => `id = '${x}'`).join(' OR ');
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
                        return 'success';
                    });
                }
                else {
                    return "error";
                }
            } catch (e: any) {
                return "error";
            }
        // });
    }
    public async delete(Schema: string, filterCondition: any): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm?.write(() => {
                        if (
                            realm.objects(Schema).filtered(filterCondition)
                                .length > 0
                        ) {
                            realm.delete(
                                realm.objects(Schema).filtered(filterCondition)
                            );
                        }
                        return 'success';
                    });
                }
                else {
                    return "error";
                }
            } catch (e: any) {
                return "error";
            }
        // });
    }
    public async deleteAllAtOnce(): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm?.write(() => {
                        realm.deleteAll();
                        return 'success';
                    });
                }
                else {
                    return 'fail';
                }
            } catch (e) {
                return 'error';
            }
        // });

    }
    public async deleteOneByOne(entitySchema: ObjectSchema): Promise<any> {
        // return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const allRecords = realm?.objects(entitySchema.name);

                    realm?.write(() => {
                        realm?.delete(allRecords);
                        return 'success';
                    });
                }
                else {
                    return 'fail';
                }
            } catch (e) {
                return 'fail';
            }
        // });
    }
}
export const dataRealmCommon = DataRealmCommon.getInstance();
