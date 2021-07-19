import {ObjectSchema} from 'realm';

// export type CoverVideoEntity = {
//   url:string;
//   name:string;
//   site:string;
// }
export type CoverImageEntity = {
  url:string;
  name:string;
  alt:string;
}

// export const CoverVideo: ObjectSchema = {
//   name: "CoverVideo",
//   embedded: true,
//   properties: {
//     url: { type: 'string' },
//     name: { type: 'string' },
//     site: { type: 'string' },
//   }
// }
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
    id: number,
    // langcode?:string,
    type: string,
    title: string,
    created_at: string,
    updated_at: string,
    body: string,
    // summary: string,
    activity_category: number,
    equipment: number,
    type_of_support: number,
    child_age: number[],
    // cover_video?: CoverVideoEntity,
    cover_image?: CoverImageEntity,
    related_articles: number[],
    mandatory: number,
  };


  export const ActivitiesEntitySchema: ObjectSchema = {
    name: 'ActivitiesEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      // langcode: { type: 'string',optional: true },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      body: { type: 'string'},
      // summary: { type: 'string' },
      activity_category: { type: 'int' },
      equipment: { type: 'int' },
      type_of_support: { type: 'int' },
      child_age: { type: 'int[]' },
      // cover_video: 'CoverVideo',
      cover_image: 'CoverImage',
      // cover_image: {type: 'object', objectType: 'CoverImage'} ,
      related_articles: { type: 'int[]' },
      mandatory: { type: 'int' },
    }
  };