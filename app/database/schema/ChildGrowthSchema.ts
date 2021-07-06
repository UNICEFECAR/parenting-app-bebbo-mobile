import { ObjectSchema } from "realm";

export type ChildGrowthEntity = {
    id: number,
    type: string,
    title: string,
    body: string,
    growth_type: string,
    standard_deviation: string,
    child_age: string[],
    pinned_article: string,
    created_at: string,
    updated_at: string,
    mandatory: string,
  };


  export const ChildGrowthSchema: ObjectSchema = {
    name: 'ChildGrowthEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      body: { type: 'string' },
      growth_type: { type: 'string' },
      standard_deviation: { type: 'string' },
      child_age: { type: 'string[]' },
      pinned_article: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      mandatory: { type: 'string' },
    }
  };
