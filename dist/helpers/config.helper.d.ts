import { TFiremittConfig, TFiremittOptions } from '..';
/**
 * Helper class for configuring Firemitt and Fireguard settings.
 *
 * This class provides static methods to construct and validate configuration objects for Firemitt and Fireguard.
 * It handles dimensions, positions, URLs, and Fireguard specific configurations including theme and Firebase settings.
 *
 * @category Helpers
 */
export declare class ConfigHelper {
    /**
     * Creates a `TDim` object representing dimensions, ensuring valid numeric values.
     *
     * @param {TUnsafe<number>} width - Potentially undefined or null width value, defaults to 450.
     * @param {TUnsafe<number>} height - Potentially undefined or null height value, defaults to 260.
     * @returns {TDim} The dimensions object with width and height.
     * @throws {InvalidDimError} If the width or height is not a finite number greater than zero.
     */
    private static getDim;
    /**
     * Generates a `TPos` object representing the position, using default values if necessary.
     * By default, the popup is horizontally centered on the host window (falling back to the screen),
     * and placed 50 pixels from the top of the screen.
     *
     * @param {TUnsafe<number>} x - Potentially undefined or null x-coordinate.
     * @param {TUnsafe<number>} y - Potentially undefined or null y-coordinate.
     * @param {number} width - The width of the element, used to calculate default x-coordinate.
     * @returns {TPos} The position object with x and y coordinates.
     */
    private static getPos;
    /**
     * Validates and returns a URL string, throwing an error if invalid.
     *
     * @param {TUnsafe<string>} url - The potentially undefined or null URL.
     * @returns {string} The validated URL string.
     * @throws {InvalidURLError} If the URL is invalid.
     */
    private static getURL;
    /**
     * Normalizes an authentication provider identifier.
     * Values are trimmed, built-in providers (see {@link EProvider}) are matched case-insensitively,
     * custom `oidc.*` / `saml.*` identifiers are kept as-is, and empty values default to `"google"`.
     *
     * @param {TUnsafe<string>} provider - The potentially undefined or null provider identifier.
     * @returns {string} The normalized provider identifier.
     */
    private static getProvider;
    /**
     * Creates a `TFireguardConfig` object from partial options, with fallbacks for the logo, theme and provider.
     *
     * @param {TUnsafe<Partial<TFireguardOptions>>} config - The potentially undefined or null Fireguard configuration options.
     * @returns {TFireguardConfig} The constructed Fireguard configuration object.
     * @throws {InvalidAppNameError} If the application name is invalid.
     * @throws {InvalidFirebaseConfigError} If the Firebase configuration is missing or invalid.
     */
    private static getFireguardConfig;
    /**
     * Initializes and returns a `TFiremittConfig` object based on the provided Firemitt options.
     *
     * @param {TFiremittOptions} options - The Firemitt options to initialize the configuration.
     * @returns {TFiremittConfig} The initialized Firemitt configuration object.
     * @throws {InvalidURLError} If the URL is invalid.
     * @throws {InvalidDimError} If the dimensions are invalid.
     * @throws {InvalidAppNameError} If the application name is invalid.
     * @throws {InvalidFirebaseConfigError} If the Firebase configuration is missing or invalid.
     */
    static init(options: TFiremittOptions): TFiremittConfig;
    /**
     * Constructs a string representing window features (flags) for window.open based on the given Firemitt configuration.
     *
     * @param {TFiremittConfig} config - The Firemitt configuration object.
     * @returns {string} A string of window feature flags for use in window.open.
     */
    static getFlags(config: TFiremittConfig): string;
}
