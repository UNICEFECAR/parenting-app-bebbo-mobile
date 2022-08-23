import { ObjectSchema } from "realm";
import { StandDevObjEntity, StandDevObj } from "./StandardDevWeightForHeightSchema";

export type StandardDevHeightForAgeEntity = {
    child_age: number[],
    goodText: StandDevObjEntity,
    warrningSmallLengthText: StandDevObjEntity,
    emergencySmallLengthText: StandDevObjEntity,
    warrningBigLengthText: StandDevObjEntity,
  };

  export const StandardDevHeightForAgeSchema: ObjectSchema = {
    name: 'StandardDevHeightForAgeEntity',
    properties: {
      child_age: { type: 'int[]' },
      goodText: 'StandDevObj',
      warrningSmallLengthText: 'StandDevObj',
      emergencySmallLengthText: 'StandDevObj',
      warrningBigLengthText: 'StandDevObj',      
    }
  };
