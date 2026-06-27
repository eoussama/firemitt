import type { TFirebaseConfig } from "./firebase-config.type";

import type { TTheme } from "./theme.type";



/**
 * Configuration settings for Fireguard.
 * This type includes essential configuration details necessary for initializing and customizing the Fireguard.
 *
 * @category Fireguard
 *
 * @type {TFireguardConfig}
 */
export type TFireguardConfig = {

  /**
   * The name of the Fireguard.
   */
  name: string;

  /**
   * The URL or path to the Fireguard's logo.
   */
  logo: string;

  /**
   * The theme settings for the Fireguard.
   */
  theme: TTheme;

  /**
   * The Firebase configuration settings for the Fireguard.
   */
  firebase: TFirebaseConfig;
};
