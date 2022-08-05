import { CoverImageEntity, CoverVideoEntity,CoverImage,CoverVideo} from './ArticleSchema';
import {ObjectSchema} from 'realm';

export type VideoArticleEntity = {
    id: number,
    type: string,
    title: string,
    created_at: string,
    updated_at: string,
    summary: string,
    body: string,
    category: number,
    child_age: number[],
    child_gender: number,
    parent_gender: number,
    keywords: number[],
    cover_video?: CoverVideoEntity,
    cover_image?: CoverImageEntity,
    related_articles: number[],
    related_video_articles?: number[],
    licensed: number,
    premature: number,
    mandatory: number,
    embedded_images?: string[]
  };

  export const VideoArticleEntitySchema: ObjectSchema = {
    name: 'VideoArticleEntity',
    primaryKey: 'id',
  
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      summary: { type: 'string'},
      body: { type: 'string'},
      category: { type: 'int' },
      child_age: { type: 'int[]' },
      child_gender: { type: 'int' },
      parent_gender: { type: 'int' },
      keywords: { type: 'int[]' },
      cover_video: 'CoverVideo',
      cover_image: 'CoverImage',
      related_articles: { type: 'int[]' },
      related_video_articles: { type: 'int[]',optional: true, default: [] },
      licensed: { type: 'int' },
      premature: { type: 'int' },
      mandatory: { type: 'int' },
      embedded_images: { type: 'string[]',optional: true},
    }
  };