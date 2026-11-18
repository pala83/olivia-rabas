import type { Order } from "./orders.types";

/** "Pasan a Urgente a los 10 min" (Tablero). */
export const URGENT_AFTER_S = 10 * 60;
const WARN_AFTER_S = 5 * 60;

export type TimerLevel = "ok" | "warn" | "late" | "stopped";

/**
 * Seconds the order has been waiting. Delivered orders freeze at the moment this client
 * saw the delivery; null when that moment is unknown (delivered before the page loaded).
 */
export const elapsedSeconds = (
	order: Order,
	now: number,
	deliveredAt: number | undefined,
): number | null => {
	const start = Date.parse(order.createdAt);
	if (order.status === "FINISHED") {
		return deliveredAt === undefined
			? null
			: Math.max(0, Math.floor((deliveredAt - start) / 1000));
	}
	return Math.max(0, Math.floor((now - start) / 1000));
};

/** Design cut-offs: green up to 5 min, yellow 5–10, red with fire after 10. */
export const timerLevel = (
	seconds: number | null,
	finished: boolean,
): TimerLevel => {
	if (finished) return "stopped";
	const value = seconds ?? 0;
	if (value < WARN_AFTER_S) return "ok";
	if (value < URGENT_AFTER_S) return "warn";
	return "late";
};

/** Progress bar fills over 10 minutes; full once delivered. */
export const waitPercent = (
	seconds: number | null,
	finished: boolean,
): number => (finished ? 100 : Math.min(100, Math.round((seconds ?? 0) / 6)));

export const formatClock = (seconds: number | null): string => {
	if (seconds === null) return "--:--";
	const minutes = Math.floor(seconds / 60);
	const rest = seconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};
