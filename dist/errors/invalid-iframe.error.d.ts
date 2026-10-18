import { BaseError } from './base.error';
/**
 * Custom error class representing an error that occurs when iframe mode is
 * selected but neither an iframe element nor a container element is provided.
 *
 * @category Errors
 */
export declare class InvalidIframeError extends BaseError {
    /**
     * Creates a new instance of the InvalidIframeError class with a default error message.
     */
    constructor();
}
