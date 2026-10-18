import { z } from 'zod';
/**
 * Zod schema for validating a Firebase project configuration object.
 * `apiKey`, `appId`, `projectId` and `authDomain` are required non-empty strings,
 * the remaining fields are optional since Firebase Authentication does not need them.
 *
 * @category Schema
 */
export declare const FirebaseConfigSchema: z.ZodObject<{
    apiKey: z.ZodString;
    appId: z.ZodString;
    projectId: z.ZodString;
    authDomain: z.ZodString;
    measurementId: z.ZodOptional<z.ZodString>;
    storageBucket: z.ZodOptional<z.ZodString>;
    messagingSenderId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
