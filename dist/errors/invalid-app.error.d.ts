import { BaseError } from './base.error';
/**
 * Custom error class representing an error that occurs when the Firebase app or its auth
 * instance cannot be initialized from the given configuration.
 *
 * @category Errors
 */
export declare class InvalidAppError extends BaseError {
    /**
     * Creates a new instance of the InvalidAppError class with a default error message.
     * The default error message indicates that the Firebase app could not be initialized.
     */
    constructor();
}
