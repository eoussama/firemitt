/**
 * @category Firebase
 *
 * Represents the configuration settings for a Firebase application.
 *
 * This type defines the necessary parameters to configure and initialize a Firebase application.
 * It includes details for various Firebase services such as Authentication, Firestore, Analytics, and others.
 *
 * @type {TFirebaseConfig}
 */
export type TFirebaseConfig = {

  /**
   * The unique identifier for the Firebase application.
   */
  appId: string;

  /**
   * The API key used for authenticating requests from the app.
   */

  apiKey: string;

  /**
   * The globally unique identifier for the Firebase project.
   */
  projectId: string;

  /**
   * The domain used for Firebase Authentication.
   */
  authDomain: string;

  /**
   * The identifier for Google Analytics for Firebase.
   */
  measurementId: string;

  /**
   * The Google Cloud Storage bucket for Firebase Storage.
   */
  storageBucket: string;

  /**
   * The sender ID for Firebase Cloud Messaging.
   */
  messagingSenderId: string;
};
