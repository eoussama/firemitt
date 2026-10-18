/**
 * Enumeration representing various event types.
 *
 * @category Firemitt
 */
export declare enum EventType {
    /**
     * Sent by Fireguard once it is ready to receive its configuration. It may be sent several times until the configuration arrives.
     */
    Loaded = 0,
    /**
     * Carries the Fireguard configuration, sent by the host in response to a Loaded event.
     */
    Config = 1,
    /**
     * Indicates a successful authentication event, its payload carries the token.
     *
     * The member name is misspelled but kept as is, since it is part of the public API.
     */
    AuthSucceded = 2,
    /**
     * Indicates a failed authentication event, its payload carries the serialized error.
     */
    AuthFailed = 3,
    /**
     * Informational event sent by Fireguard when the user retries the authentication in the same popup or iframe.
     * It does not settle the session.
     */
    Retry = 4,
    /**
     * Indicates that the authentication window was explicitly closed by the user.
     */
    Closed = 5
}
