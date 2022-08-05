import {ObjectSchema} from 'realm';
import { CoverVideoEntity, CoverImageEntity, CoverVideo, CoverImage } from './ArticleSchema';

export type PinnedChildDevelopmentEntity = {
    id: number,
    type: string,
    title: string,
    isarticle_pinned?: string,
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
    licensed: number,
    premature: number,
    mandatory: number,
    embedded_images?: string[]
  };

  export const PinnedChildDevelopmentSchema: ObjectSchema = {
    name: 'PinnedChildDevelopmentEntity',
    primaryKey: 'id',
  
    properties: {
      id: { type: 'int' },
      type: { type: 'string' },
      title: { type: 'string' },
      isarticle_pinned: { type: 'string',optional: true },
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
      licensed: { type: 'int' },
      premature: { type: 'int' },
      mandatory: { type: 'int' },
      embedded_images: { type: 'string[]',optional: true},
    }
  }