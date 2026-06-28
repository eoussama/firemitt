/**
 * Supported Firebase authentication providers.
 *
 * @category Enums
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
export type TProvider = (typeof EProvider)[keyof typeof EProvider] | string;
