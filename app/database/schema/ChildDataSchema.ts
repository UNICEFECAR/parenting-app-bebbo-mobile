import { ObjectSchema } from "realm";
export type remiderType = "vaccine" | "healthCheckup";
export const MeasuresEntitySchema: ObjectSchema = {
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
  uuid: string;
  isChildMeasured: boolean;
  weight: string;
  height: string;
  measurementDate: number;
  titleDateInMonth: string;
  didChildGetVaccines: boolean;
  vaccineIds: string;
  doctorComment: string;
  measurementPlace: number;
}
export const ReminderEntitySchema: ObjectSchema = {
  name: "Reminder",
  embedded: true,
  properties: {
    uuid: { type: "string" },
    reminderType: { type: "string" },
    reminderDate: { type: "int" },
    reminderTime: { type: "int" },
    reminderDateDefined: { type: "int" },
    reminderTimeDefined: { type: "int" },
  }
}
export type ReminderEntity = {
  uuid: string;
  reminderType: remiderType;
  reminderDate: number;
  reminderTime: number;
  reminderDateDefined: number;
  reminderTimeDefined: number;
}

export type ChildEntity = {
  uuid: string;
  childName: string;
  gender: number | string;
  photoUri?: string;
  createdAt: Date;
  updatedAt: Date;
  plannedTermDate?: Date | undefined;
  birthDate?: Date | undefined;
  babyRating?: number;
  measures?: MeasuresEntity[];
  comment?: string;
  checkedMilestones?: number[];
  reminders?: ReminderEntity[];
  measurementPlace: string;
  isPremature?: string;
  isExpected?: string;
  isMigrated?: boolean;
  favoriteadvices?: number[];
  favoritegames?: number[];
  autoChild?: string;
};

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
    checkedMilestones: { type: "list", objectType: 'int', optional: true },
    reminders: { type: "list", objectType: "Reminder", default: [] },
    measurementPlace: { type: "string", optional: true },
    isPremature: { type: "string", optional: true },
    isExpected: { type: "string", optional: true },
    isMigrated: { type: 'bool', optional: true },
    favoriteadvices: { type: "list", objectType: 'int', optional: true },
    favoritegames: { type: "list", objectType: 'int', optional: true },
    autoChild: { type: "string", optional: false },
    
  }
};

