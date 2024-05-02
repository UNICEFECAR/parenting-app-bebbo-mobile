import { ObjectSchema } from "realm";

  export type ActivityHistoryEntity = {
    keyword: string;
    createdAt: Date;
  };
  export const ActivitySearchHistorySchema: ObjectSchema = {
    name: 'ActivitySearchHistory',
    properties: {
      keyword: { type: 'string' },
      createdAt: { type: "date" },
  
    },
    primaryKey: 'keyword'
  };

  