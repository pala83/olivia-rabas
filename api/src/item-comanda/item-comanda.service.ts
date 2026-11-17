import type { Database } from "../db/client.ts";
import { ITEMS_WITH_PRODUCT, toOrderItem } from "./item-comanda.mapper.ts";
import { OrderItemsNotFoundError } from "./types/item-comanda.errors.ts";
import type { OrderItem } from "./types/item-comanda.types.ts";
import { orderItemsIdSchema } from "./types/item-comanda.validation.ts";

type Dependencies = { db: Database };

/** Read-only: items are created together with their order (see comanda.service.ts). */
export const createItemComandaService = ({ db }: Dependencies) => ({
	listByOrder: async (rawOrderId: string): Promise<OrderItem[]> => {
		const parsed = orderItemsIdSchema.safeParse(rawOrderId);
		if (!parsed.success) throw new OrderItemsNotFoundError(rawOrderId);

		const order = await db.query.comanda.findFirst({
			where: { id: parsed.data },
			columns: { id: true },
			with: { items: ITEMS_WITH_PRODUCT },
		});
		if (!order) throw new OrderItemsNotFoundError(parsed.data);
		return order.items.map(toOrderItem);
	},
});

export type ItemComandaService = ReturnType<typeof createItemComandaService>;
