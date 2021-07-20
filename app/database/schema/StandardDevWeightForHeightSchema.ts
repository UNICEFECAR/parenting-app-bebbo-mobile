import { ObjectSchema } from "realm";

export type StandDevObjEntity = {
  articleID:number[],
  name:string;
  text:string;
}

export type StandardDevWeightForHeightEntity = {
    // id: number,
    child_age: number[],
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
      articleID:{ type: 'int[]' },
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
      child_age: { type: 'int[]' },
      goodText: 'StandDevObj',
      warrningSmallHeightText: 'StandDevObj',
      emergencySmallHeightText: 'StandDevObj',
      warrningBigHeightText: 'StandDevObj',
      emergencyBigHeightText: 'StandDevObj',
      // goodText: 'StandDevObj',
      
    }
  };
