import { ErrorType } from "..";

import { BaseError } from "./base.error";



/**
 * @category Errors
 *
 * Custom error class representing an error that occurs when an invalid provider name is provided.
 * This error is thrown when an operation expects a valid provider name, but an invalid one is provided.
 */
export class InvalidProviderError extends BaseError {
  /**
   * Creates a ne0w instance of the InvalidProviderError class with a specific error message.
   *
   * @param providerName The invalid provider name that caused the error.
   */
  constructor(providerName: string) {
    super(ErrorType.InvalidProvider, `Invalid provider, "${providerName}" is not a valid provider name`);
  }
}
