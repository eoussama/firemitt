/**
 * @category Firebase
 *
 * @description
 * Represents the configuration settings for a Firebase application.
 *
 * This type defines the necessary parameters to configure and initialize a Firebase application.
 * It includes details for various Firebase services such as Authentication, Firestore, Analytics, and others.
 *
 * @type {TFirebaseConfig}
 */
export type TFirebaseConfig = {

  /**
   * @description
   * The unique identifier for the Firebase application.
   */
  appId: string;

  /**
   * @description
   * The API key used for authenticating requests from the app.
   */

  apiKey: string;

  /**
   * @description
   * The globally unique identifier for the Firebase project.
   */
  projectId: string;

  /**
   * @description
   * The domain used for Firebase Authentication.
   */
  authDomain: string;

  /**
   * @description
   * The identifier for Google Analytics for Firebase.
   */
  measurementId: string;

  /**
   * @description
   * The Google Cloud Storage bucket for Firebase Storage.
   */
  storageBucket: string;

  /**
   * @description
   * The sender ID for Firebase Cloud Messaging.
   */
  messagingSenderId: string;
};
