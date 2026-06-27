import { EnumHelper, ErrorType, IError } from '..';

/**
 * @category Errors
 *
 * @description
 * Custom error class that extends the built-in Error class.
 * It is used as a base class for creating custom error types in your application.
 */
export class BaseError extends Error implements IError {

  /**
   * @description
   * The type of the error.
   */
  type: ErrorType;

  /**
   * @description
   * Creates a new instance of the BaseError class with the specified error message.
   *
   * @param type The type of the error.
   * @param message The error message describing the reason for the error.
   */
  constructor(type: ErrorType, message: string) {
    super(message);

    this.type = type;
    this.name = `${EnumHelper.getName(ErrorType, type) ?? 'Base'}Error`;
  }

  /**
   * @description
   * Returns a string representation of the error message, prefixed with "[<errorName>]".
   *
   * @returns A formatted error message.
   */
  toString(): string {
    return `[${this.name}] ${this.message}.`;
  }

  /**
   * @description
   * Returns serialized error object.
   */
  toObject(): IError {
    return {
      type: this.type,
      name: this.name,
      message: this.message
    }
  }
}
