import { BaseError } from './base.error';
/**
 * Custom error class representing an error that occurs when the provided Firebase configuration
 * is missing or does not pass validation (see {@link FirebaseConfigSchema}).
 *
 * @category Errors
 */
export declare class InvalidFirebaseConfigError extends BaseError {
    /**
     * Creates a new instance of the InvalidFirebaseConfigError class with a default error message.
     * The default error message indicates that the Firebase configuration is invalid.
     */
    constructor();
}
