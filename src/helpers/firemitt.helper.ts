import type { TFiremittOptions } from "../types/firemitt-options.type";
import { ConfigHelper, EventHelper } from ".";
import { EventType } from "..";



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
   * Initiates authentication using Firemitt options.
   *
   * This static method opens a new window with the Firemitt URL and sets up event listeners to handle the authentication process.
   * It listens for authentication success or failure events and resolves or rejects the promise accordingly.
   *
   * @param {TFiremittOptions} options - The options required to configure and initiate the Firemitt authentication process.
   * @returns {Promise<string>} A promise that resolves with the authentication token on success, or rejects with an error on failure.
   */
  static auth(options: TFiremittOptions): Promise<string> {
    const config = ConfigHelper.init(options);
    const flags = ConfigHelper.getFlags(config);
    const win = window.open(config.url, "_blank", flags) as Window;

    return new Promise((resolve, reject) => {
      if (!EventHelper.init(win)) {
        return;
      }

      let settled = false;
      let closedPoller: ReturnType<typeof setInterval>;

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
  }
}
