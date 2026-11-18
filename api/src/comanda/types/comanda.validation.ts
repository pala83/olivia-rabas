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
				.string({ error: "El nombre debe ser una cadena de texto" })
				.trim()
				.min(1, { error: "El nombre no puede estar vacío" }),
			notes: z
				.string({ error: "El campo notes debe ser una cadena de texto" })
				.trim()
				.nullish()
				.transform((notes) => notes || null),
			items: z
				.array(orderItemSchema, { error: "Los items deben ser un array" })
				.min(1, { error: "Una orden necesita al menos un item" }),
		},
		{ error: "El cuerpo debe ser un objeto JSON" },
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
