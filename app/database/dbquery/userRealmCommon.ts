import { DateTime } from 'luxon';

import { Component } from 'react';
import Realm, { ObjectSchema } from 'realm';
import { getDiffinDays } from '../../services/childCRUD';
import { userRealmConfig } from '../config/dbConfig';
import { ActivitiesEntity, ActivitiesEntitySchema } from '../schema/ActivitiesSchema';
import { ArticleEntity, ArticleEntitySchema } from '../schema/ArticleSchema';
import { ChildEntity, ChildEntitySchema } from '../schema/ChildDataSchema';
import { dataRealmCommon } from './dataRealmCommon';
const deleteRealmFilesBeforeOpen = false;

class UserRealmCommon extends Component {
    public realm?: Realm;
    private static instance: UserRealmCommon;

    private constructor(props: any) {
        super(props);
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
            if (this.realm) {
                resolve(this.realm);
            } else {
                // Delete realm file
                if (deleteRealmFilesBeforeOpen) {
                    Realm.deleteFile(userRealmConfig);
                }
                // Open realm file
                Realm.open(userRealmConfig)
                    .then(realm => {
                        this.realm = realm;
                        resolve(realm);
                    })
                    .catch(error => {
                        resolve(error);
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
    public async getObjectLength<Entity>(entitySchema: ObjectSchema): Promise<Number> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const objLength = realm?.objects<Entity>(entitySchema.name).length;
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

    public async create<Entity>(entitySchema: ObjectSchema, records: Entity[]): Promise<Entity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        records.forEach(record => {
                            realm?.create<Entity>(entitySchema.name, record, "modified");
                        })

                        resolve(records);
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
    public async updatePhotoUri<Entity>(entitySchema: ObjectSchema, photoUri: any, condition: any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        obj[0].photoUri = photoUri;
                    });
                    resolve('success');
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
                reject('Fail');
            }
        });
    }
    public async deleteChildReminders<Entity>(entitySchema: ObjectSchema, reminder: any, condition: any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    let obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        if (obj[0].reminders.length > 0) {
                            let updateItemIndex = obj[0].reminders.findIndex(item => {
                                return item.uuid == reminder.uuid
                            });
                            obj[0].reminders.splice(updateItemIndex, 1);
                        }
                    });
                    resolve(obj[0].reminders);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
                reject('Fail');
            }
        });
    }
    public async updateChildReminders<Entity>(entitySchema: ObjectSchema, reminder: any, condition: any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    let obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        if (obj[0].reminders.length > 0) {
                            let updateItemIndex = obj[0].reminders.findIndex(item => {
                                return item.uuid == reminder.uuid
                            });
                            if (updateItemIndex != -1) {
                                obj[0].reminders[updateItemIndex] = reminder
                            } else {
                                obj[0].reminders.push(reminder);
                            }
                        } else {
                            obj[0].reminders.push(reminder);
                        }
                    });
                    resolve(obj[0].reminders);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
                reject('Fail');
            }
        });
    }
    public async deleteChildMeasures<Entity>(entitySchema: ObjectSchema, measure: any, condition: any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    let obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        if (obj[0].measures.length > 0) {
                            let updateItemIndex = obj[0].measures.findIndex(item => {
                                return item.uuid == measure.uuid
                            });
                            obj[0].measures.splice(updateItemIndex, 1);
                        }
                    });
                    resolve(obj[0].measures);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
                reject('Fail');
            }
        });
    }
    public async updateChildMeasures<Entity>(entitySchema: ObjectSchema, measures: any, condition: any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    let obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        if (obj[0].measures.length > 0) {
                            let updateItemIndex = obj[0].measures.findIndex(item => {
                                return item.uuid == measures.uuid
                            });
                            if (updateItemIndex != -1) {
                                obj[0].measures[updateItemIndex] = measures
                            } else {
                                obj[0].measures.push(measures);
                            }
                        } else {
                            obj[0].measures.push(measures);
                        }
                    });
                    resolve(obj[0].measures);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
                reject('Fail');
            }
        });
    }
    public async updateChild<Entity>(entitySchema: ObjectSchema, records: Entity[]): Promise<Entity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    realm.write(() => {
                        records.forEach((record: any) => {
                            record.updatedAt = new Date();
                            realm?.create<Entity>(entitySchema.name, record, "modified");
                        })
                        resolve(records);
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
    public async updateChildMilestones<Entity>(entitySchema: ObjectSchema, milestoneId: any, condition: any): Promise<Entity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    let obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        if (obj[0].checkedMilestones.length > 0) {
                            let updateItemIndex = obj[0].checkedMilestones.findIndex(item => {
                                return item == milestoneId
                            });
                            if (updateItemIndex == -1) {
                                obj[0].checkedMilestones.push(milestoneId);
                            } else {
                                obj[0].checkedMilestones.splice(updateItemIndex, 1);
                            }
                        } else {
                            obj[0].checkedMilestones.push(milestoneId);
                        }
                    });
                    resolve('success');
                }
                else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }
    public async updateFavorites<Entity>(entitySchema: ObjectSchema, favoriteid: any, favoritetype: any, condition: any): Promise<Entity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    let obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        if (favoritetype == 'advices') {
                            if (obj[0].favoriteadvices.length > 0) {
                                let updateItemIndex = obj[0].favoriteadvices.findIndex(item => {
                                    return item == favoriteid
                                });
                                if (updateItemIndex == -1) {
                                    obj[0].favoriteadvices.push(favoriteid);
                                } else {
                                    obj[0].favoriteadvices.splice(updateItemIndex, 1);
                                }
                            } else {
                                obj[0].favoriteadvices.push(favoriteid);
                            }
                        } else if (favoritetype == 'games') {
                            if (obj[0].favoritegames.length > 0) {
                                let updateItemIndex = obj[0].favoritegames.findIndex(item => {
                                    return item == favoriteid
                                });
                                if (updateItemIndex == -1) {
                                    obj[0].favoritegames.push(favoriteid);
                                } else {
                                    obj[0].favoritegames.splice(updateItemIndex, 1);
                                }
                            } else {
                                obj[0].favoritegames.push(favoriteid);
                            }
                        }

                    });
                    resolve('success');
                }
                else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }
    public async verifyFavorites(): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                const realmdata = await dataRealmCommon.openRealm();
                if (realm && realmdata) {
                    let obj: any = realm?.objects<ChildEntity>(ChildEntitySchema.name);
                    realm?.write(() => {
                        if (obj.length > 0) {
                            obj.map((child: any) => {
                                let favoriteadvices = child.favoriteadvices;
                                let favoritegames = child.favoritegames;
                                favoritegames = [...favoritegames, 1234];
                                if (favoriteadvices.length > 0) {
                                    const filterQuery = favoriteadvices.map((x: any) => `id = '${x}'`).join(' OR ');
                                    let artobj: any = realmdata?.objects<ArticleEntity>(ArticleEntitySchema.name).filtered(filterQuery);
                                    const finaladvicesobj = favoriteadvices.filter((i: any) => artobj.find((f: any) => f.id === i));
                                    child.favoriteadvices = finaladvicesobj;
                                }
                                if (favoritegames.length > 0) {
                                    const filterQuery = favoritegames.map((x: any) => `id = '${x}'`).join(' OR ');
                                    let actobj: any = realmdata?.objects<ActivitiesEntity>(ActivitiesEntitySchema.name).filtered(filterQuery);
                                    const finalgamesobj = favoritegames.filter((i: any) => actobj.find((f: any) => f.id === i))
                                    child.favoritegames = finalgamesobj
                                }

                            })
                        }
                    });
                    resolve('success');
                }
                else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }
    public async getData<Entity>(entitySchema: ObjectSchema): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const obj = realm?.objects<Entity>(entitySchema.name);
                    resolve(obj);
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
                const realm = await this.openRealm();
                if (realm) {
                    const obj = realm?.objects<Entity>(entitySchema.name).filtered(filterData);
                    resolve(obj);
                }
                else {
                    reject();
                }
            } catch (e) {
                reject();
            }
        });
    }

    public async delete(Schema: string, record: any, filterCondition: any): Promise<String> {
        return new Promise(async (resolve, reject) => {
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
                        resolve('success');
                    });
                }
                else {
                    reject('error');
                }
            } catch (e: any) {
                reject('error');
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
    public async deleteBy(entitySchema: ObjectSchema, Condition: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    const allRecords = realm?.objects(entitySchema.name).filtered(Condition);
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
    public async deleteNestedMeasures<Entity>(entitySchema: ObjectSchema, param: any, condition: any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    let obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        if (obj[0].measures.length > 0) {
                            obj[0].measures.map((itemnew: any) => {
                                let updateItemIndex = obj[0].measures.findIndex((item, index) => {
                                    const measuredays = getDiffinDays(param, item.measurementDate);
                                    return measuredays < 0;
                                });
                                if (updateItemIndex >= 0) {
                                    obj[0].measures.splice(updateItemIndex, 1);
                                }

                            })
                        }
                    });
                    resolve(obj[0].measures);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
                reject('Fail');
            }
        });
    }
    public async deleteNestedReminders<Entity>(entitySchema: ObjectSchema, param: any, condition: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if (realm) {
                    let obj: any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                        if (obj[0].reminders.length > 0) {
                            let updateItemIndex = obj[0].reminders.findIndex(async item => {
                                let reminderDate: any = DateTime.fromMillis(item.reminderDate);
                                let newreminderDate: any = new Date(reminderDate);
                                const hours = new Date(item.reminderTime).getHours()
                                const mins = new Date(item.reminderTime).getMinutes()
                                newreminderDate.setHours(hours);
                                newreminderDate.setMinutes(mins);
                                return DateTime.fromJSDate(new Date(newreminderDate)).toMillis() < param;
                            });
                            obj[0].reminders.splice(updateItemIndex, 1);
                        }
                    });
                    resolve(obj[0].reminders);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
                reject('Fail');
            }
        });
    }
}

export const userRealmCommon = UserRealmCommon.getInstance();