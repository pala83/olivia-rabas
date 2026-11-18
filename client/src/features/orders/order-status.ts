import {
	CircleCheck,
	CookingPot,
	type LucideIcon,
	ReceiptText,
	TriangleAlert,
} from "lucide-react";
import { URGENT_AFTER_S } from "./order-time";
import type { Order, OrderStatus } from "./orders.types";

type StatusView = {
	label: string;
	icon: LucideIcon;
	/** Badge / lane header / status square: background, text and border. */
	tone: string;
	/** Top band of the ticket and left band of the compact order. */
	band: string;
	/** Status the card button moves the order to, and its label. */
	next: OrderStatus;
	action: string;
	actionVariant: "default" | "outline";
};

/** Design states (Fritería · Fundamentos): Pedido, En preparación, Urgente, Entregado. */
export const STATUS_VIEW: Record<OrderStatus, StatusView> = {
	ORDERED: {
		label: "Pedido",
		icon: ReceiptText,
		tone: "border-chart-1 bg-chart-1 text-white",
		band: "bg-chart-1",
		next: "IN_PREPARATION",
		action: "Empezar a preparar",
		actionVariant: "default",
	},
	IN_PREPARATION: {
		label: "En preparación",
		icon: CookingPot,
		tone: "border-primary bg-primary text-primary-foreground",
		band: "bg-primary",
		next: "FINISHED",
		action: "Marcar entregada",
		actionVariant: "default",
	},
	DELAYED: {
		label: "Urgente",
		icon: TriangleAlert,
		tone: "border-destructive bg-destructive text-white",
		band: "bg-[repeating-linear-gradient(135deg,var(--destructive)_0_10px,var(--card)_10px_20px)]",
		next: "FINISHED",
		action: "Marcar entregada",
		actionVariant: "default",
	},
	FINISHED: {
		label: "Entregado",
		icon: CircleCheck,
		tone: "border-chart-2/40 bg-chart-3 text-chart-5",
		band: "bg-chart-2",
		next: "IN_PREPARATION",
		action: "Reabrir comanda",
		actionVariant: "outline",
	},
};

/**
 * Status shown on screen. Like the design, an undelivered order that has waited
 * 10 minutes is shown as Urgente; the API status is not changed.
 */
export const displayStatus = (
	order: Order,
	seconds: number | null,
): OrderStatus =>
	order.status !== "FINISHED" && (seconds ?? 0) >= URGENT_AFTER_S
		? "DELAYED"
		: order.status;
