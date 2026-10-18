import type { TUnsafe } from "@eoussama/core";
import type { TFireguardConfig, TMessage } from "..";
import type { TFiremittOptions } from "../types/firemitt-options.type";
import { Base64helper, ConfigHelper } from ".";
import { AuthFailedError, EventType, InvalidIframeError, PopupBlockedError } from "..";



/**
 * Interval in milliseconds for polling whether the Fireguard popup was closed by the user.
 * Used only as a fallback when no Closed event is received (e.g. user clicks the native window X).
 */
const CLOSED_POLL_INTERVAL = 500;

/**
 * Delay in milliseconds between noticing that the popup was closed and rejecting,
 * so that a result posted right before the window closed is still handled first.
 */
const CLOSED_GRACE_PERIOD = 300;

/**
 * Rejection message used when the Fireguard window is closed before authenticating.
 */
const CLOSED_MESSAGE = "The authentication window was closed.";

/**
 * Rejection message used when a session is replaced by a newer one.
 */
const REPLACED_MESSAGE = "A new authentication session was started.";

/**
 * A running authentication session.
 */
type TSession = {

  /**
   * Settles with the authentication token, or the reason of the failure.
   */
  promise: Promise<string>;

  /**
   * Rejects the session with the given reason, if it is still pending.
   */
  cancel: (reason: Error) => void;
};

/**
 * Helper class for handling authentication processes using Firemitt.
 *
 * Provides static methods to initiate authentication via a popup window or an embedded iframe.
 * Uses `ConfigHelper` to initialize and validate configuration, and runs a cross-window handshake
 * with the Fireguard auth page for each session.
 *
 * @category Helpers
 */
export class FiremittHelper {
  /**
   * Cancels the currently active session (popup or iframe), if any.
   */
  private static cancelActive: TUnsafe<() => void> = null;

  /**
   * Resolves the origin to post messages to, given the origin of a message received from Fireguard.
   * Opaque origins (`"null"`) cannot be targeted, in which case `"*"` is used.
   *
   * @param origin The origin of a received message.
   * @returns The target origin.
   */
  private static getTargetOrigin(origin: string): string {
    return origin && origin !== "null" ? origin : "*";
  }

  /**
   * Runs the event-driven handshake with a Fireguard window.
   *
   * The message listener is registered before the window is navigated to Fireguard, and only messages
   * posted by the window returned by `getTarget` are handled. Every `Loaded` event is answered with the
   * configuration (Fireguard announces itself again after reloads), and the session settles exactly once.
   *
   * @param getTarget - Returns the Fireguard window, it is evaluated for every message.
   * @param fireguard - The Fireguard config to send after each Loaded event.
   * @param teardown - Cleanup to run once the session settles, regardless of the outcome.
   * @returns The running session.
   */
  private static startSession(getTarget: () => TUnsafe<Window>, fireguard: TFireguardConfig, teardown: () => void): TSession {
    let fail!: (reason: Error) => void;

    const promise = new Promise<string>((resolve, reject) => {
      let settled = false;

      function finish(fn: () => void): void {
        if (!settled) {
          settled = true;
          window.removeEventListener("message", listener);
          teardown();
          fn();
        }
      }

      function listener(e: MessageEvent): void {
        const target = getTarget();

        if (!e.isTrusted || !target || e.source !== target) {
          return;
        }

        let message: TMessage<Record<string, unknown> | undefined>;

        try {
          message = Base64helper.decode(e.data);
        }
        catch {
          return;
        }

        switch (message.type) {
          case EventType.Loaded: {
            target.postMessage(Base64helper.encode({ type: EventType.Config, payload: { ...fireguard } }), FiremittHelper.getTargetOrigin(e.origin));
            break;
          }

          case EventType.AuthSucceded: {
            const token = message.payload?.token;

            if (typeof token === "string" && token.length > 0) {
              finish(() => resolve(token));
            }
            else {
              finish(() => reject(new AuthFailedError({ message: "Fireguard reported a successful authentication without a token" })));
            }

            break;
          }

          case EventType.AuthFailed: {
            finish(() => reject(new AuthFailedError(message.payload?.error)));
            break;
          }

          case EventType.Closed: {
            finish(() => reject(new Error(CLOSED_MESSAGE)));
            break;
          }
        }
      }

      fail = reason => finish(() => reject(reason));

      window.addEventListener("message", listener);
    });

    return { promise, cancel: fail };
  }

  /**
   * Makes the given session the active one, cancelling the previous active session.
   *
   * @param session - The new session.
   * @param onCancel - Extra cleanup to run when the session is cancelled by a newer one.
   */
  private static activate(session: TSession, onCancel: () => void = () => {}): void {
    FiremittHelper.cancelActive?.();

    const cancel = () => {
      onCancel();
      session.cancel(new Error(REPLACED_MESSAGE));
    };

    FiremittHelper.cancelActive = cancel;

    session.promise.then(
      () => FiremittHelper.release(cancel),
      () => FiremittHelper.release(cancel),
    );
  }

  /**
   * Forgets the active session if it is the given one.
   *
   * @param cancel - The cancel function of the settled session.
   */
  private static release(cancel: () => void): void {
    if (FiremittHelper.cancelActive === cancel) {
      FiremittHelper.cancelActive = null;
    }
  }

  /**
   * Initiates authentication using a popup window.
   *
   * @param options - The options required to configure and initiate the Firemitt authentication process.
   * @returns A promise that resolves with the authentication token on success, or rejects with an error on failure.
   * @throws {InvalidURLError | InvalidDimError | InvalidAppNameError | InvalidFirebaseConfigError} Synchronously, if the options are invalid.
   */
  private static authPopup(options: TFiremittOptions): Promise<string> {
    const config = ConfigHelper.init(options);
    const win = window.open(config.url, "_blank", ConfigHelper.getFlags(config));

    if (!win) {
      return Promise.reject(new PopupBlockedError());
    }

    let poller: ReturnType<typeof setInterval> | undefined;
    let grace: ReturnType<typeof setTimeout> | undefined;

    const session = FiremittHelper.startSession(() => win, config.fireguard, () => {
      clearInterval(poller);
      clearTimeout(grace);
    });

    FiremittHelper.activate(session, () => {
      if (!win.closed) {
        win.close();
      }
    });

    poller = setInterval(() => {
      // The grace period is shorter than the polling interval, so a closed popup starts a single grace period.
      if (win.closed) {
        grace = setTimeout(() => session.cancel(new Error(CLOSED_MESSAGE)), CLOSED_GRACE_PERIOD);
      }
    }, CLOSED_POLL_INTERVAL);

    return session.promise;
  }

  /**
   * Initiates authentication by embedding Fireguard inside an iframe.
   * Uses a caller-provided iframe element, or creates one inside the provided container.
   * If a previous session is still active, it is cancelled before starting the new one.
   *
   * @param options - The options required to configure and initiate the Firemitt authentication process.
   * @returns A promise that resolves with the authentication token on success, or rejects with an error on failure.
   * @throws {InvalidIframeError} Synchronously, if neither an iframe element nor a container is provided.
   * @throws {InvalidURLError | InvalidDimError | InvalidAppNameError | InvalidFirebaseConfigError} Synchronously, if the options are invalid.
   */
  private static authIframe(options: TFiremittOptions): Promise<string> {
    const { iframe: iframeOpts } = options;

    if (!iframeOpts?.element && !iframeOpts?.container) {
      throw new InvalidIframeError();
    }

    const config = ConfigHelper.init(options);
    const owned = !iframeOpts.element;
    const iframe = iframeOpts.element ?? document.createElement("iframe");

    const session = FiremittHelper.startSession(() => iframe.contentWindow, config.fireguard, () => {
      if (owned && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    });

    FiremittHelper.activate(session);

    if (owned) {
      iframe.style.width = `${config.dim.width}px`;
      iframe.style.height = `${config.dim.height}px`;
      iframeOpts.container!.appendChild(iframe);
    }

    iframe.src = config.url;

    return session.promise;
  }

  /**
   * Initiates authentication using Firemitt options.
   *
   * Depending on the `mode` field in `options`, this either opens a popup window (default)
   * or embeds Fireguard inside an iframe. In popup mode, it must be called synchronously from a
   * user gesture (e.g. a click handler), otherwise the browser blocks the popup.
   *
   * Starting a new session cancels the previous one, which then rejects with
   * `"A new authentication session was started."`.
   *
   * @param {TFiremittOptions} options - The options required to configure and initiate the Firemitt authentication process.
   * @returns {Promise<string>} A promise that resolves with the authentication token on success, or rejects with an error on failure
   * (`PopupBlockedError`, `AuthFailedError`, or an `Error` when the window is closed or the session is replaced).
   * @throws {InvalidURLError | InvalidDimError | InvalidAppNameError | InvalidFirebaseConfigError | InvalidIframeError} Synchronously, if the options are invalid.
   */
  static auth(options: TFiremittOptions): Promise<string> {
    if (options.mode === "iframe") {
      return FiremittHelper.authIframe(options);
    }

    return FiremittHelper.authPopup(options);
  }
}
