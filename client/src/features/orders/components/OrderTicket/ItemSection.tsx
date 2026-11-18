import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { OrderItem } from "../../orders.types";
import { ItemLine } from "./ItemLine";

type ItemSectionProps = {
	title: string;
	icon: ReactNode;
	items: OrderItem[];
	finished: boolean;
	className?: string;
};

/** "Comida" or "Bebida" list of the ticket. */
export function ItemSection({
	title,
	icon,
	items,
	finished,
	className,
}: ItemSectionProps) {
	return (
		<section className={cn("flex flex-col gap-2", className)}>
			<h4 className="m-0 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
				{icon}
				{title}
			</h4>
			<ul className="m-0 flex list-none flex-col gap-2 p-0">
				{items.map((item) => (
					<ItemLine key={item.id} item={item} finished={finished} />
				))}
			</ul>
		</section>
	);
}
