import { z } from "zod";



/**
 * Zod schema for validating a Firebase project configuration object.
 * `apiKey`, `appId`, `projectId` and `authDomain` are required non-empty strings,
 * the remaining fields are optional since Firebase Authentication does not need them.
 *
 * @category Schema
 */
export const FirebaseConfigSchema = z.object({
  apiKey: z.string().min(1),
  appId: z.string().min(1),
  projectId: z.string().min(1),
  authDomain: z.string().min(1),
  measurementId: z.string().optional(),
  storageBucket: z.string().optional(),
  messagingSenderId: z.string().optional(),
});
