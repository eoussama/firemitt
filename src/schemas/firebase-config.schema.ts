import { z } from "zod";



/**
 * Zod schema for validating a Firebase project configuration object.
 * All fields are required non-empty strings.
 *
 * @category Schema
 */
export const FirebaseConfigSchema = z.object({
  apiKey: z.string().min(1),
  appId: z.string().min(1),
  projectId: z.string().min(1),
  authDomain: z.string().min(1),
  measurementId: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
});
