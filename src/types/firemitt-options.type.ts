import type { TDim, TFireguardOptions, TPos } from ".";



/**
 * @category Firemitt
 *
 * @description
 * Options for configuring Firemitt.
 * This type outlines the optional and partial settings that can be applied to customize the Firemitt.
 *
 * @type {TFiremittOptions}
 */
export type TFiremittOptions = {

  /**
   * @description
   * The URL associated with the Firemitt.
   */
  url: string;
} & Partial<{

  /**
   * @description
   * Optional, partial position configuration.
   */
  pos: Partial<TPos>;

  /**
   * @description
   * Optional, partial dimension configuration.
   */
  dim: Partial<TDim>;

  /**
   * @description
   * Optional, partial Fireguard configuration.
   */
  config: Partial<TFireguardOptions>;
}>;
