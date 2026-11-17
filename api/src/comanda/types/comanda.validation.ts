import { z } from "zod";
import {
	idSchema,
	jsonBodySchema,
} from "../../shared/types/shared.validation.ts";
import { ORDER_STATUSES } from "../comanda.schema.ts";

export const orderIdSchema = idSchema;

const orderItemSchema = z.object({
	productId: z
		.int({ error: "productId must be a positive integer" })
		.positive({ error: "productId must be a positive integer" }),
	quantity: z
		.int({ error: "quantity must be a positive integer" })
		.positive({ error: "quantity must be a positive integer" }),
	withSalt: z
		.boolean({ error: "withSalt must be a boolean" })
		.nullish()
		.transform((withSalt) => withSalt ?? null),
});

/** Shape of the receptionist's order. Catalog rules (product exists, salt per category) are checked by the service. */
export const orderRequestSchema = jsonBodySchema.pipe(
	z.object(
		{
			customerName: z
				.string({ error: "customerName must be a string" })
				.trim()
				.min(1, { error: "customerName must not be empty" }),
			notes: z
				.string({ error: "notes must be a string" })
				.trim()
				.nullish()
				.transform((notes) => notes || null),
			items: z
				.array(orderItemSchema, { error: "items must be an array" })
				.min(1, { error: "An order needs at least one item" }),
		},
		{ error: "Body must be a JSON object" },
	),
);

export const orderStatusChangeSchema = jsonBodySchema.pipe(
	z.object(
		{
			status: z.enum(ORDER_STATUSES, {
				error: `status must be one of ${ORDER_STATUSES.join(", ")}`,
			}),
		},
		{ error: "Body must be a JSON object" },
	),
);
