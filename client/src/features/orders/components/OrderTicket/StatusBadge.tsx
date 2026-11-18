import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_VIEW } from "../../order-status";
import type { OrderStatus } from "../../orders.types";

export function StatusBadge({ status }: { status: OrderStatus }) {
	const view = STATUS_VIEW[status];
	const Icon = view.icon;
	return (
		<Badge
			className={cn("rounded-md transition-colors duration-300", view.tone)}
		>
			<Icon aria-hidden="true" strokeWidth={2.2} />
			{view.label}
		</Badge>
	);
}
