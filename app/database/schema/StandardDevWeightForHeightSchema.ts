import { ObjectSchema } from "realm";

export type StandDevObjEntity = {
  name:string;
  text:string;
}

export type StandardDevWeightForHeightEntity = {
    // id: number,
    child_age: string[],
    goodText: StandDevObjEntity,
    warrningSmallHeightText: StandDevObjEntity,
    emergencySmallHeightText: StandDevObjEntity,
    warrningBigHeightText: StandDevObjEntity,
    emergencyBigHeightText: StandDevObjEntity,
    // goodText: StandDevObjEntity,
    
  };

  export const StandDevObj: ObjectSchema = {
    name: "StandDevObj",
    embedded: true,
    properties: {
      name: { type: 'string' },
      text: { type: 'string' },
    }
  }
  export const StandardDevWeightForHeightSchema: ObjectSchema = {
    name: 'StandardDevWeightForHeightEntity',
    // primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      // id: { type: 'int' },
      child_age: { type: 'string[]' },
      goodText: 'StandDevObj',
      warrningSmallHeightText: 'StandDevObj',
      emergencySmallHeightText: 'StandDevObj',
      warrningBigHeightText: 'StandDevObj',
      emergencyBigHeightText: 'StandDevObj',
      // goodText: 'StandDevObj',
      
    }
  };
