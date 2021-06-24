import { ObjectSchema } from "realm";

export type ChildDevelopmentEntity = {
    id: string,
    type: string,
    title: string,
    body: string,
    child_age: string,
    boy_article: string,
    girl_article: string,
    milestone: string,
    created_at: string,
    updated_at: string,
    mandatory: string,
  };


  export const ChildDevelopmentSchema: ObjectSchema = {
    name: 'ChildDevelopmentEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'string' },
      type: { type: 'string' },
      title: { type: 'string' },
      body: { type: 'string' },
      child_age: { type: 'string' },
      boy_article: { type: 'string' },
      girl_article: { type: 'string' },
      milestone: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      mandatory: { type: 'string' },
    }
  };
