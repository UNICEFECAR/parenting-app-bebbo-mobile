import {ObjectSchema} from 'realm';
export type ChildGender = 'boy' | 'girl' | '';
// export type ChildType = {
//   uuid: string;
//   name: string;
//   gender: ChildGender;
//   photoUri?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   plannedTermDate?: Date;
//   birthDate?: Date | undefined;
//   isPremature?: string;
//   originalDOB?: Date;
//   // relationWithChild?:string;
//   //   babyRating?: number;
//   //   measures: string;
//   //   comment?: string;
//   //   checkedMilestones?: number[];
//   //   reminders?: string;
//   //   measurementPlace: string;
// };

// export const CHILD_SCHEMA = 'child';
// export const ChildEntity: ObjectSchema = {
//   name: CHILD_SCHEMA,
//   primaryKey: 'uuid',
//   properties: {
//     uuid: {type: 'string'},
//     name: {type: 'string'},
//     gender: {type: 'string'},
//     photoUri: {type: 'string', optional: true},
//     createdAt: {type: 'date'},
//     updatedAt: {type: 'date'},
//     expectedBirthDate: {type: 'date', optional: true},
//     birthDate: {type: 'date', optional: true},
//     isPremature: {type: 'string', optional: true},
//     originalDOB: {type: 'date', optional: true},
//     // babyRating: {type: 'int', optional: true},
//     // measures: {type: 'string', optional: true},
//     // comment: {type: 'string', optional: true},
//     // checkedMilestones: {type: 'int[]', optional: true},
//     // reminders: {type: 'string', optional: true},
//   },
// };


export type ChildEntity = {
  uuid: string;
  name: string;
  gender: ChildGender,
  photoUri?: string;
  createdAt: Date;
  updatedAt: Date;
  plannedTermDate?: Date | undefined;
  birthDate?: Date | undefined;
  relationship:string;
  babyRating?: number;
  // measures: string;
  comment?: string;
  // checkedMilestones?: number[];
  // reminders?: string;
  measurementPlace: string;
  isPremature?: string;
};

/**
* Realm schema for ChildEntity.
*/

export const ChildEntitySchema: ObjectSchema = {
  name: 'ChildEntity',
  primaryKey: 'uuid',

  // API: https://bit.ly/3f7k9jq
  properties: {
      uuid: { type: 'string' },
      name: { type: 'string' },
      gender: { type: 'string' },
      photoUri: { type: 'string', optional: true },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
      plannedTermDate: { type: 'date', optional: true },
      relationship:{ type:'string'},
      birthDate: { type: 'date'},
      babyRating: { type: 'int', optional: true },
      // measures: { type: 'string', optional: true },
      comment: { type: 'string', optional: true },
      // checkedMilestones: { type: 'int[]', optional: true },
      // reminders: {type: 'string', optional: true},
      measurementPlace: {type: 'string', optional: true},
      isPremature: {type: 'string', optional: true},
  
  }
};

