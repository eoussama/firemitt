import { BaseError } from './base.error';
/**
 * Custom error class representing an error that occurs when the browser refuses to open the Fireguard popup.
 * This usually happens when `FiremittHelper.auth` is not called synchronously from a user gesture (e.g. a click handler),
 * or when popups are blocked for the host page.
 *
 * @category Errors
 */
export declare class PopupBlockedError extends BaseError {
    /**
     * Creates a new instance of the PopupBlockedError class with a default error message.
     */
    constructor();
}
