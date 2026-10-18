import { ErrorType } from "..";

import { BaseError } from "./base.error";



/**
 * Custom error class representing an error that occurs when invalid dimensions are provided.
 * This error is thrown when the width or height is not a finite number greater than zero.
 *
 * @category Errors
 */
export class InvalidDimError extends BaseError {
  /**
   * Creates a new instance of the InvalidDimError class with a default error message.
   */
  constructor() {
    super(ErrorType.InvalidDim, "Invalid dimensions, width and height must be finite numbers greater than zero");
  }
}
