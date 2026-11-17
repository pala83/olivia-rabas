import { Check, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatClock, type TimerLevel } from "../order-status";

const LEVELS: Record<
	TimerLevel,
	{ label: string; bars: number; className: string }
> = {
	ok: { label: "A tiempo", bars: 1, className: "bg-timer-ok text-white" },
	warn: { label: "Atención", bars: 2, className: "bg-timer-warn text-ink" },
	late: { label: "Demorado", bars: 3, className: "bg-timer-late text-white" },
	stopped: { label: "Total", bars: 0, className: "bg-card text-ink" },
};

type OrderTimerProps = {
	level: TimerLevel;
	/** null when the elapsed time is unknown (delivered before this page loaded). */
	seconds: number | null;
};

/** The 116px clock block: word + icon, mm:ss and 1–3 filled bars (never color alone). */
export function OrderTimer({ level, seconds }: OrderTimerProps) {
	const view = LEVELS[level];
	const Icon = level === "late" ? Flame : level === "stopped" ? Check : Clock;

	return (
		<div
			className={cn(
				"flex w-29 flex-none flex-col items-center justify-center gap-0.75 border-l-3 border-ink px-1.5 py-2 transition-colors duration-400",
				view.className,
			)}
		>
			<span className="inline-flex items-center gap-1 text-base leading-5 font-bold whitespace-nowrap">
				<Icon
					aria-hidden="true"
					strokeWidth={2.6}
					className={cn(
						"size-4",
						level === "late" && "size-4.5 animate-kds-pulse",
					)}
				/>
				{seconds === null && level === "stopped" ? "Entregada" : view.label}
			</span>
			<span className="text-[30px] leading-8 font-bold tabular-nums">
				{seconds === null ? "--:--" : formatClock(seconds)}
			</span>
			<span aria-hidden="true" className="flex gap-1">
				{[1, 2, 3].map((bar) => (
					<span
						key={bar}
						className={cn(
							"h-2 w-7 rounded-sm border-2 border-current transition-colors duration-400",
							bar <= view.bars ? "bg-current" : "bg-transparent",
						)}
					/>
				))}
			</span>
		</div>
	);
}
