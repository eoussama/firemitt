import { TFiremittOptions } from '../types/firemitt-options.type';
/**
 * Helper class for handling authentication processes using Firemitt.
 *
 * @category Helpers
 *
 * Provides static methods to initiate authentication via a popup window or an embedded iframe.
 * Uses `ConfigHelper` to initialize and validate configuration, and `EventHelper` to manage
 * cross-window event communication with the Fireguard auth page.
 *
 * @class FiremittHelper
 */
export declare class FiremittHelper {
    /**
     * Cancels the currently active iframe session, if any.
     * Removes the owned iframe from the DOM and rejects its promise.
     */
    private static cancelActiveIframe;
    /**
     * Runs the shared event-driven auth flow against an already-initialized `EventHelper` target.
     * Resolves with the token on success, rejects on failure or close.
     * The `cleanup` callback is invoked once the promise settles (regardless of outcome).
     *
     * @param fireguardConfig - The Fireguard config to send after the Loaded event.
     * @param cleanup - Teardown to run after settling.
     * @returns A promise that resolves with the authentication token or rejects with an error.
     */
    private static runSession;
    /**
     * Initiates authentication using a popup window.
     *
     * @param options - The options required to configure and initiate the Firemitt authentication process.
     * @returns A promise that resolves with the authentication token on success, or rejects with an error on failure.
     */
    private static authPopup;
    /**
     * Initiates authentication by embedding Fireguard inside an iframe.
     * Uses a caller-provided iframe element, or creates one inside the provided container.
     * If a previous iframe session is still active, it is cancelled before starting the new one.
     *
     * @param options - The options required to configure and initiate the Firemitt authentication process.
     * @returns A promise that resolves with the authentication token on success, or rejects with an error on failure.
     * @throws {InvalidIframeError} If neither an iframe element nor a container is provided.
     */
    private static authIframe;
    /**
     * Initiates authentication using Firemitt options.
     *
     * Depending on the `mode` field in `options`, this either opens a popup window (default)
     * or embeds Fireguard inside an iframe.
     *
     * @param {TFiremittOptions} options - The options required to configure and initiate the Firemitt authentication process.
     * @returns {Promise<string>} A promise that resolves with the authentication token on success, or rejects with an error on failure.
     */
    static auth(options: TFiremittOptions): Promise<string>;
}
