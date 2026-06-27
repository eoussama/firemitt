import type { ErrorType } from "..";



/**
 * @category Firemitt
 *
 * @description
 * Custom error type.
 *
 * @type {IError}
 */
export interface IError {

  /**
   * @description
   * The name of the error.
   */
  name: string;

  /**
   * @description
   * The error message.
   */
  message: string;

  /**
   * @description
   * The type of error.
   */
  type: ErrorType;
}
