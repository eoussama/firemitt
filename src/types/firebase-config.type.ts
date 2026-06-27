import type { z } from "zod";

import type { FirebaseConfigSchema } from "../schemas/firebase-config.schema";



/**
 * Represents the configuration settings for a Firebase application.
 * Derived from `FirebaseConfigSchema` to keep the type and validation in sync.
 *
 * @category Firebase
 *
 * @type {TFirebaseConfig}
 */
export type TFirebaseConfig = z.infer<typeof FirebaseConfigSchema>;
