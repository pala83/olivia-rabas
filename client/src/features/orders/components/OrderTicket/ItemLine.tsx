import { SaltTag } from "@/components/SaltTag";
import { cn } from "@/lib/utils";
import type { OrderItem } from "../../orders.types";

/** "2× Papas [Sin sal]"; delivered items are struck through. */
export function ItemLine({
	item,
	finished,
}: {
	item: OrderItem;
	finished: boolean;
}) {
	return (
		<li
			className={cn(
				"flex items-center gap-2.5 text-lg leading-6 font-semibold",
				finished && "text-muted-foreground line-through",
			)}
		>
			<span className="min-w-[34px] flex-none font-mono">{item.quantity}×</span>
			<span>{item.productName}</span>
			{item.withSalt !== null && (
				<SaltTag withSalt={item.withSalt} className="no-underline" />
			)}
		</li>
	);
}
