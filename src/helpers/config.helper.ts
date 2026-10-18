import type { TUnsafe } from "@eoussama/core";
import type {
  TDim,
  TFireguardConfig,
  TFireguardOptions,
  TFiremittConfig,
  TFiremittOptions,
  TPos,
} from "..";
import {
  EProvider,
  FirebaseConfigSchema,
  FireguardOptionsSchema,
  FiremittOptionsSchema,
  InvalidAppNameError,
  InvalidDimError,
  InvalidFirebaseConfigError,
  InvalidURLError,
} from "..";



/**
 * Helper class for configuring Firemitt and Fireguard settings.
 *
 * This class provides static methods to construct and validate configuration objects for Firemitt and Fireguard.
 * It handles dimensions, positions, URLs, and Fireguard specific configurations including theme and Firebase settings.
 *
 * @category Helpers
 */
export class ConfigHelper {
  /**
   * Creates a `TDim` object representing dimensions, ensuring valid numeric values.
   *
   * @param {TUnsafe<number>} width - Potentially undefined or null width value, defaults to 450.
   * @param {TUnsafe<number>} height - Potentially undefined or null height value, defaults to 260.
   * @returns {TDim} The dimensions object with width and height.
   * @throws {InvalidDimError} If the width or height is not a finite number greater than zero.
   */
  private static getDim(width: TUnsafe<number>, height: TUnsafe<number>): TDim {
    const w = Number.parseFloat((width ?? 450).toString());
    const h = Number.parseFloat((height ?? 260).toString());

    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      throw new InvalidDimError();
    }

    return { width: w, height: h };
  }

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
  private static getPos(x: TUnsafe<number>, y: TUnsafe<number>, width: number): TPos {
    const hostX = window.screenX;
    const hostWidth = window.outerWidth;

    const defaultX = Number.isFinite(hostX) && hostWidth > 0
      ? hostX + (hostWidth - width) / 2
      : window.screen.width / 2 - width / 2;

    const left = Number.parseFloat((x ?? defaultX).toString());
    const top = Number.parseFloat((y ?? 50).toString());

    return {
      x: Math.round(Number.isFinite(left) ? left : defaultX),
      y: Math.round(Number.isFinite(top) ? top : 50),
    };
  }

  /**
   * Validates and returns a URL string, throwing an error if invalid.
   *
   * @param {TUnsafe<string>} url - The potentially undefined or null URL.
   * @returns {string} The validated URL string.
   * @throws {InvalidURLError} If the URL is invalid.
   */
  private static getURL(url: TUnsafe<string>): string {
    const result = FiremittOptionsSchema.shape.url.safeParse(url);

    if (!result.success) {
      throw new InvalidURLError();
    }

    return new URL(result.data).toString();
  }

  /**
   * Normalizes an authentication provider identifier.
   * Values are trimmed, built-in providers (see {@link EProvider}) are matched case-insensitively,
   * custom `oidc.*` / `saml.*` identifiers are kept as-is, and empty values default to `"google"`.
   *
   * @param {TUnsafe<string>} provider - The potentially undefined or null provider identifier.
   * @returns {string} The normalized provider identifier.
   */
  private static getProvider(provider: TUnsafe<string>): string {
    const trimmed = (provider ?? "").trim();
    const lower = trimmed.toLowerCase();

    if (!trimmed) {
      return EProvider.GOOGLE;
    }

    return (Object.values(EProvider) as string[]).includes(lower) ? lower : trimmed;
  }

  /**
   * Creates a `TFireguardConfig` object from partial options, with fallbacks for the logo, theme and provider.
   *
   * @param {TUnsafe<Partial<TFireguardOptions>>} config - The potentially undefined or null Fireguard configuration options.
   * @returns {TFireguardConfig} The constructed Fireguard configuration object.
   * @throws {InvalidAppNameError} If the application name is invalid.
   * @throws {InvalidFirebaseConfigError} If the Firebase configuration is missing or invalid.
   */
  private static getFireguardConfig(config: TUnsafe<Partial<TFireguardOptions>>): TFireguardConfig {
    const name = config?.name ?? "";
    const logo = config?.logo ?? "";

    const theme = {
      text: config?.theme?.text || "#1a3544",
      primary: config?.theme?.primary || "#ffe536",
      secondary: config?.theme?.secondary || "#1a3544",
      background: config?.theme?.background || "#ffffff",
    };

    const provider = this.getProvider(config?.provider);

    const nameResult = FireguardOptionsSchema.shape.name.safeParse(name);

    if (!config || !nameResult.success) {
      throw new InvalidAppNameError();
    }

    const firebase = config.firebase;
    const firebaseResult = FirebaseConfigSchema.safeParse(firebase);

    if (!firebase || !firebaseResult.success) {
      throw new InvalidFirebaseConfigError();
    }

    return { name, logo, theme, firebase, provider };
  }

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
  static init(options: TFiremittOptions): TFiremittConfig {
    const url = this.getURL(options.url);
    const dim = this.getDim(options.dim?.width, options.dim?.height);
    const pos = this.getPos(options.pos?.x, options.pos?.y, dim.width);
    const config = this.getFireguardConfig(options.config);

    return { url, dim, pos, fireguard: config };
  }

  /**
   * Constructs a string representing window features (flags) for window.open based on the given Firemitt configuration.
   *
   * @param {TFiremittConfig} config - The Firemitt configuration object.
   * @returns {string} A string of window feature flags for use in window.open.
   */
  static getFlags(config: TFiremittConfig): string {
    const flags = [
      `width=${config.dim.width}`,
      `height=${config.dim.height}`,
      `left=${config.pos.x}`,
      `top=${config.pos.y}`,
    ];

    return flags.join(",");
  }
}
