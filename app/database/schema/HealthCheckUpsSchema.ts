import { ObjectSchema } from "realm";

export type HealthCheckUpsEntity = {
    id: number,
    type: string,
    title: string,
    // body: string,
    growth_period: number,
    pinned_article: number,
    // notification_from: string,
    // notification_to: string,
    created_at: string,
    updated_at: string,
    // mandatory: string,
  };


  export const HealthCheckUpsSchema: ObjectSchema = {
    name: 'HealthCheckUpsEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      // body: { type: 'string' },
      growth_period: { type: 'int' },
      pinned_article: { type: 'int' },
      // notification_from: { type: 'string' },
      // notification_to: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      // mandatory: { type: 'string' },
    }
  };
