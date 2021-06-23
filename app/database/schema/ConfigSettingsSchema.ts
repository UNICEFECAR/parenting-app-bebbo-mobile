import { ObjectSchema } from "realm";

export type ConfigSettingsEntity = {
    key: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  /**
  * Realm schema for VariableEntity.
  */
  export const ConfigSettingsSchema: ObjectSchema = {
    name: 'ConfigSettings',
  
    // API: https://bit.ly/3f7k9jq
    properties: {
        key: { type:'string' },
        value: { type:'string' },
        createdAt: { type:'date' },
        updatedAt: { type:'date' },
    }
  };