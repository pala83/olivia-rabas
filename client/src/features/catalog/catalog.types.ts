/** Mirrors `Product` from the API (`GET /api/products`). */
export type ProductCategory = "FOOD" | "DRINK";

export type Product = {
	id: number;
	name: string;
	category: ProductCategory;
	/** Set only for DRINK products. */
	containsAlcohol: boolean | null;
	/** Set only for DRINK products. */
	brand: string | null;
};
