import { ObjectSchema } from "realm";

export type VaccinationEntity = {
    id: number,
    type: string,
    title: string,
    pinned_article: string,
    growth_period: string,
    created_at: string,
    updated_at: string,
  };


  export const VaccinationSchema: ObjectSchema = {
    name: 'VaccinationEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      pinned_article: { type: 'string' },
      growth_period: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
    }
  };
