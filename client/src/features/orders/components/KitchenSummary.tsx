import { Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Order } from "../orders.types";
import { OrderCard } from "./OrderCard";

const RECENT_LIMIT = 4;

type KitchenSummaryProps = {
	orders: Order[];
	now: number;
	deliveredAt: Record<number, number>;
	/** Opens the full kitchen board (the design's "maximized sidebar"). */
	onExpand: () => void;
};

/** Reception sidebar: pending count and the latest pending orders in compact form. */
export function KitchenSummary({
	orders,
	now,
	deliveredAt,
	onExpand,
}: KitchenSummaryProps) {
	const pending = orders.filter((order) => order.status !== "FINISHED");
	const recent = [...pending]
		.sort((a, b) => b.id - a.id)
		.slice(0, RECENT_LIMIT);

	return (
		<div className="flex h-full min-h-0 flex-col gap-3 bg-bar p-3 text-white">
			<div className="flex min-h-11 items-center gap-2.5">
				<h2 className="m-0 text-2xl leading-[30px] font-bold">En cocina</h2>
				<span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-card px-2 text-[22px] leading-6 font-bold text-bar">
					{pending.length}
					<span className="sr-only"> comandas pendientes</span>
				</span>
			</div>
			<ScrollArea className="min-h-0 flex-1">
				<ul className="m-0 flex list-none flex-col gap-3 p-0">
					{recent.map((order) => (
						<li key={order.id}>
							<OrderCard
								order={order}
								now={now}
								deliveredAt={deliveredAt[order.id]}
								compact
							/>
						</li>
					))}
				</ul>
				{pending.length === 0 && (
					<p className="m-0 text-xl leading-7">No hay comandas en cocina.</p>
				)}
			</ScrollArea>
			<Button variant="inverse" size="md" onClick={onExpand} className="w-full">
				<Scan aria-hidden="true" strokeWidth={2.6} />
				Ver tablero de cocina
			</Button>
		</div>
	);
}
