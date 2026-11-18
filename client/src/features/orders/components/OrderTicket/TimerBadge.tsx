import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TimerLevel } from "../../order-time";
import { TIMER_VIEW } from "../../timer-view";

type TimerBadgeProps = {
	level: TimerLevel;
	/** Delivered before this page loaded: the total time is unknown. */
	unknown: boolean;
};

export function TimerBadge({ level, unknown }: TimerBadgeProps) {
	const view = TIMER_VIEW[level];
	const Icon = view.icon;
	return (
		<Badge
			className={cn(
				"rounded-md font-semibold transition-colors duration-400",
				view.tone,
			)}
		>
			<Icon
				aria-hidden="true"
				strokeWidth={2.4}
				className={cn(
					level === "late" && "animate-[kds-pulse_1.4s_ease-in-out_infinite]",
				)}
			/>
			{unknown ? "Entregada" : view.label}
		</Badge>
	);
}
