import { ObjectSchema } from "realm";

export type HealthCheckUpsEntity = {
    id: number;
    type: string;
    title: string;
    growth_period: number;
    pinned_article: number;
    created_at: string;
    updated_at: string;
  };


  export const HealthCheckUpsSchema: ObjectSchema = {
    name: 'HealthCheckUpsEntity',
    primaryKey: 'id',
  
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      growth_period: { type: 'int' },
      pinned_article: { type: 'int' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
    }
  };
