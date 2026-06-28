/**
 * Enumeration representing various event types.
 *
 * @category Firemitt
 */
export declare enum EventType {
    /**
     * Indicates that the application has been loaded successfully.
     */
    Loaded = 0,
    /**
     * Represents a configuration-related event.
     */
    Config = 1,
    /**
     * Indicates a successful authentication event.
     */
    AuthSucceded = 2,
    /**
     * Indicates a failed authentication event.
     */
    AuthFailed = 3,
    /**
     * Requests a retry of the authentication flow in the same popup or iframe.
     */
    Retry = 4,
    /**
     * Indicates that the authentication window was explicitly closed by the user.
     */
    Closed = 5
}
