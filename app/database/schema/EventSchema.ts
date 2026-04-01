import { ObjectSchema } from "realm";

  export type EventEntity = {
    name: string;
    params?: string | null;
    isSynchronized: boolean;
  };
  export const EventSchema: ObjectSchema = {
    name: 'Event',
    properties: {
      name: { type: 'string' },
      params: "string?",
      isSynchronized: { type: 'bool' },
    }
  };

  