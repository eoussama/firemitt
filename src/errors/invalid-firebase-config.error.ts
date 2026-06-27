import { ErrorType } from "..";

import { BaseError } from "./base.error";



/**
 * @category Errors
 *
 * @description
 * Custom error class representing an error that occurs when Firebase initialization fails
 * due to an invalid configuration.
 * This error is thrown when there is an issue with the provided Firebase configuration.
 */
export class InvalidFirebaseConfigError extends BaseError {
  /**
   * @description
   * Creates a new instance of the InvalidFirebaseConfigError class with a default error message.
   * The default error message indicates that Firebase initialization failed due to an invalid configuration.
   */
  constructor() {
    super(ErrorType.InvalidFirebaseConfig, "Invalid Firebase configuration");
  }
}
