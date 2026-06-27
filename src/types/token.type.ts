/**
 * @category Firebase
 *
 * @description
 * Represents a token structure with additional properties.
 * This type is primarily used for authentication purposes, containing a token response and possibly other object properties.
 *
 * @type {TToken}
 */
export type TToken = {

  /**
   * @description
   * An object containing the OAuth ID token.
   */
  _tokenResponse: {

    /**
     * @description
     * The OAuth ID token.
     */
    oauthIdToken: string;
  };
} & object;
