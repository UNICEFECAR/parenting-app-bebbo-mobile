import { isArticlePinned } from '@assets/translations/appOfflineData/apiConstants';
import Realm, { ObjectSchema } from 'realm';
import { dataRealmConfig } from '../config/dataDbConfig';
import { StandardDevHeightForAgeSchema } from '../schema/StandardDevHeightForAgeSchema';
import { StandardDevWeightForHeightSchema } from '../schema/StandardDevWeightForHeightSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from './../schema/ConfigSettingsSchema';

// import { dispatchchildstore2 } from './userRealmListener';
// import userRealm from '../config/dbConfig'
// export const userRealmInstance = getUserRealm();
const deleteRealmFilesBeforeOpen = false;
//console.log("in datarealm file");

class DataRealmCommon {
    public realm?: Realm;
    private static instance: DataRealmCommon;

    public constructor() {
        //  console.log("constructor called data");
        // this.closeRealm();
        this.openRealm();

    }

    static getInstance(): DataRealmCommon {
        //console.log("getnewinstance called");
        if (!DataRealmCommon.instance) {
            //console.log("getnewinstance called in if");
            DataRealmCommon.instance = new DataRealmCommon();
        }
        return DataRealmCommon.instance;
    }

    public async openRealm(): Promise<Realm | null> {
        return new Promise((resolve, reject) => {
            //  console.log("in openrealm");
            if (this.realm) {
                //     this.closeRealm();
                // }
                resolve(this.realm);
            } else {
                // Delete realm file
                if (deleteRealmFilesBeforeOpen) {
                    Realm.deleteFile(dataRealmConfig);
                }

                // Open realm file
                Realm.open(dataRealmConfig)
                    .then(realm => {
                        //console.log("open realm data");
                        this.realm = realm;
                        resolve(realm);
                    })
                    .catch(error => {
                        resolve(null);
                    });
            }
        });
    }
    public closeRealm() {
        if (this.realm) {
            // console.log("closed realm data");
            this.realm.close();
            delete this.realm;
        }
    }
    // public addListenerToDataRealm(onRealmDataDbChange) {
    //     if (this.realm) {
    //        // console.log("closed realm data");
    //         this.realm.addListener('change',onRealmDataDbChange);
    //     }
    // }

    public isRealmClosed(): boolean {
        let rval = true;

        if (this.realm) {
            rval = this.realm.isClosed;
        }

        return rval;
    }

    public async getObjectLength<Entity>(entitySchema: ObjectSchema): Promise<Number> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const objLength = realm?.objects<Entity>(entitySchema.name).length;
                    // console.log("in try",objLength);
                    resolve(objLength);
                }
                else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }

    public async create<Entity>(entitySchema: ObjectSchema, records: Entity[],articleRelation?:String): Promise<String> {
        return new Promise(async (resolve, reject) => {
            // console.log(entitySchema,"--entity--");
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        if (records?.length > 0) {
                            records.forEach(record => {
                                    realm?.create<Entity>(entitySchema.name, record,"modified");
                            })
                        }

                        resolve("success");
                    });
                }
                else {
                    reject();
                }
            } catch (e) {
                console.error("data insert err", e.message);
                reject();
            }
        });
    }
    public async createArticles<Entity>(entitySchema: ObjectSchema, records: Entity[],articleRelation:String): Promise<String> {
        return new Promise(async (resolve, reject) => {
            // console.log(entitySchema,"--entity--");
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        if (records?.length > 0) {
                            records.forEach(async record => {
                                // console.log(record.id);
                                const obj = realm?.objects<Entity>(entitySchema.name).filtered('id == "'+record.id+'"');
                                // console.log(Array.from(obj),"---obj");
                                // console.log(obj.length,"---obj");
                                if(obj.length > 0)
                                {
                                    if(articleRelation == isArticlePinned && obj[0].isarticle_pinned != "1")
                                    {
                                        obj[0].isarticle_pinned = articleRelation;
                                        // console.log(Array.from(obj),"---obj after");
                                    }
                                    else{
                                        // record.cover_image = JSON.stringify(record.cover_image);
                                        if(obj[0].isarticle_pinned != "1"){
                                        record.isarticle_pinned = articleRelation;
                                        }
                                        else{
                                            record.isarticle_pinned = isArticlePinned;
                                        }
                                        realm?.create<Entity>(entitySchema.name, record,"modified");
                                    }
                                }else {
                                    // record.cover_image = JSON.stringify(record.cover_image);
                                    record.isarticle_pinned = articleRelation;
                                    realm?.create<Entity>(entitySchema.name, record);
                                }
                            })
                        }

                        resolve("success");
                    });
                }
                else {
                    reject();
                }
            } catch (e) {
                console.error("data insert err", e.message);
                reject();
            }
        });
    }
    public async createStandardDev<Entity>(records: Entity[]): Promise<String> {
        return new Promise(async (resolve, reject) => {
            // console.log(records,"--entity--");
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

                        resolve("success");
                    });
                }
                else {
                    reject();
                }
            } catch (e) {
                console.error("data insert err", e.message);
                reject();
            }
        });
    }
    public async updateSettings<Entity>(entitySchema: ObjectSchema, key: string, value: string): Promise<String> {
        return new Promise(async (resolve, reject) => {
            //  console.log(entitySchema,"--entity--");
            try {
                const realm = await this.openRealm();
                if (realm) {
                    // realm?.write(() => {
                    // if (records?.length > 0) {
                    const allVariables = realm.objects<ConfigSettingsEntity>(ConfigSettingsSchema.name);
                    const variablesWithKey = allVariables.filtered(`key == "${key}"`);
                    const keyAlreadyExists = variablesWithKey && variablesWithKey.length > 0 ? true : false;
                    if (keyAlreadyExists) {
                        realm?.write(() => {
                            variablesWithKey[0].value = value;
                            variablesWithKey[0].updatedAt = new Date();
                            resolve("success");
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
                            resolve("success");
                        });
                    }
                    // records.forEach(record => {
                    //     realm?.create<Entity>(entitySchema.name, record, 'modified');
                    // })
                    // }

                    resolve("success");
                    // });

                }
                else {
                    reject();
                }
            } catch (e) {
                console.error("data insert err", e.message);
                reject();
            }
        });
    }
    public async getData<Entity>(entitySchema: ObjectSchema,sortedOrder?:any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    if(sortedOrder!=null && sortedOrder!="" && sortedOrder!= undefined){
                        const obj = realm?.objects<Entity>(entitySchema.name).sorted(sortedOrder);
                        resolve(obj);
                    }
                    else{
                        const obj = realm?.objects<Entity>(entitySchema.name);
                        resolve(obj);
                    }
                    // const obj2 = realm?.objects<Entity>(entitySchema.name)?.filtered('');
                    // console.log(obj2,"--obj2");
                    
                   
                }
                else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }
    public async getFilteredData<Entity>(entitySchema: ObjectSchema, filterData: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {

                //write a function

                const realm = await this.openRealm();
                if (realm) {
                    // const obj2 = realm?.objects<Entity>(entitySchema.name)?.filtered('');
                    // console.log(obj2,"--obj2");
                    const obj = realm?.objects<Entity>(entitySchema.name).filtered(filterData);
                  //   console.log("filtered obj--",obj.length);
                    resolve(obj);
                }
                else {
                    reject();
                }
            } catch (e) {
                // console.log(e.message,"--e catch");
                reject();
            }
        });
    }

    public async deleteDeltaData(Schemavideo:string,Schemaarticle:string,Schemaactivities:string,Schemafaqs:string,records:any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    console.log("in deletedeta data---",records);
                    const articleids = records && records.article && records.article.length > 0 ? records.article : []
                    const activitiesids = records && records.activities && records.activities.length > 0 ? records.activities : []
                    const video_articleids = records && records.video_article && records.video_article.length > 0 ? records.video_article : []
                    const faqids = records && records.faq && records.faq.length > 0 ? records.faq : []
                     realm?.write(() => {
                        if(articleids.length > 0) {
                            const filterQuery = articleids.map((x: any) => `id = '${x}'`).join(' OR ');
                            if (
                                realm.objects(Schemaarticle).filtered(filterQuery)
                                .length > 0
                            ) {
                                //let collectionPages = Object.assign([], realm.objects(Schema));
                                realm.delete(
                                realm.objects(Schemaarticle).filtered(filterQuery)
                                );
                            }
                        }
                        if(activitiesids.length > 0) {
                            const filterQuery = activitiesids.map((x: any) => `id = '${x}'`).join(' OR ');
                            if (
                                realm.objects(Schemaactivities).filtered(filterQuery)
                                .length > 0
                            ) {
                                //let collectionPages = Object.assign([], realm.objects(Schema));
                                realm.delete(
                                realm.objects(Schemaactivities).filtered(filterQuery)
                                );
                            }
                        }
                        if(video_articleids.length > 0) {
                            const filterQuery = video_articleids.map((x: any) => `id = '${x}'`).join(' OR ');
                            if (
                                realm.objects(Schemavideo).filtered(filterQuery)
                                .length > 0
                            ) {
                                //let collectionPages = Object.assign([], realm.objects(Schema));
                                realm.delete(
                                realm.objects(Schemavideo).filtered(filterQuery)
                                );
                            }
                        }
                        if(faqids.length > 0) {
                            const filterQuery = faqids.map((x: any) => `id = '${x}'`).join(' OR ');
                            if (
                                realm.objects(Schemafaqs).filtered(filterQuery)
                                .length > 0
                            ) {
                                //let collectionPages = Object.assign([], realm.objects(Schema));
                                realm.delete(
                                realm.objects(Schemafaqs).filtered(filterQuery)
                                );
                            }
                        }
                        // realm?.delete(realm.objectForPrimaryKey(Schema, record));
                        resolve('success');
                    });
                }
                else {
                    reject('error');
                }  
            } catch (e:any) {
               // console.log(e.message,"..error in delete..");
                reject('error');
            }
        });
    }
    public async delete(Schema:string,filterCondition:any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    realm?.write(() => {
                        if (
                            realm.objects(Schema).filtered(filterCondition)
                              .length > 0
                          ) {
                            //let collectionPages = Object.assign([], realm.objects(Schema));
                            realm.delete(
                              realm.objects(Schema).filtered(filterCondition)
                            );
                        }
                        // realm?.delete(realm.objectForPrimaryKey(Schema, record));
                        resolve('success');
                    });
                }
                else {
                    reject('error');
                }  
            } catch (e:any) {
               // console.log(e.message,"..error in delete..");
                reject('error');
            }
        });
    }
    public async deleteAllAtOnce(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                realm?.write(() => {
                  realm.deleteAll();
                  resolve();
                });
                }
                else {
                    reject();
                }
            } catch (e) {
                reject(e);
            }
        });
    
    }
    public async deleteOneByOne(entitySchema: ObjectSchema): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const allRecords = realm?.objects(entitySchema.name);

                    realm?.write(() => {
                        realm?.delete(allRecords);
                        resolve();
                    });
                }
                else {
                    reject();
                }
            } catch (e) {
                reject(e);
            }
        });
    }
}
export const dataRealmCommon = DataRealmCommon.getInstance();
// export const dataRealmCommon = new DataRealmCommon();
// console.log(dataRealmCommon," dataRealmCommon");
// export default userRealmCommon;