/**
 * Supported Firebase authentication providers.
 *
 * @category Enums
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

export type TProvider = (typeof EProvider)[keyof typeof EProvider] | string;
