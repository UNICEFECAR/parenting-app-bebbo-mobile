import { ObjectSchema } from "realm";

export type DailyHomeMessagesEntity = {
    id: number;
    type: string;
    title: string;
    created_at: string;
    updated_at: string;
  };

  export const DailyHomeMessagesSchema: ObjectSchema = {
    name: 'DailyHomeMessagesEntity',
    primaryKey: 'id',  
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
    }
  };
