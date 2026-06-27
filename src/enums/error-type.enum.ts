/**
 * @category Firemitt
 *
 * @description
 * Enumeration representing error names.
 */
export enum ErrorType {

  /**
   * @description
   * Invalid URL error.
   *
   * {@link InvalidURLError}
   */
  InvalidURL = 1,

  /**
   * @description
   * Invalid app error.
   *
   * {@link InvalidAppError}
   */
  InvalidApp = 2,

  /**
   * @description
   * Invalid app name error.
   *
   * {@link InvalidAppNameError}
   */
  InvalidAppName = 3,

  /**
   * @description
   * Invalid provider error.
   *
   * {@link InvalidProviderError}
   */
  InvalidProvider = 4,

  /**
   * @description
   * Invalid Firebase config error.
   *
   * {@link InvalidFirebaseConfigError}
   */
  InvalidFirebaseConfig = 5,
}
