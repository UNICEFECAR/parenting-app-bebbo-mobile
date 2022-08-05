import { ObjectSchema } from "realm";

export type TaxonomyEntity = {
    langCode: string,
    allData?: string,
    standardDevData?: string,
  };

  export const TaxonomySchema: ObjectSchema = {
    name: 'Taxonomy',
    primaryKey: 'langCode',
  
    properties: {
        langCode: { type: 'string' },
        allData: { type: 'string',optional: true },
        standardDevData: { type: 'string',optional: true},
    }
  };