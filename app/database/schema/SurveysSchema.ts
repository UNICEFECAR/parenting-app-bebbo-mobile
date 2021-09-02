import { ObjectSchema } from "realm";

export type SurveysEntity = {
    id: number,
    type: string,
    title: string,
    body: string,
    survey_link: string,
    created_at: string,
    updated_at: string,
  };


  export const SurveysSchema: ObjectSchema = {
    name: 'SurveysEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      body: { type: 'string' },
      survey_feedback_link: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' }
    }
  };
