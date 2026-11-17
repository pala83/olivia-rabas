import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const PRODUCT_CATEGORIES = ["FOOD", "DRINK"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const producto = sqliteTable("PRODUCTO", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	category: text({ enum: PRODUCT_CATEGORIES }).notNull(),
	/** Set only for DRINK products; null for FOOD. */
	containsAlcohol: integer("contains_alcohol", { mode: "boolean" }),
	/** Set only for DRINK products; null for FOOD. */
	brand: text(),
});

export type Product = typeof producto.$inferSelect;
