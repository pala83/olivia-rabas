import { cn } from "@/lib/utils";
import { displayStatus, STATUS_VIEW } from "../../order-status";
import { elapsedSeconds, timerLevel } from "../../order-time";
import type { Order } from "../../orders.types";
import { StatusSquare } from "./StatusSquare";
import { TimerPill } from "./TimerPill";

type CompactOrderProps = {
	order: Order;
	now: number;
	/** Slide in from the right (the order this screen just sent). */
	isNew?: boolean;
};

/** Summary row for "En cocina": status, table, number and clock. */
export function CompactOrder({ order, now, isNew = false }: CompactOrderProps) {
	const seconds = elapsedSeconds(order, now);
	const status = displayStatus(order, seconds);
	const view = STATUS_VIEW[status];

	return (
		<article
			aria-label={`Comanda #${order.id}, ${order.customerName}, ${view.label}`}
			className={cn(
				"tx-ticket relative flex items-center gap-4 overflow-hidden rounded-lg border border-border py-4 pr-4 pl-5.5 shadow-xs",
				isNew
					? "animate-[kds-new_0.4s_ease-out_both]"
					: "animate-[kds-in_0.28s_ease-out_both]",
			)}
		>
			<span
				aria-hidden="true"
				className={cn("absolute inset-y-0 left-0 w-1.5", view.band)}
			/>
			<StatusSquare status={status} />
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex items-baseline gap-2">
					<span className="truncate text-sm leading-4.5 font-medium">
						{order.customerName}
					</span>
					<span className="font-mono text-sm text-muted-foreground">
						#{order.id}
					</span>
				</div>
				<span className="text-sm text-muted-foreground">{view.label}</span>
			</div>
			<TimerPill
				level={timerLevel(seconds, order.status === "FINISHED")}
				seconds={seconds}
			/>
		</article>
	);
}
