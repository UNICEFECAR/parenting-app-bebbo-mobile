import { ObjectSchema } from "realm";

export type FAQsEntity = {
    id: number,
    type: string,
    title: string,
    created_at: string,
    updated_at: string,
    body: string,
    chatbot_child_age: string,
    chatbot_sub_category: string,
    mandatory: number,
  };


  export const FAQsSchema: ObjectSchema = {
    name: 'FAQsEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      body: { type: 'string' },
      chatbot_child_age: { type: 'string' },
      chatbot_sub_category: { type: 'string' },      
      mandatory: { type: 'int' },
    }
  };
