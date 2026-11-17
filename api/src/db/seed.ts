import { producto } from "../producto/producto.schema.ts";
import type { Database } from "./client.ts";

const SEED_PRODUCTS: (typeof producto.$inferInsert)[] = [
	{ name: "Papas", category: "FOOD", containsAlcohol: null, brand: null },
	{ name: "Rabas", category: "FOOD", containsAlcohol: null, brand: null },
	{
		name: "Cerveza",
		category: "DRINK",
		containsAlcohol: true,
		brand: "Quilmes",
	},
	{
		name: "Gaseosa",
		category: "DRINK",
		containsAlcohol: false,
		brand: "Coca-Cola",
	},
	{
		name: "Agua",
		category: "DRINK",
		containsAlcohol: false,
		brand: "Villavicencio",
	},
];

/** Inserts the initial catalog only when PRODUCTO is empty. */
export const seedDatabase = async (db: Database): Promise<void> => {
	if ((await db.$count(producto)) > 0) return;
	await db.insert(producto).values(SEED_PRODUCTS);
};
