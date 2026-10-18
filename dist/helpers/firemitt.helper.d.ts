import { TFiremittOptions } from '../types/firemitt-options.type';
/**
 * Helper class for handling authentication processes using Firemitt.
 *
 * Provides static methods to initiate authentication via a popup window or an embedded iframe.
 * Uses `ConfigHelper` to initialize and validate configuration, and runs a cross-window handshake
 * with the Fireguard auth page for each session.
 *
 * @category Helpers
 */
export declare class FiremittHelper {
    /**
     * Cancels the currently active session (popup or iframe), if any.
     */
    private static cancelActive;
    /**
     * Resolves the origin to post messages to, given the origin of a message received from Fireguard.
     * Opaque origins (`"null"`) cannot be targeted, in which case `"*"` is used.
     *
     * @param origin The origin of a received message.
     * @returns The target origin.
     */
    private static getTargetOrigin;
    /**
     * Runs the event-driven handshake with a Fireguard window.
     *
     * The message listener is registered before the window is navigated to Fireguard, and only messages
     * posted by the window returned by `getTarget` are handled. Every `Loaded` event is answered with the
     * configuration (Fireguard announces itself again after reloads), and the session settles exactly once.
     *
     * @param getTarget - Returns the Fireguard window, it is evaluated for every message.
     * @param fireguard - The Fireguard config to send after each Loaded event.
     * @param teardown - Cleanup to run once the session settles, regardless of the outcome.
     * @returns The running session.
     */
    private static startSession;
    /**
     * Makes the given session the active one, cancelling the previous active session.
     *
     * @param session - The new session.
     * @param onCancel - Extra cleanup to run when the session is cancelled by a newer one.
     */
    private static activate;
    /**
     * Forgets the active session if it is the given one.
     *
     * @param cancel - The cancel function of the settled session.
     */
    private static release;
    /**
     * Initiates authentication using a popup window.
     *
     * @param options - The options required to configure and initiate the Firemitt authentication process.
     * @returns A promise that resolves with the authentication token on success, or rejects with an error on failure.
     * @throws {InvalidURLError | InvalidDimError | InvalidAppNameError | InvalidFirebaseConfigError} Synchronously, if the options are invalid.
     */
    private static authPopup;
    /**
     * Initiates authentication by embedding Fireguard inside an iframe.
     * Uses a caller-provided iframe element, or creates one inside the provided container.
     * If a previous session is still active, it is cancelled before starting the new one.
     *
     * @param options - The options required to configure and initiate the Firemitt authentication process.
     * @returns A promise that resolves with the authentication token on success, or rejects with an error on failure.
     * @throws {InvalidIframeError} Synchronously, if neither an iframe element nor a container is provided.
     * @throws {InvalidURLError | InvalidDimError | InvalidAppNameError | InvalidFirebaseConfigError} Synchronously, if the options are invalid.
     */
    private static authIframe;
    /**
     * Initiates authentication using Firemitt options.
     *
     * Depending on the `mode` field in `options`, this either opens a popup window (default)
     * or embeds Fireguard inside an iframe. In popup mode, it must be called synchronously from a
     * user gesture (e.g. a click handler), otherwise the browser blocks the popup.
     *
     * Starting a new session cancels the previous one, which then rejects with
     * `"A new authentication session was started."`.
     *
     * @param {TFiremittOptions} options - The options required to configure and initiate the Firemitt authentication process.
     * @returns {Promise<string>} A promise that resolves with the authentication token on success, or rejects with an error on failure
     * (`PopupBlockedError`, `AuthFailedError`, or an `Error` when the window is closed or the session is replaced).
     * @throws {InvalidURLError | InvalidDimError | InvalidAppNameError | InvalidFirebaseConfigError | InvalidIframeError} Synchronously, if the options are invalid.
     */
    static auth(options: TFiremittOptions): Promise<string>;
}
