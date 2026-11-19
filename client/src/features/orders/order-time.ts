import type { Order } from "./orders.types";

/** "Pasan a Urgente a los 10 min" (Tablero). */
export const URGENT_AFTER_S = 10 * 60;
const WARN_AFTER_S = 5 * 60;

export type TimerLevel = "ok" | "warn" | "late" | "stopped";

/**
 * Seconds on the order's timer. It runs from `timerStartedAt`; once delivered it stops at the
 * delivery time (`updatedAt`). Both come from the server, so every screen shows the same value.
 */
export const elapsedSeconds = (order: Order, now: number): number => {
	const start = Date.parse(order.timerStartedAt);
	const end = order.status === "FINISHED" ? Date.parse(order.updatedAt) : now;
	return Math.max(0, Math.floor((end - start) / 1000));
};

/**
 * Same rule as the API (comanda.service.ts), for optimistic moves: reopening a delivered order
 * moves the timer start forward by the time it spent delivered, so it resumes from its total.
 */
export const timerStartAfter = (
	order: Order,
	next: Order["status"],
	changedAt: number,
): string => {
	if (order.status !== "FINISHED" || next === "FINISHED")
		return order.timerStartedAt;
	const timeDelivered = changedAt - Date.parse(order.updatedAt);
	return new Date(
		Date.parse(order.timerStartedAt) + timeDelivered,
	).toISOString();
};

/** Design cut-offs: green up to 5 min, yellow 5–10, red with fire after 10. */
export const timerLevel = (seconds: number, finished: boolean): TimerLevel => {
	if (finished) return "stopped";
	if (seconds < WARN_AFTER_S) return "ok";
	if (seconds < URGENT_AFTER_S) return "warn";
	return "late";
};

/** Progress bar fills over 10 minutes; full once delivered. */
export const waitPercent = (seconds: number, finished: boolean): number =>
	finished ? 100 : Math.min(100, Math.round(seconds / 6));

export const formatClock = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const rest = seconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};
