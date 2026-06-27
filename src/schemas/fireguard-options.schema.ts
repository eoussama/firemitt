import { z } from "zod";

import { FirebaseConfigSchema } from "./firebase-config.schema";



/**
 * Zod schema for validating Fireguard configuration options.
 * Name and firebase are required; logo and theme are optional.
 *
 * @category Schema
 */
export const FireguardOptionsSchema = z.object({
  name: z.string().min(1),
  firebase: FirebaseConfigSchema,
  logo: z.string().optional(),
  theme: z
    .object({
      text: z.string(),
      primary: z.string(),
      secondary: z.string(),
    })
    .partial()
    .optional(),
});
