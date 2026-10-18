import { TUnsafe } from '@eoussama/core';
import { TListenOptions } from '..';
import { EventType } from '../enums/event.enum';
/**
 * Helper class for managing custom events across different windows or iframes.
 *
 * This class provides static methods to initialize the event system, send encoded messages, and listen for specific event types.
 * It uses the `Base64helper` class for encoding and decoding messages.
 *
 * @category Helpers
 */
export declare class EventHelper {
    /**
     * The window messages are posted to.
     */
    private static target;
    /**
     * The window message listeners are attached to.
     */
    private static hostWindow;
    /**
     * Active message listeners, mapped to the window they are attached to.
     */
    private static handlers;
    /**
     * Removes all active message listeners registered by this helper.
     * Called before each new session to prevent stale handlers from a previous
     * session from intercepting events meant for the new one.
     */
    static dispose(): void;
    /**
     * Initializes the EventHelper with a target window.
     *
     * This method sets the target window where the messages will be posted to.
     * Any listeners registered during a previous session are removed first.
     * The calling page's window is captured as the host window for message listeners.
     * When no target is given, nothing is changed and the current session is left untouched.
     *
     * @param {TUnsafe<Window>} target - The target window to which messages will be sent.
     * @returns {boolean} Returns true if the target is successfully set, otherwise false.
     */
    static init(target: TUnsafe<Window>): boolean;
    /**
     * Sends a message to the target window.
     *
     * This method encodes a message of the specified event type and data, then posts it to the target window.
     * It does nothing when {@link EventHelper.init} was never called successfully.
     *
     * @template T - The type of data being sent.
     * @param {EventType} type - The type of event.
     * @param {T} [data] - Optional data to be included in the event message.
     * @param {string} [targetOrigin] - The origin the target window must have for the message to be delivered. Defaults to `"*"`.
     * @returns {typeof EventHelper} Returns the EventHelper class for method chaining.
     */
    static send<T extends object = object>(type: EventType, data?: T, targetOrigin?: string): typeof EventHelper;
    /**
     * Sets up a one-time event listener for a specific event type.
     *
     * This method listens for messages of the specified event type and executes the provided function the first time such an event occurs.
     * Untrusted events, events that are not valid encoded messages, and (when `options.source` is not `undefined`) events
     * coming from any other source are ignored.
     *
     * @template T - The expected type of data in the event message.
     * @param {EventType} type - The type of event to listen for.
     * @param {(data?: T, event?: MessageEvent) => void} func - The function to execute when the event is received. It receives the event data and the raw message event.
     * @param {TListenOptions} [options] - Optional listener options.
     * @returns {typeof EventHelper} Returns the EventHelper class for method chaining.
     */
    static on<T = unknown>(type: EventType, func: (data?: T, event?: MessageEvent) => void, options?: TListenOptions): typeof EventHelper;
}
