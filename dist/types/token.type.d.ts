/**
 * Represents a token structure with additional properties.
 * This type is primarily used for authentication purposes, containing a token response and possibly other object properties.
 *
 * @category Firebase
 *
 * @type {TToken}
 */
export type TToken = {
    /**
     * An object containing the OAuth ID token.
     */
    _tokenResponse: {
        /**
         * The OAuth ID token. Present for OIDC-based providers (Google, Apple, Microsoft).
         */
        oauthIdToken?: string;
        /**
         * The OAuth access token. Present for all OAuth providers.
         */
        oauthAccessToken?: string;
    };
} & object;
