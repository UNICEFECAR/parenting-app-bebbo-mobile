import {ObjectSchema} from 'realm';

export type CoverVideoEntity = {
  url:string;
  name:string;
  site:string;
}
export type CoverImageEntity = {
  url:string;
  name:string;
  alt:string;
}

export const CoverVideo: ObjectSchema = {
  name: "CoverVideo",
  embedded: true,
  properties: {
    url: { type: 'string' },
    name: { type: 'string' },
    site: { type: 'string' },
  }
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
export type ArticleEntity = {
    id: string,
    langcode?:string,
    type: string,
    title: string,
    created_at: string,
    updated_at: string,
    body: string,
    category: string,
    child_age: string[],
    child_gender: string,
    parent_gender: string,
    // seasons: string,
    keywords: string[],
    cover_video?: CoverVideoEntity,
    cover_image?: CoverImageEntity,
    related_articles: string[],
    generic: string,
    licensed: string,
    premature: string,
    mandatory: string,
  };


  export const ArticleEntitySchema: ObjectSchema = {
    name: 'ArticleEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'string' },
      langcode: { type: 'string',optional: true },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      body: { type: 'string'},
      category: { type: 'string' },
      child_age: { type: 'string[]' },
      child_gender: { type: 'string' },
      parent_gender: { type: 'string' },
      // seasons: { type: 'string' },
      keywords: { type: 'string[]' },
      cover_video: 'CoverVideo',
      cover_image: 'CoverImage',
      // cover_video: {type: 'object', objectType: 'CoverVideo',optional: true} ,
      // cover_image: {type: 'object', objectType: 'CoverImage',optional: true} ,
      related_articles: { type: 'string[]' },
      generic: { type: 'string' },
      licensed: { type: 'string' },
      premature: { type: 'string' },
      mandatory: { type: 'string' },
    }
  };