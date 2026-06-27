import { ErrorType } from "..";

import { BaseError } from "./base.error";



/**
 * @category Errors
 *
 * Custom error class representing an error that occurs when Firebase initialization fails
 * due to an invalid configuration.
 * This error is thrown when there is an issue with the provided Firebase configuration.
 */
export class InvalidAppError extends BaseError {
  /**
   * Creates a new instance of the InvalidAppError class with a default error message.
   * The default error message indicates that Firebase initialization failed due to an invalid configuration.
   */
  constructor() {
    super(ErrorType.InvalidApp, "Invalid Firebase app, failed initializing fire base with the given configuration");
  }
}
