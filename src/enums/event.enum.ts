/**
 * Enumeration representing various event types.
 *
 * @category Firemitt
 */
export enum EventType {

  /**
   * Indicates that the application has been loaded successfully.
   */
  Loaded,

  /**
   * Represents a configuration-related event.
   */
  Config,

  /**
   * Indicates a successful authentication event.
   */
  AuthSucceded,

  /**
   * Indicates a failed authentication event.
   */
  AuthFailed,

  /**
   * Requests a retry of the authentication flow in the same popup or iframe.
   */
  Retry,

  /**
   * Indicates that the authentication window was explicitly closed by the user.
   */
  Closed,
}
