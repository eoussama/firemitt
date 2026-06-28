import { z } from 'zod';
/**
 * Zod schema for validating the top-level Firemitt options object.
 * URL must be a valid http or https URL. All other fields are optional.
 *
 * @category Schema
 */
export declare const FiremittOptionsSchema: z.ZodObject<{
    url: z.ZodString;
    pos: z.ZodOptional<z.ZodObject<{
        x: z.ZodOptional<z.ZodNumber>;
        y: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    dim: z.ZodOptional<z.ZodObject<{
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    config: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        firebase: z.ZodOptional<z.ZodObject<{
            apiKey: z.ZodString;
            appId: z.ZodString;
            projectId: z.ZodString;
            authDomain: z.ZodString;
            measurementId: z.ZodString;
            storageBucket: z.ZodString;
            messagingSenderId: z.ZodString;
        }, z.core.$strip>>;
        logo: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        provider: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        theme: z.ZodOptional<z.ZodOptional<z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            primary: z.ZodOptional<z.ZodString>;
            secondary: z.ZodOptional<z.ZodString>;
            background: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    mode: z.ZodOptional<z.ZodEnum<{
        popup: "popup";
        iframe: "iframe";
    }>>;
    iframe: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        element: z.ZodCustom<HTMLIFrameElement, HTMLIFrameElement>;
        container: z.ZodOptional<z.ZodNever>;
    }, z.core.$strip>, z.ZodObject<{
        container: z.ZodCustom<HTMLElement, HTMLElement>;
        element: z.ZodOptional<z.ZodNever>;
    }, z.core.$strip>]>>;
}, z.core.$strip>;
