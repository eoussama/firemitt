/**
 * Enumeration representing error names.
 *
 * Values are part of the wire format exchanged with Fireguard, new members are only ever appended.
 *
 * @category Firemitt
 */
export enum ErrorType {

  /**
   * Invalid URL error.
   *
   * {@link InvalidURLError}
   */
  InvalidURL = 1,

  /**
   * Invalid app error.
   *
   * {@link InvalidAppError}
   */
  InvalidApp = 2,

  /**
   * Invalid app name error.
   *
   * {@link InvalidAppNameError}
   */
  InvalidAppName = 3,

  /**
   * Invalid provider error.
   *
   * {@link InvalidProviderError}
   */
  InvalidProvider = 4,

  /**
   * Invalid Firebase config error.
   *
   * {@link InvalidFirebaseConfigError}
   */
  InvalidFirebaseConfig = 5,

  /**
   * Invalid dimension error.
   *
   * {@link InvalidDimError}
   */
  InvalidDim = 6,

  /**
   * Invalid iframe error.
   *
   * {@link InvalidIframeError}
   */
  InvalidIframe = 7,

  /**
   * Popup blocked error.
   *
   * {@link PopupBlockedError}
   */
  PopupBlocked = 8,

  /**
   * Authentication failed error, reported by Fireguard.
   *
   * {@link AuthFailedError}
   */
  AuthFailed = 9,
}
