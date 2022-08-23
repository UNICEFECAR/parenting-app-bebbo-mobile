import { ObjectSchema } from "realm";

export type FAQsEntity = {
    id: number,
    type: string,
    question: string,
    created_at: string,
    updated_at: string,
    answer_part_1: string,
    answer_part_2: string,
    chatbot_subcategory: number,
    related_article: number,
    mandatory: number,
  };

  export const FAQsSchema: ObjectSchema = {
    name: 'FAQsEntity',
    primaryKey: 'id',  
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      question: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      answer_part_1: { type: 'string' },
      answer_part_2: { type: 'string' },
      chatbot_subcategory: { type: 'int' },      
      related_article: { type: 'int' },      
      mandatory: { type: 'int' },
    }
  };
