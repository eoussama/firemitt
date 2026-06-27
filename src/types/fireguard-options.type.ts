import type { TFirebaseConfig } from "./firebase-config.type";
import type { TFireguardConfig } from "./fireguard-config.type";

import type { TTheme } from "./theme.type";



/**
 * @category Fireguard
 *
 * @description
 * Options for configuring Fireguard.
 * This type specifies the options that can be provided to customize the Fireguard. It extends the TFireguardConfig with optional properties.
 *
 * @type {TFireguardOptions}
 */
export type TFireguardOptions = {

  /**
   * @description
   * The name of the Fireguard.
   */
  name: string;

  /**
   * @description
   * The Firebase configuration.
   */
  firebase: TFirebaseConfig;

  /**
   * @description
   * Optional theme settings, partially applied.
   */
  theme?: Partial<TTheme>;
} & Partial<TFireguardConfig>;
