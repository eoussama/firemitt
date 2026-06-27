import type { TMessage } from "..";



/**
 * Helper class for Base64 encoding and decoding of messages.
 *
 * @category Helpers
 *
 * This class provides static methods to encode and decode messages using Base64 encoding. It is designed to work with
 * `TMessage` type, allowing for serialization and deserialization of messages.
 *
 * @class Base64helper
 */
export class Base64helper {
  /**
   * Encodes a message into a Base64 string.
   *
   * This static method takes a message of type `TMessage<T>` and converts it into a Base64 encoded string.
   * It first stringifies the message into JSON, and then encodes this JSON string into Base64.
   *
   * @template T - The type of the payload in the message.
   * @param {TMessage<T>} message - The message to be encoded.
   * @returns {string} The Base64 encoded string representation of the message.
   */
  static encode<T = unknown>(message: TMessage<T>): string {
    const data = JSON.stringify(message);

    return btoa(data);
  }

  /**
   * Decodes a Base64 string back into a message.
   *
   * This static method takes a Base64 encoded string and decodes it back into a message of type `TMessage<T>`.
   * It first decodes the Base64 string into a JSON string, and then parses this JSON string back into a message object.
   *
   * @template T - The expected type of the payload in the decoded message.
   * @param {string} base64 - The Base64 encoded string to be decoded.
   * @returns {TMessage<T>} The decoded message object.
   */
  static decode<T = unknown>(base64: string): TMessage<T> {
    const message = atob(base64);

    return JSON.parse(message);
  }
}
