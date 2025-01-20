import { ObjectSchema } from 'realm';

export type CoverVideoEntity = {
  url: string;
  name: string;
  site: string;
}
export type CoverImageEntity = {
  url: string;
  name: string;
  alt: string;
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
    url: { type: 'string', optional: true },
    name: { type: 'string', optional: true },
    alt: { type: 'string', optional: true },
  }
}
export type ArticleEntity = {
  id: number;
  type: string;
  title: string;
  isarticle_pinned?: string;
  created_at: string;
  updated_at: string;
  summary?: string;
  body: string;
  category: number;
  child_age: number[];
  child_gender: number;
  parent_gender: number;
  keywords: number[];
  cover_image?: CoverImageEntity;
  related_articles: number[];
  related_video_articles?: number[];
  licensed: number;
  premature: number;
  mandatory: number;
  embedded_images?: string[];
};


export const ArticleEntitySchema: ObjectSchema = {
  name: 'ArticleEntity',
  primaryKey: 'id',

  properties: {
    id: { type: 'int' },
    type: { type: 'string' },
    title: { type: 'string' },
    isarticle_pinned: { type: 'string', optional: true },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
    summary: { type: 'string', optional: true },
    body: { type: 'string' },
    category: { type: 'int' },
    child_age: { type: 'list', objectType: 'int' },
    child_gender: { type: 'int' },
    parent_gender: { type: 'int' },
    keywords: { type: 'list', objectType: 'int' },
    cover_image: 'CoverImage',
    related_articles: { type: 'list', objectType: 'int' },
    related_video_articles: { type: 'list', objectType: 'int', optional: true, default: [] },
    licensed: { type: 'int' },
    premature: { type: 'int' },
    mandatory: { type: 'int' },
    embedded_images: { type: 'list', objectType: 'string', optional: true }
  }
};