import { z } from 'zod';
import { FireguardOptionsSchema } from '../schemas/fireguard-options.schema';
/**
 * Options for configuring Fireguard.
 * Derived from `FireguardOptionsSchema` to keep the type and validation in sync.
 *
 * @category Fireguard
 *
 * @type {TFireguardOptions}
 */
export type TFireguardOptions = z.infer<typeof FireguardOptionsSchema>;
