import { BaseError } from './base.error';
/**
 * Custom error class representing an error that occurs when Firebase initialization fails
 * due to an invalid configuration.
 * This error is thrown when there is an issue with the provided Firebase configuration.
 *
 * @category Errors
 */
export declare class InvalidFirebaseConfigError extends BaseError {
    /**
     * Creates a new instance of the InvalidFirebaseConfigError class with a default error message.
     * The default error message indicates that Firebase initialization failed due to an invalid configuration.
     */
    constructor();
}
