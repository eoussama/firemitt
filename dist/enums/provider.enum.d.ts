/**
 * Supported Firebase authentication providers.
 *
 * @category Firemitt
 */
export declare const EProvider: {
    readonly GOOGLE: "google";
    readonly GITHUB: "github";
    readonly FACEBOOK: "facebook";
    readonly TWITTER: "twitter";
    readonly MICROSOFT: "microsoft";
    readonly APPLE: "apple";
    readonly YAHOO: "yahoo";
};
/**
 * An authentication provider identifier: one of {@link EProvider}, or a custom `oidc.<id>` / `saml.<id>` identifier.
 *
 * @category Firemitt
 */
export type TProvider = (typeof EProvider)[keyof typeof EProvider] | (string & Record<never, never>);
