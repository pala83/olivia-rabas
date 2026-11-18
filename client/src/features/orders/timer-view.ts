import { Check, Clock, Flame, type LucideIcon } from "lucide-react";
import type { TimerLevel } from "./order-time";

type TimerView = {
	label: string;
	icon: LucideIcon;
	/** Badge / pill colors. */
	tone: string;
	/** Progress track and fill. */
	track: string;
	fill: string;
};

/** Timer levels: word + icon + color + bar, never color alone. */
export const TIMER_VIEW: Record<TimerLevel, TimerView> = {
	ok: {
		label: "A tiempo",
		icon: Clock,
		tone: "border-chart-2 bg-chart-2 text-white",
		track: "bg-chart-2/18",
		fill: "bg-chart-2",
	},
	warn: {
		label: "Atención",
		icon: Clock,
		tone: "border-[#E5B800] bg-chart-4 text-foreground",
		track: "bg-[rgb(202_138_4/0.22)]",
		fill: "bg-chart-4",
	},
	late: {
		label: "Demorado",
		icon: Flame,
		tone: "border-destructive bg-destructive text-white",
		track: "bg-destructive/18",
		fill: "bg-destructive",
	},
	stopped: {
		label: "Tiempo total",
		icon: Check,
		tone: "border-border bg-muted text-foreground",
		track: "bg-muted-foreground/16",
		fill: "bg-input",
	},
};
