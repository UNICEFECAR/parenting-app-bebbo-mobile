import { ObjectSchema } from "realm";

  export type HistoryEntity = {
    keyword: string;
    createdAt: Date;
  };
  export const SearchHistorySchema: ObjectSchema = {
    name: 'SearchHistory',
    properties: {
      keyword: { type: 'string' },
      createdAt: { type: "date" },
  
    },
    primaryKey: 'keyword'
  };

  