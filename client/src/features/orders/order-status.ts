import {
	Bell,
	CircleCheck,
	CookingPot,
	type LucideIcon,
	TriangleAlert,
} from "lucide-react";
import type { OrderStatus } from "./orders.types";

type StatusView = {
	label: string;
	icon: LucideIcon;
	/** Tailwind classes for the colored band (background + readable ink). */
	band: string;
	/** Status the card button moves the order to. */
	next: OrderStatus;
	/** Label of the card button. */
	action: string;
};

/** Design states: Pedido, En preparación, Urgente, Entregado (API: ORDERED … FINISHED). */
export const STATUS_VIEW: Record<OrderStatus, StatusView> = {
	ORDERED: {
		label: "Pedido",
		icon: Bell,
		band: "bg-status-ordered text-white",
		next: "IN_PREPARATION",
		action: "Empezar a preparar",
	},
	IN_PREPARATION: {
		label: "En preparación",
		icon: CookingPot,
		band: "bg-status-preparing text-ink",
		next: "FINISHED",
		action: "Marcar entregada",
	},
	DELAYED: {
		label: "Urgente",
		icon: TriangleAlert,
		band: "bg-status-urgent text-white",
		next: "FINISHED",
		action: "Marcar entregada",
	},
	FINISHED: {
		label: "Entregado",
		icon: CircleCheck,
		band: "bg-status-delivered text-ink",
		next: "IN_PREPARATION",
		action: "Reabrir comanda",
	},
};

export type TimerLevel = "ok" | "warn" | "late" | "stopped";

const WARN_AFTER_S = 5 * 60;
const LATE_AFTER_S = 10 * 60;

export const timerLevel = (seconds: number, finished: boolean): TimerLevel => {
	if (finished) return "stopped";
	if (seconds < WARN_AFTER_S) return "ok";
	if (seconds < LATE_AFTER_S) return "warn";
	return "late";
};

export const formatClock = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const rest = seconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};
