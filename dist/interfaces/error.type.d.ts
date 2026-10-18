import { ErrorType } from '..';
/**
 * Custom error type.
 *
 * @category Firemitt
 */
export interface IError {
    /**
     * The name of the error.
     */
    name: string;
    /**
     * The error message.
     */
    message: string;
    /**
     * The type of error.
     */
    type: ErrorType;
    /**
     * An optional machine-readable error code (e.g. a Firebase `auth/*` code).
     */
    code?: string;
}
