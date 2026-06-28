import type { ErrorType } from "..";



/**
 * Custom error type.
 *
 * @category Firemitt
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
