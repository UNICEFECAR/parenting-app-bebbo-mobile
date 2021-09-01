import { AnyAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import { Component } from 'react';
import Realm, { ObjectSchema, Collection } from 'realm';
import { getDiffinDays } from '../../services/childCRUD';
import { userRealmConfig } from '../config/dbConfig';
import { ChildEntity, ChildEntitySchema } from '../schema/ChildDataSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from '../schema/ConfigSettingsSchema';
import { dataRealmCommon } from './dataRealmCommon';
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
                // this.realm.addListener('change', this.onRealmChange);
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
                     //   this.realm.addListener('change', this.onRealmChange);
                        resolve(realm);
                    })
                    .catch(error => {
                        resolve(error);
                    });
            }
        });
    }
    // private onRealmChange() {
    //      this.forceUpdate();
    // }
    public closeRealm() {
        if (this.realm) {
           // console.log("closed");
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
                if(realm)
                {
                    const objLength = realm?.objects<Entity>(entitySchema.name).length;
                 //   console.log("in try",objLength);
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
                   // console.log("in try--",records);
                    realm.write(() => {
                        records.forEach(record => {
                          //  console.log("record",record);
                            realm?.create<Entity>(entitySchema.name, record,"modified");
                        })
                            
                        resolve(records);
                    });
                }
                else {
                    reject();
                }
            } catch (e) {
               // console.log("realm error-",e);
                reject();
            }
        });
    }
    public async updatePhotoUri<Entity>(entitySchema: ObjectSchema,photoUri:any,condition:any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    const obj:any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                   // console.log(obj[0].uuid,"..uuid..")
                    realm?.write(() => {
                        obj[0].photoUri = photoUri;
                    });
                   resolve('success');
                // console.log("Language is: "+ obj[0].photoUri );
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
               // console.log("realm error-",e);
               reject('Fail');
            }
        });
    }
    public async deleteChildReminders<Entity>(entitySchema: ObjectSchema,reminder:any,condition:any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    let obj:any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    console.log(obj[0],"obj0");
                    realm?.write(() => {
                        console.log(obj[0].reminders.length,"length")
                    if(obj[0].reminders.length>0){
                        let updateItemIndex = obj[0].reminders.findIndex(item=>{
                            console.log(reminder.uuid,"reminder.uuid",item.uuid)
                            return item.uuid==reminder.uuid
                          });
                          console.log(updateItemIndex,"updateItemIndex")
                          obj[0].reminders.splice(updateItemIndex, 1);
                        //   console.log(updateItemIndex)
                        console.log(obj[0].reminders,"obj[0].reminders1")
                        // obj[0].reminders.map((item)=>{
                        //  console.log(item,"inside reminders")   
                        // })
                          
                    }
                    });
                    // obj[0].reminders.map((item)=>{
                    //     console.log(item,"inside reminders11")   
                    //    })
                    console.log(obj[0].reminders,"obj[0].reminders2")
                   resolve(obj[0].reminders);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
               console.log("realm error-",e.message);
               reject('Fail');
            }
        });
    }
    public async updateChildReminders<Entity>(entitySchema: ObjectSchema,reminder:any,condition:any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    let obj:any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    realm?.write(() => {
                    if(obj[0].reminders.length>0){
                        let updateItemIndex = obj[0].reminders.findIndex(item=>{
                            return item.uuid==reminder.uuid
                          });
                          console.log(updateItemIndex,"reminderupdateIndex")
                          if(updateItemIndex!=-1){
                            obj[0].reminders[updateItemIndex]= reminder
                          }else{
                            obj[0].reminders.push(reminder);
                          }
                    }else{
                        obj[0].reminders.push(reminder);
                    }
                    });
                   resolve(obj[0].reminders);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
               console.log("realm error-",e.message);
               reject('Fail');
            }
        });
    }
    public async deleteChildMeasures<Entity>(entitySchema: ObjectSchema,measure:any,condition:any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    let obj:any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    console.log(obj[0],"obj0");
                    realm?.write(() => {
                    console.log(obj[0].measures.length,"length")
                    if(obj[0].measures.length>0){
                        let updateItemIndex = obj[0].measures.findIndex(item=>{
                            console.log(measure.uuid,"measure.uuid",item.uuid)
                            return item.uuid==measure.uuid
                          });
                          console.log(updateItemIndex,"updateItemIndex")
                          obj[0].measures.splice(updateItemIndex, 1);
                        //   console.log(updateItemIndex)
                        console.log(obj[0].measures,"obj[0].measures1")
                        // obj[0].reminders.map((item)=>{
                        //  console.log(item,"inside reminders")   
                        // })
                          
                    }
                    });
                    // obj[0].reminders.map((item)=>{
                    //     console.log(item,"inside reminders11")   
                    //    })
                    console.log(obj[0].measures,"obj[0].measures2")
                   resolve(obj[0].measures);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
               console.log("realm error-",e.message);
               reject('Fail');
            }
        });
    }
    public async updateChildMeasures<Entity>(entitySchema: ObjectSchema,measures:any,condition:any): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    // console.log(realm);
                    let obj:any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                //    console.log(obj,obj[0]);
                //    console.log(typeof obj[0].measures)
                    realm?.write(() => {
                    if(obj[0].measures.length>0){
                        let updateItemIndex = obj[0].measures.findIndex(item=>{
                            return item.uuid==measures.uuid
                          });
                        //   console.log(updateItemIndex)
                          if(updateItemIndex!=-1){
                            obj[0].measures[updateItemIndex]= measures
                          }else{
                            obj[0].measures.push(measures);
                          }
                    }else{
                        obj[0].measures.push(measures);
                    }
                       
                        // const abc = obj[0].measures.push(measures);
                        // obj[0].measures = [...abc]
                        //obj[0].measures = [...obj[0].measures,measures];
                        
                       
                    });
                   resolve(obj[0].measures);
                // console.log("Language is: "+ obj[0].photoUri );
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
               console.log("realm error-",e.message);
               reject('Fail');
            }
        });
    }
    public async updateChild<Entity>(entitySchema: ObjectSchema,records:Entity[]): Promise<Entity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                   // console.log("in try--",records);
                    realm.write(() => {
                        records.forEach((record:any) => {
                           //  console.log("record",record);
                             record.updatedAt=new Date();
                             realm?.create<Entity>(entitySchema.name, record,"modified");
                         })
                             
                        // if (
                        //     realm.objects(entitySchema.name).filtered(filteredCondition)
                        //       .length > 0
                        //   ) {
                        //     //let collectionPages = Object.assign([], realm.objects(Schema));
                        //     realm.create(
                        //       realm.objects(entitySchema.name).filtered(filteredCondition),record,"modified"
                        //     );
                        // }
                        resolve(records);
                    });
                }
                else {
                    reject();
                }
            } catch (e) {
               // console.log("realm error-",e);
                reject();
            }
        });
    }
    public async updateChildMilestones<Entity>(entitySchema: ObjectSchema,milestoneId:any,condition:any): Promise<Entity[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    let obj:any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    // console.log(obj,obj[0]);
                    // console.log(obj[0].checkedMilestones)
                        realm?.write(() => {
                            // obj[0].checkedMilestones = [];
                        if(obj[0].checkedMilestones.length>0){
                            let updateItemIndex = obj[0].checkedMilestones.findIndex(item=>{
                                return item==milestoneId
                            });
                            // console.log(updateItemIndex)
                            if(updateItemIndex==-1){
                                obj[0].checkedMilestones.push(milestoneId);
                            }else{
                                obj[0].checkedMilestones.splice(updateItemIndex,1);
                            }
                        }else{
                            obj[0].checkedMilestones.push(milestoneId);
                        }

                        // console.log(obj[0],"after change");
                        
                            // const abc = obj[0].measures.push(measures);
                            // obj[0].measures = [...abc]
                            //obj[0].measures = [...obj[0].measures,measures];
                            
                        
                        });
                   resolve('success');
                }
                else {
                    reject();
                }
            } catch (e) {
               // console.log("realm error-",e);
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
                    //console.log("in try",obj);
                    resolve(obj);
                    //console.log("---",realm.schema);
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
                     //console.log("filtered obj--",obj.length);
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
  
    public async delete(Schema:string,record: any,filterCondition:any): Promise<String> {
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
    // public async getAllChildren(context?: UserRealmContextValue): Promise<Child[]> {
    //     let allChildren = context ?
    //         context.realm?.objects<ChildEntity>(ChildEntitySchema.name).map(child => child) :
    //         userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name).map(child => child);
    //         let currentChild:any=null;
    //     // let currentChild = this.getCurrentChild()?.uuid;
    //     let currentActiveChildId = await dataRealmCommon.getFilteredData<ConfigSettingsEntity>(ConfigSettingsSchema, "key='currentActiveChildId'");
    //     if (currentActiveChildId?.length > 0) {
    //         currentChild = currentActiveChildId[0].value;
    //     }
    //     let allChildrenList: Child[] = [];
    
    //     if (allChildren) {
    
    //         allChildrenList = allChildren?.map(child => {
    //             let birthDay = child.birthDate ?
    //                 DateTime.fromJSDate(child.birthDate).toFormat("dd'.'MM'.'yyyy") : "";
    
    //             let imgUrl = child.photoUri ? utils.addPrefixForAndroidPaths(`${RNFS.DocumentDirectoryPath}/${child.photoUri}`) : null;
    //             let isCurrentActive = false;
    
    //             if (currentChild) {
    //                 if (currentChild === child.uuid) {
    //                     isCurrentActive = true;
    //                 }
    //             };
    
    //             return {
    //                 childId: child.uuid,
    //                 birthDay: birthDay,
    //                 name: child.name,
    //                 photo: imgUrl,
    //                 gender: child.gender,
    //                 isCurrentActive: isCurrentActive,
    //                 id: child.uuid,
    //             };
    //         });
    //     };
    
    
    //     return allChildrenList;
    // };
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
    public async deleteBy(entitySchema: ObjectSchema,Condition:any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    const allRecords = realm?.objects(entitySchema.name).filtered(Condition);
                    console.log(allRecords,"..allRecords..")
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
    public async deleteNestedMeasures<Entity>(entitySchema: ObjectSchema,param:any,condition:any): Promise<String>{
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    let obj:any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    console.log(obj[0],"obj0");
                    realm?.write(() => {
                    console.log(obj[0].measures,"length")
                    if(obj[0].measures.length>0){
                         let updateItemIndex = obj[0].measures.findIndex(async (item,index)=>{
                            console.log("measure.uuid",);
                            const measuredays=await getDiffinDays(param,item.measurementDate);
                            console.log(measuredays,"..measuredays")
                            return measuredays<0?index:0;
                          });
                           console.log(updateItemIndex,"..measureupdateItemIndex")
                           obj[0].measures.splice(updateItemIndex, 1);
                       }
                    });
                    resolve(obj[0].measures);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
               console.log("realm error-",e.message);
               reject('Fail');
            }
        });
    }
    public async deleteNestedReminders<Entity>(entitySchema: ObjectSchema,param:any,condition:any): Promise<any>{
        return new Promise(async (resolve, reject) => {
            try {
                const realm = await this.openRealm();
                if(realm)
                {
                    let obj:any = realm?.objects<Entity>(entitySchema.name).filtered(condition);
                    console.log(obj[0],"obj0");
                    realm?.write(() => {
                    console.log(obj[0].reminders,"length")
                      if(obj[0].reminders.length>0){
                        let updateItemIndex = obj[0].reminders.findIndex(async item=>{
                            let reminderDate:any = DateTime.fromMillis(item.reminderDate);
                            let newreminderDate:any=new Date(reminderDate);
                            // let reminderTime = DateTime.fromMillis(vaccineReminder?.reminderTime);
                            const hours = new Date(item.reminderTime).getHours()
                            const mins = new Date(item.reminderTime).getMinutes()
                            newreminderDate.setHours(hours);
                            newreminderDate.setMinutes(mins);
                            console.log(newreminderDate,"..newreminderDate")
                            return DateTime.fromJSDate(new Date(newreminderDate)).toMillis()<param;
                         });
                         console.log(updateItemIndex,"..updateItemIndex")
                         obj[0].reminders.splice(updateItemIndex, 1);
                      }
                    });
                    resolve(obj[0].reminders);
                }
                else {
                    reject('Fail');
                }
            } catch (e) {
               console.log("realm error-",e.message);
               reject('Fail');
            }
        });
    }
}

export const userRealmCommon = UserRealmCommon.getInstance();

// export default userRealmCommon;