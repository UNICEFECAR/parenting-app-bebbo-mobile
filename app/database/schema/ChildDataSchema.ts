import { ObjectSchema } from "realm";
export type ChildGender = "boy" | "girl" | "";

export const MeasuresEntitySchema = {
  name: "Measures",
  embedded: true,
  properties: {
    isChildMeasured: { type: "bool" },
    /**
     * Kg.
     */
    weight:{ type: "string" },

    /**
     * Centimeters.
     */
    length:{ type: "string" },

    /**
     * Timestamp in milliseconds.
     */
    measurementDate: { type: "date" ,optional:true},

    /**
     * Month in number for all child growth  listtitle 
     */
    titleDateInMonth: { type: "int" ,optional:true},

    didChildGetVaccines: { type: "bool" },

    /**
     * All received vaccines.
     */
    vaccineIds:{ type: "string[]" ,optional:true},

    doctorComment: { type: "string" ,optional:true},

    measurementPlace: { type: "string" },

  }
}
export type MeasuresEntity = {
  isChildMeasured:boolean,
  weight:string,
  length:string,
  measurementDate:Date,
  titleDateInMonth:number
  didChildGetVaccines:boolean,
  vaccineIds:string[],
  doctorComment:string,
  measurementPlace:string
}
export const ReminderEntitySchema = {
  name: "Reminder",
  embedded: true,
  properties: {
    date: { type: "date" },
    time: { type: "date" },
    uuid: { type: "string" }
  }
}
export type ReminderEntity = {
    date: Date,
    time: Date,
    uuid: string
}

export type ChildEntitySchema = {
  uuid: string;
  name: string;
  gender: ChildGender,
  photoUri?: string;
  createdAt: Date;
  updatedAt: Date;
  plannedTermDate?: Date | undefined;
  birthDate?: Date | undefined;
  relationship?:string;
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
      name: { type: "string" },
      gender: { type: "string" },
      photoUri: { type: "string", optional: true },
      createdAt: { type: "date" },
      updatedAt: { type: "date" },
      plannedTermDate: { type: "date", optional: true },
      birthDate: { type: "date", optional: true},
      babyRating: { type: "int", optional: true },
      measures: { type: "list", objectType:"Measures",default:[]},
      comment: { type: "string", optional: true },
      checkedMilestones: { type: "int[]", optional: true },
      reminders: {type: "list", objectType:"Reminder",default:[]},
      measurementPlace: {type: "string", optional: true},
      isPremature: {type: "string", optional: true},
      isExpected: {type: "string", optional: true}
      
  }
};

