import { ErrorType } from "..";

import { BaseError } from "./base.error";



/**
 * Custom error class representing an error that occurs when iframe mode is
 * selected but neither an iframe element nor a container element is provided.
 *
 * @category Errors
 */
export class InvalidIframeError extends BaseError {
  /**
   * Creates a new instance of the InvalidIframeError class with a default error message.
   */
  constructor() {
    super(ErrorType.InvalidIframe, "iframe mode requires either an iframe element or a container element");
  }
}
