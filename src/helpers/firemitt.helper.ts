import type { TFiremittOptions } from "../types/firemitt-options.type";
import { ConfigHelper, EventHelper } from ".";
import { EventType, InvalidIframeError } from "..";



/**
 * @description
 * Interval in milliseconds for polling whether the Fireguard popup was closed by the browser.
 * Used only as a fallback when no Closed event is received (e.g. user clicks the native window X).
 */
const CLOSED_POLL_INTERVAL = 500;

/**
 * Helper class for handling authentication processes using Firemitt.
 *
 * @category Helpers
 *
 * This class provides a static method to facilitate authentication by configuring and communicating with a Firemitt window.
 * It uses the `ConfigHelper` to initialize configuration and the `EventHelper` to manage event communications.
 *
 * @class FiremittHelper
 */
export class FiremittHelper {
  /**
   * Cancels the currently active iframe session, if any.
   * Removes the owned iframe from the DOM and rejects its promise.
   */
  private static cancelActiveIframe: (() => void) | null = null;

  /**
   * Runs the shared event-driven auth flow against an already-initialized `EventHelper` target.
   * Resolves with the token on success, rejects on failure or close.
   * The `cleanup` callback is invoked once the promise settles (regardless of outcome).
   *
   * @param fireguardConfig - The Fireguard config to send after the Loaded event.
   * @param cleanup - Teardown to run after settling.
   * @returns A promise that resolves with the authentication token or rejects with an error.
   */
  /* v8 ignore next */
  private static runSession(
    fireguardConfig: ReturnType<typeof ConfigHelper.init>["fireguard"],
    cleanup: () => void,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let settled = false;

      const settle = (fn: () => void) => {
        if (!settled) {
          settled = true;
          cleanup();
          fn();
        }
      };

      const handleLoaded = () => {
        EventHelper
          .send(EventType.Config, fireguardConfig)
          .on<{ token: string }>(EventType.AuthSucceded, (data) => {
            settle(() => resolve(data!.token));
          })
          .on<{ error: string }>(EventType.AuthFailed, (data) => {
            settle(() => reject(data!.error));
          })
          .on(EventType.Closed, () => {
            settle(() => reject(new Error("The authentication window was closed.")));
          });

        EventHelper.on(EventType.Loaded, handleLoaded);
      };

      EventHelper
        .on(EventType.Loaded, handleLoaded)
        .on(EventType.Retry, () => {});
    });
  }

  /**
   * Initiates authentication using a popup window.
   *
   * @param options - The options required to configure and initiate the Firemitt authentication process.
   * @returns A promise that resolves with the authentication token on success, or rejects with an error on failure.
   */
  private static authPopup(options: TFiremittOptions): Promise<string> {
    const config = ConfigHelper.init(options);
    const flags = ConfigHelper.getFlags(config);
    const win = window.open(config.url, "_blank", flags) as Window;

    if (!EventHelper.init(win)) {
      return new Promise(() => {});
    }

    let closedPoller: ReturnType<typeof setInterval>;

    const promise = new Promise<string>((resolve, reject) => {
      let settled = false;

      const settle = (fn: () => void) => {
        if (!settled) {
          settled = true;
          clearInterval(closedPoller);
          fn();
        }
      };

      closedPoller = setInterval(() => {
        if (win.closed) {
          settle(() => reject(new Error("The authentication window was closed.")));
        }
      }, CLOSED_POLL_INTERVAL);

      const handleLoaded = () => {
        EventHelper
          .send(EventType.Config, config.fireguard)
          .on<{ token: string }>(EventType.AuthSucceded, (data) => {
            settle(() => resolve(data!.token));
          })
          .on<{ error: string }>(EventType.AuthFailed, (data) => {
            settle(() => reject(data!.error));
          })
          .on(EventType.Closed, () => {
            settle(() => reject(new Error("The authentication window was closed.")));
          });

        EventHelper.on(EventType.Loaded, handleLoaded);
      };

      EventHelper
        .on(EventType.Loaded, handleLoaded)
        .on(EventType.Retry, () => {});
    });

    return promise;
  }

  /**
   * Initiates authentication by embedding Fireguard inside an iframe.
   * Uses a caller-provided iframe element, or creates one inside the provided container.
   * If a previous iframe session is still active, it is cancelled before starting the new one.
   *
   * @param options - The options required to configure and initiate the Firemitt authentication process.
   * @returns A promise that resolves with the authentication token on success, or rejects with an error on failure.
   * @throws {InvalidIframeError} If neither an iframe element nor a container is provided.
   */
  private static authIframe(options: TFiremittOptions): Promise<string> {
    const { iframe: iframeOpts } = options;

    if (!iframeOpts?.element && !iframeOpts?.container) {
      throw new InvalidIframeError();
    }

    FiremittHelper.cancelActiveIframe?.();
    FiremittHelper.cancelActiveIframe = null;

    const config = ConfigHelper.init(options);

    let iframe: HTMLIFrameElement;
    let owned = false;

    if (iframeOpts.element) {
      iframe = iframeOpts.element;
    }
    else {
      iframe = document.createElement("iframe");
      owned = true;
      iframeOpts.container!.appendChild(iframe);
    }

    if (owned) {
      iframe.style.width = `${config.dim.width}px`;
      iframe.style.height = `${config.dim.height}px`;
    }

    iframe.src = config.url;

    const cleanup = () => {
      FiremittHelper.cancelActiveIframe = null;

      if (owned && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    return new Promise<string>((resolve, reject) => {
      let cancelled = false;

      FiremittHelper.cancelActiveIframe = () => {
        cancelled = true;
        cleanup();
        reject(new Error("A new authentication session was started."));
      };

      iframe.addEventListener("load", () => {
        if (cancelled) {
          return;
        }

        const win = iframe.contentWindow;

        if (!win || !EventHelper.init(win)) {
          cleanup();
          reject(new Error("Could not access the iframe window."));

          return;
        }

        FiremittHelper.runSession(config.fireguard, cleanup).then(resolve, reject);
      }, { once: true });
    });
  }

  /**
   * Initiates authentication using Firemitt options.
   *
   * Depending on the `mode` field in `options`, this either opens a popup window (default)
   * or embeds Fireguard inside an iframe.
   *
   * @param {TFiremittOptions} options - The options required to configure and initiate the Firemitt authentication process.
   * @returns {Promise<string>} A promise that resolves with the authentication token on success, or rejects with an error on failure.
   */
  static auth(options: TFiremittOptions): Promise<string> {
    if (options.mode === "iframe") {
      return FiremittHelper.authIframe(options);
    }

    return FiremittHelper.authPopup(options);
  }
}
