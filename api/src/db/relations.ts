import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.ts";

export const relations = defineRelations(schema, (r) => ({
	comanda: {
		items: r.many.itemComanda(),
	},
	itemComanda: {
		comanda: r.one.comanda({
			from: r.itemComanda.comandaId,
			to: r.comanda.id,
			optional: false,
		}),
		producto: r.one.producto({
			from: r.itemComanda.productoId,
			to: r.producto.id,
			optional: false,
		}),
	},
}));
