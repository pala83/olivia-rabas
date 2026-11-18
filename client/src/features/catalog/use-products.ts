import { useEffect, useState } from "react";
import { listProducts } from "./catalog.api";
import type { Product } from "./catalog.types";

type ProductsState =
	| { status: "loading" }
	| { status: "error"; message: string }
	| { status: "ready"; products: Product[] };

/** Loads the product catalog once. */
export const useProducts = (): ProductsState => {
	const [state, setState] = useState<ProductsState>({ status: "loading" });

	useEffect(() => {
		let active = true;
		listProducts()
			.then((products) => {
				if (active) setState({ status: "ready", products });
			})
			.catch((error: Error) => {
				if (active) setState({ status: "error", message: error.message });
			});
		return () => {
			active = false;
		};
	}, []);

	return state;
};
