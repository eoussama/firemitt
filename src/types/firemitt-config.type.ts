import type { TDim, TFireguardConfig, TPos } from ".";



/**
 * @category Firemitt
 *
 * @description
 * Configuration settings for Firemitt.
 * This type includes necessary configuration details for initializing and setting up the Firemitt.
 *
 * @type {TFiremittConfig}
 */
export type TFiremittConfig = {

  /**
   * @description
   * The position configuration.
   */
  pos: TPos;

  /**
   * @description
   * The dimension configuration.
   */
  dim: TDim;

  /**
   * @description
   * The URL associated with the Firemitt.
   */
  url: string;

  /**
   * @description
   * The Fireguard configuration settings.
   */
  fireguard: TFireguardConfig;
};
