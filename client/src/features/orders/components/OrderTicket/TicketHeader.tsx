import { GripVertical } from "lucide-react";
import { formatClock, timerLevel, waitPercent } from "../../order-time";
import type { Order, OrderStatus } from "../../orders.types";
import { StatusBadge } from "./StatusBadge";
import { TimerBadge } from "./TimerBadge";
import { WaitProgress } from "./WaitProgress";

type TicketHeaderProps = {
	order: Order;
	status: OrderStatus;
	seconds: number;
	finished: boolean;
};

/** Status, table and number on the left; clock on the right; progress below; perforated edge. */
export function TicketHeader({
	order,
	status,
	seconds,
	finished,
}: TicketHeaderProps) {
	const level = timerLevel(seconds, finished);

	return (
		<header className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 border-b-2 border-dashed border-border px-6 pb-6">
			<div className="flex min-w-0 flex-col gap-2">
				<div className="flex flex-wrap gap-1.5">
					<StatusBadge status={status} />
				</div>
				<h3 className="m-0 truncate text-xl leading-6 font-semibold">
					{order.customerName}
				</h3>
				<span className="font-mono text-sm text-muted-foreground">
					Comanda #{order.id}
				</span>
			</div>
			<div className="flex flex-col items-end gap-2">
				<div className="flex items-center gap-2">
					<span className="font-mono text-[28px] leading-8 font-semibold tabular-nums">
						{formatClock(seconds)}
					</span>
					<GripVertical
						role="img"
						aria-label="Se puede arrastrar"
						strokeWidth={2.4}
						className="size-4.5 text-muted-foreground"
					/>
				</div>
				<TimerBadge level={level} />
			</div>
			<WaitProgress
				level={level}
				seconds={seconds}
				percent={waitPercent(seconds, finished)}
			/>
		</header>
	);
}
