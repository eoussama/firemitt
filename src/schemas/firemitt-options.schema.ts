import { z } from "zod";

import { FireguardOptionsSchema } from "./fireguard-options.schema";



/**
 * Zod schema for validating the top-level Firemitt options object.
 * URL must be a valid http or https URL. All other fields are optional.
 *
 * @category Schema
 */
export const FiremittOptionsSchema = z.object({
  url: z.string().refine(
    (val) => {
      try {
        const parsed = new URL(val);

        return parsed.protocol === "http:" || parsed.protocol === "https:";
      }
      catch {
        return false;
      }
    },
    { message: "Invalid URL" },
  ),
  pos: z
    .object({
      x: z.number().optional(),
      y: z.number().optional(),
    })
    .optional(),
  dim: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  config: FireguardOptionsSchema.partial().optional(),
});
