import { ObjectSchema } from "realm";

// Define types for entities
export type Language = {
  name: string;
  displayName: string;
  languageCode: string;
  locale: string;
  luxonLocale: string;
  pluralShow: string;
};

export type Partner = {
  url: string;
  name: string;
  alt: string;
};

export type Country = {
  CountryID: string;
  name: string;
  country_email: string;
  country_national_partner: Partner;
  country_sponsor_logo: Partner;
  unicef_logo?: Partner | null;
  content_toggle: string;
  app_name: string;
  languages: Language[];
};

// Define schemas for entities
export const LanguageSchema: ObjectSchema = {
  name: 'Language',
  properties: {
    name: 'string',
    displayName: 'string',
    languageCode: 'string',
    locale: 'string',
    luxonLocale: 'string',
    pluralShow: 'string'
  }
};

export const PartnerSchema: ObjectSchema = {
  name: 'Partner',
  properties: {
    url: 'string',
    name: 'string',
    alt: 'string'
  }
};

export const CountrySchema: ObjectSchema = {
  name: 'Country',
  primaryKey: 'CountryID',
  properties: {
    CountryID: 'string',
    name: 'string',
    country_email: 'string',
    country_national_partner: 'Partner',
    country_sponsor_logo: 'Partner',
    unicef_logo: 'Partner?',
    content_toggle: 'string',
    app_name: 'string',
    languages: 'Language[]'
  }
};


