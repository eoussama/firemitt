/**
 * Options for embedding Fireguard in an iframe.
 * Provide either an existing `element` or a `container` where Firemitt will
 * create and manage the iframe automatically.
 *
 * @category Firemitt
 *
 * @type {TIframeOptions}
 */
export type TIframeOptions = {
    /** An existing iframe element to use for embedding. */
    readonly element: HTMLIFrameElement;
    readonly container?: never;
} | {
    /** A container element where Firemitt will create and append an iframe. */
    readonly container: HTMLElement;
    readonly element?: never;
};
