import { ErrorType } from "..";

import { BaseError } from "./base.error";



/**
 * @category Errors
 *
 * @description
 * Custom error class representing an error that occurs when an invalid app name is provided.
 * This error is thrown when a name for an app is required, but an invalid or empty name is provided.
 */
export class InvalidAppNameError extends BaseError {
  /**
   * @description
   * Creates a new instance of the InvalidAppNameError class with a default error message.
   * The default error message indicates that an invalid app name was provided.
   */
  constructor() {
    super(ErrorType.InvalidAppName, "Invalid app name, please specify a name for your app");
  }
}
