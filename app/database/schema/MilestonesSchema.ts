
import { ObjectSchema } from "realm";

export type MilestonesEntity = {
    id: number,
    type: string,
    title: string,
    created_at: string,
    updated_at: string,
    body: string,
    child_age: string[],
    related_activities: string[],
    related_video_articles: string[],
    // related_articles: string[],
    
    mandatory: string,
  };


  export const MilestonesSchema: ObjectSchema = {
    name: 'MilestonesEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      body: { type: 'string' },
      child_age: { type: 'string[]' },
      related_activities: { type: 'string[]' },
      related_video_articles: { type: 'string[]' },
    //   related_articles: { type: 'string[]' },
      
      mandatory: { type: 'string' },
    }
  };
