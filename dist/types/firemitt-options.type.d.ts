import { z } from 'zod';
import { FiremittOptionsSchema } from '../schemas/firemitt-options.schema';
/**
 * Options for configuring Firemitt.
 * Derived from `FiremittOptionsSchema` to keep the type and validation in sync.
 *
 * @category Firemitt
 *
 * @type {TFiremittOptions}
 */
export type TFiremittOptions = z.infer<typeof FiremittOptionsSchema>;
