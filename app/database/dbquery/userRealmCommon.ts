
import { Component } from 'react';
import Realm, { ObjectSchema, Collection } from 'realm';
import { userRealmConfig } from '../config/dbConfig';
import { ChildEntity, ChildEntitySchema } from '../schema/ChildDataSchema';
// import { dispatchchildstore2 } from './userRealmListener';
// import userRealm from '../config/dbConfig'
// export const userRealmInstance = getUserRealm();
const deleteRealmFilesBeforeOpen = false;

class UserRealmCommon extends Component {
    public realm?: Realm;
    private static instance: UserRealmCommon;

    private constructor(props: any) {
        super(props);
      //  console.log("constructor called");
        // this.closeRealm();
        this.openRealm();
        
    }

    static getInstance(): UserRealmCommon {
        if (!UserRealmCommon.instance) {
            UserRealmCommon.instance = new UserRealmCommon(null);
        }
        return UserRealmCommon.instance;
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
                    Realm.deleteFile(userRealmConfig);
                }

                // Open realm file
                Realm.open(userRealmConfig)
                    .then(realm => {
                        console.log("open realm");
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
            console.log("closed");
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

    public async getObjectLength<Entity>(entitySchema: ObjectSchema): Promise<Number> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    const objLength = realm?.objects<Entity>(entitySchema.name).length;
                    console.log("in try",objLength);
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

    public async create<Entity>(entitySchema: ObjectSchema, records:Entity[]): Promise<Entity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    console.log("in try--",records);
                    realm.write(() => {
                        records.forEach(record => {
                            console.log("record",record);
                            realm?.create<Entity>(entitySchema.name, record);
                        })
                            
                        resolve(records);
                    });
                }
                else {
                    reject();
                }
            } catch (e) {
                console.log("realm error-",e);
                reject();
            }
        });
    }
    public async getData<Entity>(entitySchema: ObjectSchema): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    const obj = realm?.objects<Entity>(entitySchema.name);
                    console.log("in try",obj);
                    resolve(obj);
                    console.log("---",realm.schema);
                }
                else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }
    public async delete(Schema:string,record: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    realm.write(() => {
                        if (
                            realm.objects(Schema).filtered('uuid ="' + record+ '"')
                              .length > 0
                          ) {
                            realm.delete(
                              realm.objects(Schema).filtered('uuid ="' + record+ '"')
                            );
                        }
                        // realm?.delete(realm.objectForPrimaryKey(Schema, record));
                        resolve();
                    });
                }
                else {
                    reject();
                }  
            } catch (e) {
                console.log(e.message,"..error in delete..");
                reject();
            }
        });
    }

    public async deleteAll(entitySchema: ObjectSchema): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
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
export const userRealmCommon = UserRealmCommon.getInstance();

// export default userRealmCommon;