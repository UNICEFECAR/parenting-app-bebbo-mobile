import { ObjectSchema } from "realm";


export type TaxonomyEntity = {
    langCode: string,
    allData: string,
    standardDeviationData: string,
  };


  export const TaxonomySchema: ObjectSchema = {
    name: 'Taxonomy',
    primaryKey: 'langCode',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
        langCode: { type: 'string' },
        allData: { type: 'string',optional: true },
        standardDeviationData: { type: 'string',optional: true},
    }
  };