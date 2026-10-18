import { TDim, TFireguardConfig, TPos } from '.';
/**
 * Configuration settings for Firemitt.
 * This is the normalized configuration produced by `ConfigHelper.init`.
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
     * The normalized URL of the Fireguard instance.
     */
    url: string;
    /**
     * The Fireguard configuration settings.
     */
    fireguard: TFireguardConfig;
};
