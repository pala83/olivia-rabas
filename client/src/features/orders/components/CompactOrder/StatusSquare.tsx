import { cn } from "@/lib/utils";
import { STATUS_VIEW } from "../../order-status";
import type { OrderStatus } from "../../orders.types";

/** 32 px square with the status icon (the label is next to it). */
export function StatusSquare({ status }: { status: OrderStatus }) {
	const view = STATUS_VIEW[status];
	const Icon = view.icon;
	return (
		<span
			aria-hidden="true"
			className={cn(
				"flex size-8 flex-none items-center justify-center rounded-md border",
				view.tone,
			)}
		>
			<Icon className="size-4" />
		</span>
	);
}
