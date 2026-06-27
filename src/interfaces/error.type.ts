import type { ErrorType } from "..";



/**
 * @category Firemitt
 *
 * Custom error type.
 *
 * @type {IError}
 */
export interface IError {

  /**
   * The name of the error.
   */
  name: string;

  /**
   * The error message.
   */
  message: string;

  /**
   * The type of error.
   */
  type: ErrorType;
}
