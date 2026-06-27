import { ErrorType } from "..";

import { BaseError } from "./base.error";



/**
 * Custom error class representing an error that occurs when invalid dimensions are provided.
 * This error is thrown when non-numeric or otherwise invalid width or height values are given.
 *
 * @category Errors
 */
export class InvalidDimError extends BaseError {
  /**
   * Creates a new instance of the InvalidDimError class with a default error message.
   */
  constructor() {
    super(ErrorType.InvalidDim, "Invalid dimensions, width and height must be valid numbers");
  }
}
