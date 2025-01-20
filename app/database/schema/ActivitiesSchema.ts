import { ObjectSchema } from 'realm';

export type CoverImageEntity = {
  url: string;
  name: string;
  alt: string;
}

export const CoverImage: ObjectSchema = {
  name: "CoverImage",
  embedded: true,
  properties: {
    url: { type: 'string' },
    name: { type: 'string' },
    alt: { type: 'string' },
  }
}
export type ActivitiesEntity = {
  id: number;
  type: string;
  title: string;
  created_at: string;
  updated_at: string;
  body: string;
  activity_category: number;
  equipment: number;
  type_of_support: number;
  child_age: number[];
  cover_image?: CoverImageEntity;
  related_milestone: number[];
  mandatory: number;
  embedded_images?: string[];
};


export const ActivitiesEntitySchema: ObjectSchema = {
  name: 'ActivitiesEntity',
  primaryKey: 'id',

  properties: {
    id: { type: 'int' },
    type: { type: 'string' },
    title: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    body: { type: 'string' },
    activity_category: { type: 'int' },
    equipment: { type: 'int' },
    type_of_support: { type: 'int' },
    child_age: { type: 'list', objectType: 'int' },
    cover_image: 'CoverImage',
    related_milestone: { type: 'list', objectType: 'int', },
    mandatory: { type: 'int' },
    embedded_images: { type: 'list', objectType: 'string', optional: true },
   
  }
};