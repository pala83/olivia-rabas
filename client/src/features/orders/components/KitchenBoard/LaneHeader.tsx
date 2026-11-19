import { cn } from "@/lib/utils";
import { STATUS_VIEW } from "../../order-status";
import type { OrderStatus } from "../../orders.types";

type LaneHeaderProps = {
	status: OrderStatus;
	count: number;
};

export function LaneHeader({ status, count }: LaneHeaderProps) {
	const view = STATUS_VIEW[status];
	const Icon = view.icon;
	return (
		<h3
			className={cn(
				"m-0 flex h-10 items-center justify-between gap-2 rounded-[10px] border pr-2 pl-3 text-base font-semibold",
				view.tone,
			)}
		>
			<span className="inline-flex items-center gap-2">
				<Icon aria-hidden="true" className="size-4" />
				{view.label}
			</span>
			<span className="inline-flex h-6 min-w-7 items-center justify-center rounded-lg bg-card px-2 font-mono text-xs font-semibold text-foreground">
				{count}
				<span className="sr-only"> comandas</span>
			</span>
		</h3>
	);
}
