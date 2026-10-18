import { BaseError } from './base.error';
/**
 * Custom error class representing an authentication failure reported by Fireguard.
 *
 * The remote error's `type`, `name`, `message` and `code` are kept on the instance (so checks such as
 * `error.type === ErrorType.InvalidApp` keep working), and the raw payload is available as `cause`.
 *
 * @category Errors
 */
export declare class AuthFailedError extends BaseError {
    /**
     * Creates a new instance of the AuthFailedError class from the error payload sent by Fireguard.
     *
     * @param error The error payload received from Fireguard, usually a serialized {@link IError}.
     */
    constructor(error?: unknown);
    /**
     * Normalizes an unknown error payload into a partial {@link IError}.
     *
     * @param error The raw error payload.
     * @returns The partial error object.
     */
    private static toRemote;
}
