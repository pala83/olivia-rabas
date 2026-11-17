import { CupSoda, Plus, Utensils } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { lineKey, type OrderDraft } from "../use-order-draft";
import { useProducts } from "../use-products";

type ProductPickerProps = {
	draft: OrderDraft;
};

/** Reception main area: one tap adds one unit of a product to the draft order. */
export function ProductPicker({ draft }: ProductPickerProps) {
	const catalog = useProducts();

	if (catalog.status === "loading") {
		return (
			<p className="m-0 p-4 text-xl leading-7 text-ink-2">
				Cargando productos…
			</p>
		);
	}
	if (catalog.status === "error") {
		return (
			<p role="alert" className="m-0 p-4 text-xl leading-7 font-bold">
				No se pudo cargar el catálogo: {catalog.message}
			</p>
		);
	}

	const food = catalog.products.filter(
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
		<div className="grid content-start gap-4 p-4 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
			<section
				aria-labelledby="kds-h-comida"
				className="flex min-w-0 flex-col gap-3"
			>
				<SectionTitle
					id="kds-h-comida"
					icon={
						<Utensils aria-hidden="true" strokeWidth={2.4} className="size-7" />
					}
				>
					Comida
				</SectionTitle>
				{food.map((product) => (
					<ProductGroup key={product.id} title={product.name} large columns={2}>
						{[true, false].map((withSalt) => {
							const label = `${product.name} ${withSalt ? "con sal" : "sin sal"}`;
							return (
								<ProductTile
									key={String(withSalt)}
									label={withSalt ? "Con sal" : "Sin sal"}
									aria={label}
									quantity={draft.quantityOf(lineKey(product.id, withSalt))}
									onAdd={() => draft.add(product, withSalt, label)}
								/>
							);
						})}
					</ProductGroup>
				))}
			</section>

			<section
				aria-labelledby="kds-h-bebida"
				className="flex min-w-0 flex-col gap-3"
			>
				<SectionTitle
					id="kds-h-bebida"
					icon={
						<CupSoda aria-hidden="true" strokeWidth={2.4} className="size-7" />
					}
				>
					Bebida
				</SectionTitle>
				{drinkGroups.map((group) => (
					<ProductGroup key={group.title} title={group.title} columns={3}>
						{group.items.map((product) => (
							<ProductTile
								key={product.id}
								label={product.name}
								aria={product.name}
								quantity={draft.quantityOf(lineKey(product.id, null))}
								onAdd={() => draft.add(product, null, product.name)}
								small
							/>
						))}
					</ProductGroup>
				))}
			</section>
		</div>
	);
}

function SectionTitle({
	id,
	icon,
	children,
}: {
	id: string;
	icon: ReactNode;
	children: ReactNode;
}) {
	return (
		<h2
			id={id}
			className="m-0 flex items-center gap-2.5 text-[28px] leading-[34px] font-bold"
		>
			{icon}
			{children}
		</h2>
	);
}

type ProductGroupProps = {
	title: string;
	large?: boolean;
	columns: 2 | 3;
	children: ReactNode;
};

function ProductGroup({
	title,
	large = false,
	columns,
	children,
}: ProductGroupProps) {
	return (
		<div className="flex flex-col gap-3 rounded-lg border-3 border-ink bg-card p-4">
			<h3
				className={cn(
					"m-0 font-bold",
					large ? "text-[28px] leading-[34px]" : "text-[22px] leading-7",
				)}
			>
				{title}
			</h3>
			<div
				className={cn(
					"grid gap-4",
					columns === 2 ? "grid-cols-2" : "grid-cols-3",
				)}
			>
				{children}
			</div>
		</div>
	);
}

type ProductTileProps = {
	label: string;
	aria: string;
	quantity: number;
	onAdd: () => void;
	/** Drinks use the design's 20px tile text. */
	small?: boolean;
};

function ProductTile({
	label,
	aria,
	quantity,
	onAdd,
	small = false,
}: ProductTileProps) {
	return (
		<Button
			type="button"
			variant={quantity > 0 ? "loaded" : "outline"}
			size="tile"
			aria-label={`Agregar ${aria}${quantity > 0 ? `. En la comanda: ${quantity}` : ""}`}
			onClick={onAdd}
			className={cn(small ? "gap-1.5 px-2.5 text-xl leading-[26px]" : "gap-2")}
		>
			<Plus
				aria-hidden="true"
				strokeWidth={3}
				className={small ? "size-5" : "size-5.5"}
			/>
			<span>{label}</span>
			{quantity > 0 && (
				<span
					key={quantity}
					aria-hidden="true"
					className="absolute -top-3 -right-2.5 inline-flex h-10 min-w-10 animate-kds-pop items-center justify-center rounded-full border-3 border-white bg-action px-2 text-xl leading-6 text-white"
				>
					{quantity}
				</span>
			)}
		</Button>
	);
}
