import { BaseError } from './base.error';
/**
 * Custom error class representing an error that occurs when invalid dimensions are provided.
 * This error is thrown when the width or height is not a finite number greater than zero.
 *
 * @category Errors
 */
export declare class InvalidDimError extends BaseError {
    /**
     * Creates a new instance of the InvalidDimError class with a default error message.
     */
    constructor();
}
