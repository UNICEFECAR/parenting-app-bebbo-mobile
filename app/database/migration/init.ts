import { userRealmCommon } from './../dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from './../schema/ChildDataSchema';

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
      name: child.name,
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
      isPremature:'false',
      relationship:''
     };
  }
  // const getMeasurementData = (oldmeasure: { weight: any; length: any; measurementPlace: any; measurementDate: any; isChildMeasured: any; didChildGetVaccines: any; vaccineIds: string[] | undefined; doctorComment: string | undefined; }): MeasurementEntity => {
  //   const id = (Math.floor(1000 + Math.random() * 9000)).toString();
  //   return {
  //       id: id,
  //       weight: oldmeasure.weight,
  //       height: oldmeasure.length,
  //       measurementPlace: oldmeasure.measurementPlace,
  //       measurementDate: oldmeasure.measurementDate,
  //       isChildMeasured: oldmeasure.isChildMeasured,
  //       didChildGetVaccines: oldmeasure.didChildGetVaccines,
  //       vaccineIds: oldmeasure.vaccineIds ? oldmeasure.vaccineIds : [],
  //       doctorComment: oldmeasure.doctorComment ? oldmeasure.doctorComment : '',

  //   };
  // }