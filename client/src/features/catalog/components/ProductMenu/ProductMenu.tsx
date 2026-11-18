import { useProducts } from "../../use-products";
import { DrinkGroup } from "./DrinkGroup";
import { FriedFoodCard } from "./FriedFoodCard";
import { MenuSection } from "./MenuSection";

/** Reception menu: "Fritura" (with or without salt) and "Bebidas". */
export function ProductMenu() {
	const catalog = useProducts();

	if (catalog.status === "loading") {
		return (
			<p className="m-0 text-sm text-muted-foreground">Cargando productos…</p>
		);
	}
	if (catalog.status === "error") {
		return (
			<p role="alert" className="m-0 text-sm font-medium text-destructive">
				No se pudo cargar el catálogo: {catalog.message}
			</p>
		);
	}

	const fried = catalog.products.filter(
		(product) => product.category === "FOOD",
	);
	const drinks = catalog.products.filter(
		(product) => product.category === "DRINK",
	);
	const drinkGroups = [
		{
			title: "Sin alcohol",
			items: drinks.filter((d) => d.containsAlcohol !== true),
		},
		{
			title: "Con alcohol",
			items: drinks.filter((d) => d.containsAlcohol === true),
		},
	].filter((group) => group.items.length > 0);

	return (
		<>
			<MenuSection
				id="kds-h-fritura"
				title="Fritura"
				description="Cada toque suma una porción. Elegí con o sin sal."
			>
				<div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
					{fried.map((product) => (
						<FriedFoodCard key={product.id} product={product} />
					))}
				</div>
			</MenuSection>
			<MenuSection
				id="kds-h-bebidas"
				title="Bebidas"
				description="Tocá una bebida para sumar una unidad."
			>
				{drinkGroups.map((group) => (
					<DrinkGroup
						key={group.title}
						title={group.title}
						products={group.items}
					/>
				))}
			</MenuSection>
		</>
	);
}
