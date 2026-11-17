import { z } from "zod";

/** Path id: a positive integer sent as text (e.g. the `:id` of `/api/orders/:id`). */
export const idSchema = z.coerce.number().int().positive();

/** Raw request body text parsed as JSON; the parsed value is validated by the schema piped after it. */
export const jsonBodySchema = z.string().transform((text, context): unknown => {
	try {
		const parsed: unknown = JSON.parse(text);
		return parsed;
	} catch {
		context.issues.push({
			code: "custom",
			message: "Request body must be valid JSON",
			input: text,
		});
		return z.NEVER;
	}
});
