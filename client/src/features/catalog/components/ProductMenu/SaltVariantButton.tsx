import { NoSaltIcon } from "@/components/icons/NoSaltIcon";
import { SaltIcon } from "@/components/icons/SaltIcon";
import { Button } from "@/components/ui/button";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";
import { lineKey } from "@/features/order-draft/use-order-draft";
import { cn } from "@/lib/utils";
import type { Product } from "../../catalog.types";

type SaltVariantButtonProps = {
	product: Product;
	withSalt: boolean;
};

/** "Con sal" / "Sin sal": adds one portion; when loaded, gold border and a dark count. */
export function SaltVariantButton({
	product,
	withSalt,
}: SaltVariantButtonProps) {
	const { add, quantityOf } = useOrderDraftContext();
	const quantity = quantityOf(lineKey(product.id, withSalt));
	const label = withSalt ? "Con sal" : "Sin sal";
	const Icon = withSalt ? SaltIcon : NoSaltIcon;

	return (
		<Button
			variant="outline"
			size="lg"
			aria-label={`Sumar ${product.name} ${label.toLowerCase()}. En la comanda: ${quantity}`}
			onClick={() => add(product, withSalt)}
			className={cn(
				"min-w-0 flex-1 px-3",
				quantity > 0 && "border-primary bg-[#FFF4D6]",
			)}
		>
			<Icon />
			{label}
			{quantity > 0 && (
				<span
					key={quantity}
					aria-hidden="true"
					className="inline-flex min-w-5 animate-[kds-pop_0.3s_ease-out] items-center justify-center rounded-md bg-foreground px-1.5 font-mono text-xs leading-[18px] font-semibold text-[#FFF8EE]"
				>
					{quantity}
				</span>
			)}
		</Button>
	);
}
