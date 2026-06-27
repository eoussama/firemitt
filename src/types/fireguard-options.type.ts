import type { TFirebaseConfig } from "./firebase-config.type";
import type { TFireguardConfig } from "./fireguard-config.type";

import type { TTheme } from "./theme.type";



/**
 * Options for configuring Fireguard.
 * This type specifies the options that can be provided to customize the Fireguard. It extends the TFireguardConfig with optional properties.
 *
 * @category Fireguard
 *
 * @type {TFireguardOptions}
 */
export type TFireguardOptions = {

  /**
   * The name of the Fireguard.
   */
  name: string;

  /**
   * The Firebase configuration.
   */
  firebase: TFirebaseConfig;

  /**
   * Optional theme settings, partially applied.
   */
  theme?: Partial<TTheme>;
} & Partial<TFireguardConfig>;
