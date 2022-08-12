
import { ObjectSchema } from "realm";
export type MilestonesEntity = {
    id: number;
    type: string;
    title: string;
    created_at: string;
    updated_at: string;
    body: string;
    child_age: number[];
    related_activities: number[];
    related_video_articles: number[];
    related_articles: number[];
    mandatory: number;
  };

  export const MilestonesSchema: ObjectSchema = {
    name: 'MilestonesEntity',
    primaryKey: 'id',
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      body: { type: 'string' },
      child_age: { type: 'int[]' },
      related_activities: { type: 'int[]' },
      related_video_articles: { type: 'int[]' },
      related_articles: { type: 'int[]' },
      mandatory: { type: 'int' },
    }
  };
