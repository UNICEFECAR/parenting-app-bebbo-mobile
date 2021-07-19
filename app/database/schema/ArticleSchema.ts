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
    url: { type: 'string' ,optional: true},
    name: { type: 'string' ,optional: true},
    alt: { type: 'string',optional: true },
  }
}
export type ArticleEntity = {
    id: number,
    // langcode?:string,
    type: string,
    title: string,
    isarticle_pinned?: string,
    created_at: string,
    updated_at: string,
    body: string,
    category: number,
    child_age: number[],
    child_gender: number,
    parent_gender: number,
    // seasons: string,
    keywords: number[],
    // cover_video?: CoverVideoEntity,
    cover_image?: CoverImageEntity,
    related_articles: number[],
    // generic: string,
    licensed: number,
    premature: number,
    mandatory: number,
  };


  export const ArticleEntitySchema: ObjectSchema = {
    name: 'ArticleEntity',
    primaryKey: 'id',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
      id: { type: 'int' },
      // langcode: { type: 'string',optional: true },
      type: { type: 'string' },
      title: { type: 'string' },
      isarticle_pinned: { type: 'string',optional: true },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      body: { type: 'string'},
      category: { type: 'int' },
      child_age: { type: 'int[]' },
      child_gender: { type: 'int' },
      parent_gender: { type: 'int' },
      // seasons: { type: 'string' },
      keywords: { type: 'int[]' },
      // cover_video: 'CoverVideo',
      cover_image: 'CoverImage',
      // cover_image: { type: 'string' },
      // cover_video: {type: 'object', objectType: 'CoverVideo',optional: true} ,
      // cover_image: {type: 'object', objectType: 'CoverImage | {}',optional: true} ,
      related_articles: { type: 'int[]' },
      // generic: { type: 'string' },
      licensed: { type: 'int' },
      premature: { type: 'int' },
      mandatory: { type: 'int' },
    }
  };