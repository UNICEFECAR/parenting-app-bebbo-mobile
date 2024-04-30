import { ObjectSchema } from "realm";

export type ViewDetailsEntity = {
  id: number;
  type: string;
  isViewed: boolean;
  viewCount: number;
};
export const ArticleActivityViewSchema: ObjectSchema = {
  name: 'ArticleActivityView',
  properties: {
    id: { type: 'int' },
    type: { type: 'string' },
    isViewed: { type: 'bool', optional: false },
    viewCount: { type: 'int', default: 0 }
  },
  primaryKey: 'id'
};

