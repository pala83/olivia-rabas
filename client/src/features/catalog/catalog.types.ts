/** Mirrors `Product` from the API (`GET /api/products`). */
export type ProductCategory = "FOOD" | "DRINK";

export type Product = {
	id: number;
	name: string;
	category: ProductCategory;
	containsAlcohol: boolean | null;
	brand: string | null;
};
