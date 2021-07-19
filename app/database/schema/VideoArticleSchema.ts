import { CoverImageEntity, CoverVideoEntity,CoverImage,CoverVideo} from './ArticleSchema';
import {ObjectSchema} from 'realm';


export type VideoArticleEntity = {
    id: number,
    // langcode?:string,
    type: string,
    title: string,
    created_at: string,
    updated_at: string,
    body: string,
    category: number,
    child_age: number[],
    child_gender: number,
    parent_gender: number,
    // seasons: string,
    keywords: number[],
    cover_video?: CoverVideoEntity,
    cover_image?: CoverImageEntity,
    related_articles: number[],
    // generic: string,
    licensed: number,
    premature: number,
    mandatory: number,
  };


  export const VideoArticleEntitySchema: ObjectSchema = {
    name: 'VideoArticleEntity',
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
      category: { type: 'int' },
      child_age: { type: 'int[]' },
      child_gender: { type: 'int' },
      parent_gender: { type: 'int' },
      // seasons: { type: 'string' },
      keywords: { type: 'int[]' },
      cover_video: 'CoverVideo',
      cover_image: 'CoverImage',
      // cover_video: {type: 'object', objectType: 'CoverVideo',optional: true} ,
      // cover_image: {type: 'object', objectType: 'CoverImage',optional: true} ,
      related_articles: { type: 'int[]' },
      // generic: { type: 'string' },
      licensed: { type: 'int' },
      premature: { type: 'int' },
      mandatory: { type: 'int' },
    }
  };