import { EmptyState } from "@/components/EmptyState";
import { SteelRail } from "@/components/SteelRail";
import { useOrderDraftContext } from "@/contexts/order-draft/use-order-draft-context";
import { useOrdersContext } from "@/contexts/orders/use-orders-context";
import { useNow } from "../../use-now";
import { CompactOrder } from "../CompactOrder/CompactOrder";
import { KitchenPanelHeader } from "./KitchenPanelHeader";

const VISIBLE = 6;

/** Steel column at reception: a summary of what the kitchen has (newest first). */
export function KitchenPanel() {
	const now = useNow();
	const { orders } = useOrdersContext();
	const { lastSentId } = useOrderDraftContext();
	const pending = orders
		.filter((order) => order.status !== "FINISHED")
		.sort((a, b) => b.id - a.id);
	const hidden = pending.length - VISIBLE;

	return (
		<>
			<KitchenPanelHeader pending={pending.length} />
			<SteelRail />
			{/* Only the list scrolls; the header and the rail stay put. */}
			<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-1 *:shrink-0">
				{pending.slice(0, VISIBLE).map((order) => (
					<CompactOrder
						key={order.id}
						order={order}
						now={now}
						isNew={order.id === lastSentId}
					/>
				))}
				{hidden > 0 && (
					<p className="m-0 px-1 text-sm text-[#4A3727]">
						{hidden === 1
							? "Y 1 comanda más en el tablero."
							: `Y ${hidden} comandas más en el tablero.`}
					</p>
				)}
				{pending.length === 0 && (
					<EmptyState
						title="La cocina está al día"
						description="Las comandas que envíes aparecen acá."
						className="border-foreground/35 p-6 [&>span:last-child]:text-[#4A3727]"
					/>
				)}
			</div>
		</>
	);
}
