import { ChildEntity, ChildEntitySchema } from '../schema/ChildDataSchema';
import { ConfigSettingsEntity, ConfigSettingsSchema } from './../schema/ConfigSettingsSchema';

export const migrateuserRealm = async (oldRealm:any,newRealm: any) => {
    //console.log(oldRealm,"------",newRealm);
    const oldObjects = oldRealm.objects('ChildEntity');
    const newObjects = newRealm.objects('ChildEntity');
    //console.log(oldObjects,"------",newObjects);

    // oldrealm = Array.from(oldrealm);
    // let oldmeasurements = JSON.parse(oldObjects[0].measures);
    // console.log("oldrealm measures", userRealmCommon);
    // let oldChildrenData = JSON.parse(oldObjects);
    let oldChildrenData = oldObjects;
    //console.log("oldrealm len", (oldChildrenData).length);
    if(oldChildrenData?.length>0){
    // let deleteresult = newRealm.deleteAll();
    oldChildrenData.map((item: any) => {
     // console.log(getChild(item),"..item..");
    let createresult = newRealm.create(ChildEntitySchema.name, getChild(item));
      //console.log(createresult,".....createresult...");
    });

    }
    // oldmeasurements.forEach(async (element: any) => {
    //     console.log("element--",element);
    //     element.measurementDate = new Date(element.measurementDate);
    //     console.log("userRealmCommon--");

    //     let createresult = newRealm.create(MeasurementEntitySchema.name, getMeasurementData(element));
    //     console.log("createresult ",createresult);
    // });
    //console.log("latest data  ",newRealm.objects(MeasurementEntitySchema.name))

  }
  const getChild = (child:ChildEntity) => {
    return {
      uuid: child.uuid,
      name: child.childName,
      gender: child.gender,
      photoUri: child.photoUri,
      createdAt: child.createdAt,
      updatedAt: child.updatedAt,
      plannedTermDate: child.plannedTermDate,
      birthDate: child.birthDate,
      babyRating:child.babyRating,
      measures: child.measures,
      comment: child.comment,
      checkedMilestones:child.checkedMilestones,
      reminders: child.reminders,
      isPremature:'false', //calcualte if its premature or not?
      //relationship:''
     };
  }
  export const migrateConfigSettings = async (oldRealm:any,newRealm: any) => {
    //console.log(oldRealm,"------",newRealm);
    const oldObjects = oldRealm.objects('VariableEntity').filtered("key=='currentActiveChildId' OR key=='userParentalRole' OR key=='userName'  OR key=='userEnteredChildData'");
    //const oldObjects = oldRealm.objects('VariableEntity').filtered("key=='userName'");
    const newObjects = newRealm.objects(ConfigSettingsSchema.name);
    //console.log(oldObjects.length,"------",newObjects);
    let oldChildrenData = oldObjects;
    if(oldChildrenData?.length>0){
    oldChildrenData.map((item: any) => {
    let createresult = newRealm.create(ConfigSettingsSchema.name, getVariableEntity(item));
    //console.log(createresult,".....createresult...");
    });
    }
   
  }
  const getVariableEntity = (variable:ConfigSettingsEntity) => {
   // console.log(variable,"..variable..");
    return {
      key: variable.key,
      value: variable.value,
      createdAt: new Date(),
      updatedAt: new Date(),
     };
  } 