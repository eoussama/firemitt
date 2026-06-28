import { BaseError } from './base.error';
/**
 * Custom error class representing an error that occurs when an invalid app name is provided.
 * This error is thrown when a name for an app is required, but an invalid or empty name is provided.
 *
 * @category Errors
 */
export declare class InvalidAppNameError extends BaseError {
    /**
     * Creates a new instance of the InvalidAppNameError class with a default error message.
     * The default error message indicates that an invalid app name was provided.
     */
    constructor();
}
