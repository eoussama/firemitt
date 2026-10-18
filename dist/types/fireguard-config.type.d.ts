import { TFirebaseConfig } from './firebase-config.type';
import { TTheme } from './theme.type';
/**
 * Configuration settings for Fireguard.
 * This is the configuration sent to Fireguard once it has loaded.
 *
 * @category Fireguard
 *
 * @type {TFireguardConfig}
 */
export type TFireguardConfig = {
    /**
     * The display name of the application requesting authentication.
     */
    name: string;
    /**
     * The absolute URL of the application's logo, shown in the Fireguard UI.
     */
    logo: string;
    /**
     * The theme colors applied to the Fireguard UI.
     */
    theme: TTheme;
    /**
     * The Firebase configuration used by Fireguard to authenticate.
     */
    firebase: TFirebaseConfig;
    /**
     * The authentication provider to use. Defaults to "google".
     * Use values from `EProvider` or a custom "oidc.<id>" / "saml.<id>" string.
     */
    provider: string;
};
