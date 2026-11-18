import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { TimerLevel } from "../../order-time";
import { TIMER_VIEW } from "../../timer-view";

type WaitProgressProps = {
	level: TimerLevel;
	seconds: number | null;
	percent: number;
};

/** shadcn Progress: fills over 10 minutes, colored like the clock. */
export function WaitProgress({ level, seconds, percent }: WaitProgressProps) {
	const view = TIMER_VIEW[level];
	const minutes = Math.min(10, Math.floor((seconds ?? 0) / 60));

	return (
		<ProgressPrimitive.Root
			value={percent}
			aria-label="Minutos de espera"
			aria-valuetext={`${minutes} de 10 minutos`}
			className="col-span-2 mt-2.5"
		>
			<ProgressTrack className={cn("h-2", view.track)}>
				<ProgressIndicator
					className={cn(
						"transition-[width,background-color] duration-[600ms,400ms]",
						view.fill,
					)}
				/>
			</ProgressTrack>
		</ProgressPrimitive.Root>
	);
}
