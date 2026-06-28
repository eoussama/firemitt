import { IError, ErrorType } from '..';
/**
 * Custom error class that extends the built-in Error class.
 * It is used as a base class for creating custom error types in your application.
 *
 * @category Errors
 */
export declare class BaseError extends Error implements IError {
    /**
     * The type of the error.
     */
    type: ErrorType;
    /**
     * Creates a new instance of the BaseError class with the specified error message.
     *
     * @param type The type of the error.
     * @param message The error message describing the reason for the error.
     */
    constructor(type: ErrorType, message: string);
    /**
     * Returns a string representation of the error message, prefixed with "[<errorName>]".
     *
     * @returns A formatted error message.
     */
    toString(): string;
    /**
     * Returns serialized error object.
     *
     * @returns The serialized error object.
     */
    toObject(): IError;
}
