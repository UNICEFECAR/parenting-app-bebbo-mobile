import {ObjectSchema} from 'realm';
// import  userRealmCommon  from '../dbquery/userRealmCommon';
// import { getUserRealm } from '../config/dbConfig'
// console.log("userRealmCommon out--",userRealm);
// const userRealm = getUserRealm();
export type MeasurementEntity = {
    id: string;
    weight: string;
    height: string;
    measurementPlace: string,
    measurementDate: Date;
    isChildMeasured: Boolean;
    didChildGetVaccines?: Boolean;
    vaccineIds?: string[];
    doctorComment?: string;
  };

  export const MeasurementEntitySchema: ObjectSchema = {
    name: 'MeasurementEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
        id: { type: 'string' },
        weight: { type: 'string' },
        height: { type: 'string' },
        measurementPlace: { type: 'string' },
        measurementDate: { type: 'date' },
        isChildMeasured: { type: 'bool' },
        didChildGetVaccines: { type: 'bool', optional: true },
        vaccineIds: { type: 'string[]', optional: true },
        doctorComment: { type: 'string', optional: true },
    }
  };
