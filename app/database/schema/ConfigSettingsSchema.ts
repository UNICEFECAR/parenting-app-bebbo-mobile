import { ObjectSchema } from "realm";

export type ConfigSettingsEntity = {
    key: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
  };
  export const ConfigSettingsSchema: ObjectSchema = {
    name: 'ConfigSettings',  
    properties: {
        key: { type:'string' },
        value: { type:'string' },
        createdAt: { type:'date' },
        updatedAt: { type:'date' },
    }
  };