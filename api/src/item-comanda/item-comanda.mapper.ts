import type { Product } from "../producto/producto.schema.ts";
import type { itemComanda } from "./item-comanda.schema.ts";
import type { OrderItem } from "./types/item-comanda.types.ts";

type ItemWithProduct = typeof itemComanda.$inferSelect & { producto: Product };

/** Relational query options that load an order's items with their product, in insertion order. */
export const ITEMS_WITH_PRODUCT = {
	orderBy: { id: "asc" },
	with: { producto: true },
} as const;

export const toOrderItem = (item: ItemWithProduct): OrderItem => ({
	id: item.id,
	productId: item.productoId,
	productName: item.producto.name,
	quantity: item.quantity,
	withSalt: item.withSalt,
});
