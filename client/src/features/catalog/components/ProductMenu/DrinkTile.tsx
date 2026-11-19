import { Plus } from "lucide-react";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";
import { lineKey } from "@/features/order-draft/use-order-draft";
import { cn } from "@/lib/utils";
import type { Product } from "../../catalog.types";
import { productArt, productArtBackground } from "../../product-art";

/** The whole tile is the button; one tap adds one unit. */
export function DrinkTile({ product }: { product: Product }) {
	const { add, quantityOf } = useOrderDraftContext();
	const quantity = quantityOf(lineKey(product.id, null));
	const art = productArt(product.name);
	const loaded = quantity > 0;

	return (
		<button
			type="button"
			aria-label={`Sumar ${product.name}. En la comanda: ${quantity}`}
			onClick={() => add(product, null)}
			className={cn(
				"lift relative flex min-h-20 min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-3 text-left text-foreground active:scale-97",
				loaded
					? "border-primary bg-[#FFF4D6] shadow-[0_0_0_3px_rgb(242_165_26/0.35)]"
					: "border-border bg-card shadow-sm",
			)}
		>
			<span
				aria-hidden="true"
				className={cn(
					"flex size-14 flex-none items-center justify-center rounded-[10px]",
					productArtBackground(true, product.containsAlcohol),
				)}
			>
				{art && (
					<img
						src={art}
						alt=""
						width={48}
						height={48}
						className="block size-12"
					/>
				)}
			</span>
			<span className="min-w-0 flex-auto text-base leading-5 font-semibold">
				{product.name}
			</span>
			<span
				aria-hidden="true"
				className="flex size-8 flex-none items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs"
			>
				<Plus className="size-4" strokeWidth={2.4} />
			</span>
			{loaded && (
				<span
					key={quantity}
					aria-hidden="true"
					className="absolute -top-2 -right-2 inline-flex h-6 min-w-6 animate-[kds-pop_0.3s_ease-out] items-center justify-center rounded-lg border-2 border-background bg-foreground px-1.5 font-mono text-xs font-semibold text-[#FFF8EE]"
				>
					{quantity}
				</span>
			)}
		</button>
	);
}
