import type { z } from "zod";
import type { OrderItem } from "../../item-comanda/types/item-comanda.types.ts";
import type { OrderStatus } from "../comanda.schema.ts";
import type {
	orderRequestSchema,
	orderStatusChangeSchema,
} from "./comanda.validation.ts";

export type Order = {
	id: number;
	customerName: string;
	notes: string | null;
	createdAt: string;
	/** Last change (creation or status change); for a FINISHED order, when it was delivered. */
	updatedAt: string;
	/**
	 * Effective start of the kitchen timer: the timer shows `now - timerStartedAt`, or
	 * `updatedAt - timerStartedAt` (frozen) once FINISHED. Moves forward when an order is reopened.
	 */
	timerStartedAt: string;
	status: OrderStatus;
	items: OrderItem[];
};

/** A validated order request: trimmed name, `notes` and `withSalt` normalized to null. */
export type OrderRequest = z.infer<typeof orderRequestSchema>;

export type OrderStatusChange = z.infer<typeof orderStatusChangeSchema>;
