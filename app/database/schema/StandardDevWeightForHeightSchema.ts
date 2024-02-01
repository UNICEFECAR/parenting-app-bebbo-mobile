import { ObjectSchema } from "realm";

export type StandDevObjEntity = {
  articleID: number[];
  name: string;
  text: string;
}

export type StandardDevWeightForHeightEntity = {
  child_age: number[];
  goodText: StandDevObjEntity;
  warrningSmallHeightText: StandDevObjEntity;
  emergencySmallHeightText: StandDevObjEntity;
  warrningBigHeightText: StandDevObjEntity;
  emergencyBigHeightText: StandDevObjEntity;
};

export const StandDevObj: ObjectSchema = {
  name: "StandDevObj",
  embedded: true,
  properties: {
    articleID: { type: 'list', objectType: 'int' },
    name: { type: 'string' },
    text: { type: 'string' },
  }
}
export const StandardDevWeightForHeightSchema: ObjectSchema = {
  name: 'StandardDevWeightForHeightEntity',

  properties: {
    child_age: { type: 'list', objectType: 'int' },
    goodText: 'StandDevObj',
    warrningSmallHeightText: 'StandDevObj',
    emergencySmallHeightText: 'StandDevObj',
    warrningBigHeightText: 'StandDevObj',
    emergencyBigHeightText: 'StandDevObj',
  }
};
