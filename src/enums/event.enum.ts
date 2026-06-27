/**
 * @category Firemitt
 *
 * @description
 * Enumeration representing various event types.
 */
export enum EventType {

  /*
   * @description
   * Indicates that the application has been loaded successfully.
   */
  Loaded,

  /*
   * @description
   * Represents a configuration-related event.
   */
  Config,

  /*
   * @description
   * Indicates a successful authentication event.
   */
  AuthSucceded,

  /*
   * @description
   * Indicates a failed authentication event.
   */
  AuthFailed,
}
