import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import type { Database } from "../db/client.ts";
import {
	ITEMS_WITH_PRODUCT,
	toOrderItem,
} from "../item-comanda/item-comanda.mapper.ts";
import { itemComanda } from "../item-comanda/item-comanda.schema.ts";
import { producto } from "../producto/producto.schema.ts";
import type { OrderEventPublisher } from "../realtime/order-events.ts";
import type { Id } from "../shared/types/shared.types.ts";
import { comanda, type OrderStatus } from "./comanda.schema.ts";
import {
	InvalidOrderError,
	InvalidOrderStatusError,
	InvalidSaltOptionError,
	OrderNotFoundError,
	UnknownProductError,
} from "./types/comanda.errors.ts";
import type { Order, OrderRequest } from "./types/comanda.types.ts";
import {
	orderIdSchema,
	orderRequestSchema,
	orderStatusChangeSchema,
} from "./types/comanda.validation.ts";

type Dependencies = {
	db: Database;
	events: OrderEventPublisher;
	now?: () => Date;
};

const timerStartAfter = (
	current: { status: OrderStatus; updatedAt: string; timerStartedAt: string },
	next: OrderStatus,
	changedAt: Date,
): string => {
	if (current.status !== "FINISHED" || next === "FINISHED")
		return current.timerStartedAt;
	const timeDelivered = changedAt.getTime() - Date.parse(current.updatedAt);
	return new Date(
		Date.parse(current.timerStartedAt) + timeDelivered,
	).toISOString();
};

const parseOrderId = (rawId: string): Id => {
	const result = orderIdSchema.safeParse(rawId);
	if (!result.success) throw new OrderNotFoundError(rawId);
	return result.data;
};

export const createComandaService = ({
	db,
	events,
	now = () => new Date(),
}: Dependencies) => {
	const findOrder = async (id: Id): Promise<Order> => {
		const row = await db.query.comanda.findFirst({
			where: { id },
			with: { items: ITEMS_WITH_PRODUCT },
		});
		if (!row) throw new OrderNotFoundError(id);
		return { ...row, items: row.items.map(toOrderItem) };
	};

	/** Checks the request against the catalog: every product exists and `withSalt` matches its category. */
	const toItemRows = async (request: OrderRequest) => {
		const productIds = [
			...new Set(request.items.map((item) => item.productId)),
		];
		const catalog = new Map(
			(
				await db.select().from(producto).where(inArray(producto.id, productIds))
			).map((p) => [p.id, p]),
		);

		return request.items.map(({ productId, quantity, withSalt }) => {
			const product = catalog.get(productId);
			if (!product) throw new UnknownProductError(productId);
			if (product.category === "FOOD" && withSalt === null) {
				throw new InvalidSaltOptionError(
					`withSalt is required for food product ${product.name}`,
				);
			}
			if (product.category === "DRINK" && withSalt !== null) {
				throw new InvalidSaltOptionError(
					`withSalt does not apply to drink product ${product.name}`,
				);
			}
			return { productoId: product.id, quantity, withSalt };
		});
	};

	return {
		list: async (): Promise<Order[]> => {
			const rows = await db.query.comanda.findMany({
				orderBy: { createdAt: "asc", id: "asc" },
				with: { items: ITEMS_WITH_PRODUCT },
			});
			return rows.map((row) => ({ ...row, items: row.items.map(toOrderItem) }));
		},

		get: (rawId: string): Promise<Order> => findOrder(parseOrderId(rawId)),

		/** Every new order starts as ORDERED, stamped with the server time. */
		create: async (rawBody: string): Promise<Order> => {
			const parsed = orderRequestSchema.safeParse(rawBody);
			if (!parsed.success) {
				throw new InvalidOrderError(z.prettifyError(parsed.error));
			}
			const { customerName, notes } = parsed.data;
			const items = await toItemRows(parsed.data);

			const createdAt = now().toISOString();
			const id = await db.transaction(async (tx) => {
				const [created] = await tx
					.insert(comanda)
					.values({
						customerName,
						notes,
						createdAt,
						// Last change and timer start both begin at creation.
						updatedAt: createdAt,
						timerStartedAt: createdAt,
						status: "ORDERED",
					})
					.returning({ id: comanda.id });
				if (!created) throw new Error("COMANDA insert returned no row");
				await tx
					.insert(itemComanda)
					.values(items.map((item) => ({ ...item, comandaId: created.id })));
				return created.id;
			});

			const saved = await findOrder(id);
			events.publish({ type: "order.created", order: saved });
			return saved;
		},

		/** Cambia el estado de una orden */
		changeStatus: async (rawId: string, rawBody: string): Promise<Order> => {
			const id = parseOrderId(rawId);
			const parsed = orderStatusChangeSchema.safeParse(rawBody);
			if (!parsed.success) {
				throw new InvalidOrderStatusError(z.prettifyError(parsed.error));
			}

			const next = parsed.data.status;

			await db.transaction(async (tx) => {
				const [current] = await tx
					.select({
						status: comanda.status,
						updatedAt: comanda.updatedAt,
						timerStartedAt: comanda.timerStartedAt,
					})
					.from(comanda)
					.where(eq(comanda.id, id));
				if (!current) throw new OrderNotFoundError(id);
				// Same status again: nothing changes, so a delivered total can't grow.
				if (current.status === next) return;

				const changedAt = now();
				await tx
					.update(comanda)
					.set({
						status: next,
						updatedAt: changedAt.toISOString(),
						timerStartedAt: timerStartAfter(current, next, changedAt),
					})
					.where(eq(comanda.id, id));
			});

			const order = await findOrder(id);
			events.publish({ type: "order.status_changed", order });
			return order;
		},
	};
};

export type ComandaService = ReturnType<typeof createComandaService>;
