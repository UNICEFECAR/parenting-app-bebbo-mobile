import { ObjectSchema } from "realm";

  export type EventEntity = {
    name: string;
    isSynchronized: boolean;
  };
  export const EventSchema: ObjectSchema = {
    name: 'Event',
    properties: {
      name: { type: 'string' },
      isSynchronized: { type: 'bool' },
    }
  };

  