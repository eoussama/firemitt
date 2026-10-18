/**
 * Supported Firebase authentication providers.
 *
 * @category Firemitt
 */
export const EProvider = {
  GOOGLE: "google",
  GITHUB: "github",
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  MICROSOFT: "microsoft",
  APPLE: "apple",
  YAHOO: "yahoo",
} as const;

/**
 * An authentication provider identifier: one of {@link EProvider}, or a custom `oidc.<id>` / `saml.<id>` identifier.
 *
 * @category Firemitt
 */
export type TProvider = (typeof EProvider)[keyof typeof EProvider] | (string & Record<never, never>);
