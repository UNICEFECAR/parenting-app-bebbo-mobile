import { ObjectSchema } from "realm";

export type ChildDevelopmentEntity = {
    id: number,
    type: string,
    title: string,
    // body: string,
    child_age: number[],
    boy_video_article: number,
    girl_video_article: number,
    milestone: string,
    created_at: string,
    updated_at: string,
    mandatory: number,
  };


  export const ChildDevelopmentSchema: ObjectSchema = {
    name: 'ChildDevelopmentEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      // body: { type: 'string' },
      child_age: { type: 'int[]' },
      boy_video_article: { type: 'int' },
      girl_video_article: { type: 'int' },
      milestone: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      mandatory: { type: 'int' },
    }
  };
