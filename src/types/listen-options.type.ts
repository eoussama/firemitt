/**
 * Options for {@link EventHelper.on}.
 *
 * @category Firemitt
 */
export type TListenOptions = {

  /**
   * When not `undefined`, only messages whose `MessageEvent.source` is this value are handled.
   * Note that `null` only matches messages without a source window, never messages posted by a window.
   */
  source?: MessageEventSource | null;
};
