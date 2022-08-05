import {ObjectSchema} from 'realm';
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
