import { ArrowRight, CupSoda } from "lucide-react";
import { FriesIcon } from "@/components/icons/FriesIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { displayStatus, STATUS_VIEW } from "../../order-status";
import { elapsedSeconds } from "../../order-time";
import type { Order } from "../../orders.types";
import { ItemSection } from "./ItemSection";
import { OrderNote } from "./OrderNote";
import { TicketHeader } from "./TicketHeader";

type OrderTicketProps = {
	order: Order;
	/** Current time in ms (one ticker per screen). */
	now: number;
	/** When this client saw the order delivered, if it did. */
	deliveredAt: number | undefined;
	onAdvance: (order: Order) => void;
};

/** "Comanda" card on ticket paper: status band, clock and progress, food and drinks, note, action. */
export function OrderTicket({
	order,
	now,
	deliveredAt,
	onAdvance,
}: OrderTicketProps) {
	const seconds = elapsedSeconds(order, now, deliveredAt);
	const status = displayStatus(order, seconds);
	const view = STATUS_VIEW[status];
	const finished = order.status === "FINISHED";
	const food = order.items.filter((item) => item.withSalt !== null);
	const drinks = order.items.filter((item) => item.withSalt === null);

	return (
		<Card
			aria-label={`Comanda #${order.id}, ${order.customerName}, ${view.label}`}
			className="tx-ticket relative animate-[kds-in_0.28s_ease-out_both] gap-6 overflow-hidden rounded-xl border border-border pt-8 pb-6 text-foreground shadow-sm ring-0"
		>
			<span
				aria-hidden="true"
				className={cn(
					"absolute inset-x-0 top-0 h-2 transition-[background] duration-300",
					view.band,
				)}
			/>
			<TicketHeader
				order={order}
				status={status}
				seconds={seconds}
				finished={finished}
			/>
			<div className="flex flex-col gap-4 px-6">
				{food.length > 0 && (
					<ItemSection
						title="Comida"
						icon={<FriesIcon width={14} height={14} />}
						items={food}
						finished={finished}
					/>
				)}
				{drinks.length > 0 && (
					<ItemSection
						title="Bebida"
						icon={<CupSoda aria-hidden="true" className="size-3.5" />}
						items={drinks}
						finished={finished}
						className={
							food.length > 0 ? "border-t border-border pt-4" : undefined
						}
					/>
				)}
				{order.notes && <OrderNote note={order.notes} />}
			</div>
			<div className="px-6">
				<Button
					variant={view.actionVariant}
					size="lg"
					className="w-full"
					onClick={() => onAdvance(order)}
				>
					{view.action}
					<ArrowRight aria-hidden="true" />
				</Button>
			</div>
		</Card>
	);
}
