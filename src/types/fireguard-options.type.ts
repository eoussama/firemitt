import type { z } from "zod";

import type { FireguardOptionsSchema } from "../schemas/fireguard-options.schema";



/**
 * Options for configuring Fireguard.
 * Derived from `FireguardOptionsSchema` to keep the type and validation in sync.
 *
 * @category Fireguard
 *
 * @type {TFireguardOptions}
 */
export type TFireguardOptions = z.infer<typeof FireguardOptionsSchema>;
