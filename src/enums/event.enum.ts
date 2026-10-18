/**
 * Enumeration representing various event types.
 *
 * @category Firemitt
 */
export enum EventType {

  /**
   * Sent by Fireguard once it is ready to receive its configuration. It may be sent several times until the configuration arrives.
   */
  Loaded,

  /**
   * Carries the Fireguard configuration, sent by the host in response to a Loaded event.
   */
  Config,

  /**
   * Indicates a successful authentication event, its payload carries the token.
   *
   * The member name is misspelled but kept as is, since it is part of the public API.
   */
  AuthSucceded,

  /**
   * Indicates a failed authentication event, its payload carries the serialized error.
   */
  AuthFailed,

  /**
   * Informational event sent by Fireguard when the user retries the authentication in the same popup or iframe.
   * It does not settle the session.
   */
  Retry,

  /**
   * Indicates that the authentication window was explicitly closed by the user.
   */
  Closed,
}
