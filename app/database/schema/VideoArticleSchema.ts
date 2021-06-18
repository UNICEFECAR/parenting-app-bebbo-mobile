import { CoverImageEntity, CoverVideoEntity,CoverImage,CoverVideo} from './ArticleSchema';
import {ObjectSchema} from 'realm';


export type VideoArticleEntity = {
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
    // generic: string,
    licensed: string,
    premature: string,
    mandatory: string,
  };


  export const VideoArticleEntitySchema: ObjectSchema = {
    name: 'VideoArticleEntity',
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
      // generic: { type: 'string' },
      licensed: { type: 'string' },
      premature: { type: 'string' },
      mandatory: { type: 'string' },
    }
  };