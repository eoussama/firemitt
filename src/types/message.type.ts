import type { EventType } from "..";



/**
 * Represents a generic message structure.
 * This type is used for defining a message format with a specific type and payload. It is generic and can accommodate different payload types.
 *
 * @category Firemitt
 *
 * @type {TMessage<T>}
 *
 * @template T - The type of the payload.
 */
export type TMessage<T = unknown> = {

  /**
   * The type of the event or message.
   */
  type: EventType;

  /**
   * The payload of the message, which can be of any type.
   */
  payload: T;
};
