import { Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatClock, type TimerLevel } from "../../order-time";
import { TIMER_VIEW } from "../../timer-view";

type TimerPillProps = {
	level: TimerLevel;
	seconds: number | null;
};

/** Mono clock pill; the fire pulses only when late. */
export function TimerPill({ level, seconds }: TimerPillProps) {
	return (
		<span
			className={cn(
				"inline-flex flex-none items-center gap-1 rounded-lg border px-2 py-0.5 font-mono text-sm font-semibold tabular-nums",
				TIMER_VIEW[level].tone,
			)}
		>
			{level === "late" ? (
				<Flame
					role="img"
					aria-label="Demorado"
					className="size-3.5 animate-[kds-pulse_1.4s_ease-in-out_infinite]"
				/>
			) : (
				<Clock aria-hidden="true" className="size-3.5" />
			)}
			{formatClock(seconds)}
		</span>
	);
}
