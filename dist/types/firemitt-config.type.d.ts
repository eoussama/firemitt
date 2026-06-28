import { TDim, TFireguardConfig, TPos } from '.';
/**
 * Configuration settings for Firemitt.
 * This type includes necessary configuration details for initializing and setting up the Firemitt.
 *
 * @category Firemitt
 *
 * @type {TFiremittConfig}
 */
export type TFiremittConfig = {
    /**
     * The position configuration.
     */
    pos: TPos;
    /**
     * The dimension configuration.
     */
    dim: TDim;
    /**
     * The URL associated with the Firemitt.
     */
    url: string;
    /**
     * The Fireguard configuration settings.
     */
    fireguard: TFireguardConfig;
};
