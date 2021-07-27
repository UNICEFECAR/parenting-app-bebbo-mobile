import { ObjectSchema } from "realm";
// export type ChildGender = "boy" | "girl" | "";
export type remiderType = "vaccine" | "healthCheckup";
export const MeasuresEntitySchema = {
  name: "Measures",
  embedded: true,
  properties: {
    uuid: { type: "string" },
    isChildMeasured: { type: "bool" },
    weight: { type: "string" },
    height: { type: "string" },
    measurementDate: { type: "int", optional: true },
    titleDateInMonth: { type: "string", optional: true },
    didChildGetVaccines: { type: "bool" },
    vaccineIds: { type: "string", optional: true },
    doctorComment: { type: "string", optional: true },
    measurementPlace: { type: "int" },

  }
}
export type MeasuresEntity = {
  uuid: string,
  isChildMeasured: boolean,
  weight: string,
  height: string,
  measurementDate: number,
  titleDateInMonth: string
  didChildGetVaccines: boolean,
  vaccineIds: string,
  doctorComment: string,
  measurementPlace: number
}
export const ReminderEntitySchema = {
  name: "Reminder",
  embedded: true,
  properties: {
    uuid: { type: "string" },
    remiderType: { type: "string" },
    remiderDate: { type: "date" },
    remiderTime: { type: "date" },
  }
}
export type ReminderEntity = {
  uuid: string
  remiderType: remiderType,
  remiderDate: Date,
  remiderTime: Date,
}

export type ChildEntity = {
  uuid: string;
  childName: string;
  gender: number,
  photoUri?: string;
  createdAt: Date;
  updatedAt: Date;
  plannedTermDate?: Date | undefined;
  birthDate?: Date | undefined;
  //relationship?: string;
  babyRating?: number;
  measures?: MeasuresEntity[],
  comment?: string;
  checkedMilestones?: number[];
  reminders?: ReminderEntity[],
  measurementPlace: string;
  isPremature?: string;
  isExpected?: string;
};

/**
* Realm schema for ChildEntity.
*/
// add indexes if needed
// An index significantly increases the speed of certain read operations at 
//the cost of slightly slower write times and additional storage overhead. 
//Indexes are particularly useful for equality comparison, such as querying for an object 
//based on the value of a property.
// It’s best to only add indexes when optimizing the read performance for specific situations.
export const ChildEntitySchema: ObjectSchema = {
  name: "ChildEntity",
  primaryKey: "uuid",
  properties: {
    uuid: { type: "string" },
    childName: { type: "string" },
    gender: { type: "int" },
    photoUri: { type: "string", optional: true },
    createdAt: { type: "date" },
    updatedAt: { type: "date" },
    plannedTermDate: { type: "date", optional: true },
    birthDate: { type: "date", optional: true },
    babyRating: { type: "int", optional: true },
    measures: { type: "list", objectType: "Measures", default: [] },
    comment: { type: "string", optional: true },
    checkedMilestones: { type: "int[]", optional: true },
    reminders: { type: "list", objectType: "Reminder", default: [] },
    measurementPlace: { type: "string", optional: true },
    isPremature: { type: "string", optional: true },
    isExpected: { type: "string", optional: true }

  }
};

