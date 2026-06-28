import { z } from 'zod';
/**
 * Zod schema for validating a Firebase project configuration object.
 * All fields are required non-empty strings.
 *
 * @category Schema
 */
export declare const FirebaseConfigSchema: z.ZodObject<{
    apiKey: z.ZodString;
    appId: z.ZodString;
    projectId: z.ZodString;
    authDomain: z.ZodString;
    measurementId: z.ZodString;
    storageBucket: z.ZodString;
    messagingSenderId: z.ZodString;
}, z.core.$strip>;
