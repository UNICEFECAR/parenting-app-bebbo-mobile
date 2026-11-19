import { ObjectSchema } from "realm";

  export type EventEntity = {
    name: string;
    params?: string | null;
    sdkRetry: boolean;
    isSynchronized: boolean;
  };
  export const EventSchema: ObjectSchema = {
    name: 'Event',
    properties: {
      name: { type: 'string' },
      params: "string?",
      sdkRetry: { type: 'bool', default: false },
      isSynchronized: { type: 'bool' },
    }
  };

  