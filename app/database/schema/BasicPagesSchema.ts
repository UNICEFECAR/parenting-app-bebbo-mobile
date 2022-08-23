import { ObjectSchema } from "realm";

  export type BasicPagesEntity = {
    id: number,
    type: string,
    title: string,
    created_at: string,
    updated_at: string,
    body: string,
    mandatory: number,
    unique_name:string,
    embedded_images?: string[]
  };
  export const BasicPagesSchema: ObjectSchema = {
    name: 'BasicPagesEntity',
    primaryKey: 'id',
  
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      body: { type: 'string' },
      mandatory: { type: 'int' },
      unique_name: { type: 'string' },
      embedded_images: { type: 'string[]',optional: true}
    }
  };

  