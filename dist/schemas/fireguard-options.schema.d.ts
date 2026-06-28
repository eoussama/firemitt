import { z } from 'zod';
/**
 * Zod schema for validating Fireguard configuration options.
 * Name and firebase are required; logo and theme are optional.
 *
 * @category Schema
 */
export declare const FireguardOptionsSchema: z.ZodObject<{
    name: z.ZodString;
    firebase: z.ZodObject<{
        apiKey: z.ZodString;
        appId: z.ZodString;
        projectId: z.ZodString;
        authDomain: z.ZodString;
        measurementId: z.ZodString;
        storageBucket: z.ZodString;
        messagingSenderId: z.ZodString;
    }, z.core.$strip>;
    logo: z.ZodOptional<z.ZodString>;
    provider: z.ZodOptional<z.ZodString>;
    theme: z.ZodOptional<z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        primary: z.ZodOptional<z.ZodString>;
        secondary: z.ZodOptional<z.ZodString>;
        background: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
