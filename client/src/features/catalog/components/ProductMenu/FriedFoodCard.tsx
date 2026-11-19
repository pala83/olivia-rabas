import { Card } from "@/components/ui/card";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";
import type { Product } from "../../catalog.types";
import { productArt } from "../../product-art";
import { OilBubbles } from "./OilBubbles";
import { SaltVariantButton } from "./SaltVariantButton";

/** Fried product: illustration over hot oil, then "Con sal" / "Sin sal". */
export function FriedFoodCard({ product }: { product: Product }) {
	const { quantityOfProduct } = useOrderDraftContext();
	const art = productArt(product.name);
	const inOrder = quantityOfProduct(product.id);

	return (
		<Card className="lift min-w-0 gap-5 overflow-hidden rounded-xl border border-border pt-0 pb-6 shadow-sm ring-0">
			<div className="tx-aceite relative flex h-46 items-end justify-center overflow-hidden">
				<OilBubbles />
				<div
					aria-hidden="true"
					className="tx-cuadros absolute inset-x-0 bottom-0 h-5.5 border-t border-foreground"
				/>
				{art && (
					<img
						src={art}
						alt=""
						width={164}
						height={164}
						className="relative mb-1.5 block size-41 drop-shadow-[0_6px_8px_rgb(43_27_16/0.28)]"
					/>
				)}
				{inOrder > 0 && (
					<span
						key={inOrder}
						className="absolute top-3 right-3 inline-flex animate-[kds-pop_0.3s_ease-out] items-center rounded-lg border border-foreground bg-foreground px-2 py-0.5 text-xs font-medium text-[#FFF8EE]"
					>
						{inOrder} en la comanda
					</span>
				)}
			</div>
			<div className="flex flex-col gap-1.5 px-6">
				<h3 className="m-0 font-serif text-[28px] leading-7.5 tracking-[0.01em]">
					{product.name}
				</h3>
				<p className="m-0 text-sm text-muted-foreground">Porción</p>
			</div>
			<div className="flex gap-2 px-6">
				<SaltVariantButton product={product} withSalt />
				<SaltVariantButton product={product} withSalt={false} />
			</div>
		</Card>
	);
}
