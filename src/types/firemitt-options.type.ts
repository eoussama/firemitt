import type { TDim, TFireguardOptions, TPos } from ".";



/**
 * @category Firemitt
 *
 * Options for configuring Firemitt.
 * This type outlines the optional and partial settings that can be applied to customize the Firemitt.
 *
 * @type {TFiremittOptions}
 */
export type TFiremittOptions = {

  /**
   * The URL associated with the Firemitt.
   */
  url: string;
} & Partial<{

  /**
   * Optional, partial position configuration.
   */
  pos: Partial<TPos>;

  /**
   * Optional, partial dimension configuration.
   */
  dim: Partial<TDim>;

  /**
   * Optional, partial Fireguard configuration.
   */
  config: Partial<TFireguardOptions>;
}>;
