import { isArticlePinned } from '@types/apiConstants';
import Realm, { ObjectSchema } from 'realm';
import { dataRealmConfig } from '../config/dataDbConfig';
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
                                if(entitySchema.name == "ActivitiesEntity")
                                {
                                    if(record.cover_image == "")
                                    {
                                        record.cover_image = {};
                                    }
                                }
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
                                }else {
                                    record.cover_image = JSON.stringify(record.cover_image);
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

    public async delete(record: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        realm?.delete(record);
                        resolve();
                    });
                }
                else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }

    public async deleteAll(entitySchema: ObjectSchema): Promise<void> {
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