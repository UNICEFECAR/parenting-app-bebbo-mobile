import { ObjectSchema } from "realm";


export type TaxonomyEntity = {
    langCode: string,
    allData?: string,
    standardDevData?: string,
  };


  export const TaxonomySchema: ObjectSchema = {
    name: 'Taxonomy',
    primaryKey: 'langCode',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
        langCode: { type: 'string' },
        allData: { type: 'string',optional: true },
        standardDevData: { type: 'string',optional: true},
    }
  };