import type { Product } from "../../catalog.types";
import { DrinkTile } from "./DrinkTile";

type DrinkGroupProps = {
	title: string;
	products: Product[];
};

/** "Sin alcohol" / "Con alcohol" grid of drink tiles. */
export function DrinkGroup({ title, products }: DrinkGroupProps) {
	return (
		<div className="flex flex-col gap-2.5">
			<h3 className="m-0 text-sm font-semibold">{title}</h3>
			<div className="grid grid-cols-[repeat(auto-fit,minmax(min(190px,100%),1fr))] gap-3">
				{products.map((product) => (
					<DrinkTile key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}
