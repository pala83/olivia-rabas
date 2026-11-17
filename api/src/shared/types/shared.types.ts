import type { z } from "zod";
import type { idSchema } from "./shared.validation.ts";

/** A validated path id: always a positive integer. */
export type Id = z.infer<typeof idSchema>;
