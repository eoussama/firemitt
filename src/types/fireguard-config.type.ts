import type { TFirebaseConfig } from "./firebase-config.type";

import type { TTheme } from "./theme.type";



/**
 * @category Fireguard
 *
 * @description
 * Configuration settings for Fireguard.
 * This type includes essential configuration details necessary for initializing and customizing the Fireguard.
 *
 * @type {TFireguardConfig}
 */
export type TFireguardConfig = {

  /**
   * @description
   * The name of the Fireguard.
   */
  name: string;

  /**
   * @description
   * The URL or path to the Fireguard's logo.
   */
  logo: string;

  /**
   * @description
   * The theme settings for the Fireguard.
   */
  theme: TTheme;

  /**
   * @description
   * The Firebase configuration settings for the Fireguard.
   */
  firebase: TFirebaseConfig;
};
