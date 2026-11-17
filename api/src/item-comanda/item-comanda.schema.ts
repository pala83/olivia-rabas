import { index, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { comanda } from "../comanda/comanda.schema.ts";
import { producto } from "../producto/producto.schema.ts";

export const itemComanda = sqliteTable(
	"ITEM_COMANDA",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		comandaId: integer("comanda_id")
			.notNull()
			.references(() => comanda.id, { onDelete: "cascade" }),
		productoId: integer("producto_id")
			.notNull()
			.references(() => producto.id),
		quantity: integer().notNull(),
		/** Set only for FOOD products; null for DRINK. */
		withSalt: integer("with_salt", { mode: "boolean" }),
	},
	(table) => [index("ITEM_COMANDA_comanda_id").on(table.comandaId)],
);
