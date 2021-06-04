import { MeasurementEntitySchema } from "../schema/measurementDataSchema";

export const migrateuserRealm = async (oldRealm:any,newRealm: any) => {
    console.log(oldRealm,"------",newRealm);
    const oldObjects = oldRealm.objects('ChildEntity');
    const newObjects = newRealm.objects('ChildEntity');
    console.log(oldObjects,"------",newObjects);

    // oldrealm = Array.from(oldrealm);
    let oldmeasurements = JSON.parse(oldObjects[0].measures);
    // console.log("oldrealm measures", userRealmCommon);
    console.log("oldrealm measures len", (oldmeasurements).length);

    oldmeasurements.forEach(async (element: any) => {
        console.log("element--",element);
        element.measurementDate = new Date(element.measurementDate);
        console.log("userRealmCommon--");

        let createresult = newRealm.create(MeasurementEntitySchema.name, getMeasurementData(element));
        console.log("createresult ",createresult);
    });
    console.log("latest data  ",newRealm.objects(MeasurementEntitySchema.name))

  }
  const getMeasurementData = (oldmeasure: { weight: any; length: any; measurementPlace: any; measurementDate: any; isChildMeasured: any; didChildGetVaccines: any; vaccineIds: string[] | undefined; doctorComment: string | undefined; }): MeasurementEntity => {
    const id = (Math.floor(1000 + Math.random() * 9000)).toString();
    return {
        id: id,
        weight: oldmeasure.weight,
        height: oldmeasure.length,
        measurementPlace: oldmeasure.measurementPlace,
        measurementDate: oldmeasure.measurementDate,
        isChildMeasured: oldmeasure.isChildMeasured,
        didChildGetVaccines: oldmeasure.didChildGetVaccines,
        vaccineIds: oldmeasure.vaccineIds ? oldmeasure.vaccineIds : [],
        doctorComment: oldmeasure.doctorComment ? oldmeasure.doctorComment : '',

    };
  }