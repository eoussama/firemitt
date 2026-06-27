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
  InvalidAppNameError,
  InvalidFirebaseConfigError,
  InvalidURLError,
} from "..";



/**
 * @category Helpers
 *
 * @description
 * Helper class for configuring Firemitt and Fireguard settings.
 *
 * This class provides static methods to construct and validate configuration objects for Firemitt and Fireguard.
 * It handles dimensions, positions, URLs, and Fireguard specific configurations including theme and Firebase settings.
 *
 * @class ConfigHelper
 */
export class ConfigHelper {
  /**
   * @description
   * Creates a `TDim` object representing dimensions, ensuring valid numeric values.
   *
   * @static
   * @param {TUnsafe<number>} width - Potentially undefined or null width value.
   * @param {TUnsafe<number>} height - Potentially undefined or null height value.
   * @returns {TDim} The dimensions object with width and height.
   */
  private static getDim(width: TUnsafe<number>, height: TUnsafe<number>): TDim {
    const w = Number.parseFloat((width ?? 450).toString());
    const h = Number.parseFloat((height ?? 260).toString());

    return { width: w, height: h };
  }

  /**
   * @description
   * Generates a `TPos` object representing the position, using default values if necessary.
   *
   * @static
   * @param {TUnsafe<number>} x - Potentially undefined or null x-coordinate.
   * @param {TUnsafe<number>} y - Potentially undefined or null y-coordinate.
   * @param {number} width - The width of the element, used to calculate default x-coordinate.
   * @returns {TPos} The position object with x and y coordinates.
   */
  private static getPos(x: TUnsafe<number>, y: TUnsafe<number>, width: number): TPos {
    const top = Number.parseFloat((y ?? 50).toString());
    const left = Number.parseFloat((x ?? (window.screen.width / 2 - width / 2)).toString());

    return { x: left, y: top };
  }

  /**
   * @description
   * Validates and returns a URL string, throwing an error if invalid.
   *
   * @static
   * @param {TUnsafe<string>} url - The potentially undefined or null URL.
   * @returns {string} The validated URL string.
   * @throws {InvalidURLError} If the URL is invalid.
   */
  private static getURL(url: TUnsafe<string>): string {
    try {
      const fireguardURL = new URL(url ?? "");

      if (fireguardURL.protocol !== "http:" && fireguardURL.protocol !== "https:") {
        throw new Error("Invalid protocol");
      }

      return fireguardURL.toString();
    }
    catch {
      throw new InvalidURLError();
    }
  }

  /**
   * @description
   * Creates a `TFireguardConfig` object from partial options, with fallbacks for theme and Firebase configurations.
   *
   * @static
   * @param {TUnsafe<Partial<TFireguardOptions>>} config - The potentially undefined or null Fireguard configuration options.
   * @returns {TFireguardConfig} The constructed Fireguard configuration object.
   * @throws {InvalidAppNameError} If the application name is invalid.
   * @throws {InvalidFirebaseConfigError} If the Firebase configuration is invalid.
   */
  private static getFireguardConfig(config: TUnsafe<Partial<TFireguardOptions>>): TFireguardConfig {
    const name = config?.name ?? "";
    const logo = config?.logo ?? "";

    const theme = {
      text: config?.theme?.text || "#1a3544",
      primary: config?.theme?.primary || "#ffe536",
      secondary: config?.theme?.secondary || "#1a3544",
    };

    const firebase = config?.firebase ?? {
      apiKey: "",
      appId: "",
      projectId: "",
      authDomain: "",
      measurementId: "",
      storageBucket: "",
      messagingSenderId: "",
    };

    if (name.length === 0) {
      throw new InvalidAppNameError();
    }

    if (Object.keys(firebase).length === 0) {
      throw new InvalidFirebaseConfigError();
    }

    return { name, logo, theme, firebase };
  }

  /**
   * @description
   * Initializes and returns a `TFiremittConfig` object based on the provided Firemitt options.
   *
   * @static
   * @param {TFiremittOptions} options - The Firemitt options to initialize the configuration.
   * @returns {TFiremittConfig} The initialized Firemitt configuration object.
   */
  static init(options: TFiremittOptions): TFiremittConfig {
    const url = this.getURL(options.url);
    const dim = this.getDim(options?.dim?.width, options?.dim?.height);
    const pos = this.getPos(options?.pos?.x, options?.pos?.y, dim.width);
    const config = this.getFireguardConfig(options?.config);

    return { url, dim, pos, fireguard: config };
  }

  /**
   * @description
   * Constructs a string representing window features (flags) for window.open based on the given Firemitt configuration.
   *
   * @static
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
